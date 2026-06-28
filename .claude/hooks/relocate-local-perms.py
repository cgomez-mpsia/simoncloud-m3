#!/usr/bin/env python3
"""
Relocate machine-specific permissions out of the shared .claude/settings.json
into .claude/settings.local.json (gitignored).

Triggered as a SessionEnd hook. Idempotent and fail-safe: any error exits 0
without touching files, so it can never block a session from ending.

Rule: a permissions.allow entry or additionalDirectories entry that contains an
absolute home path (/Users/ or /home/) is "this machine only" and belongs in the
local file. Portable globs (npm run *, git checkout *, ...) stay in settings.json.

See CLAUDE.md §11 for the convention.
"""
import json
import os
import subprocess
import sys

ABSOLUTE_MARKERS = ("/Users/", "/home/", "/root/")


def is_machine_specific(rule: str) -> bool:
    return any(marker in rule for marker in ABSOLUTE_MARKERS)


def load(path: str) -> dict:
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except FileNotFoundError:
        return {}
    except (json.JSONDecodeError, OSError):
        # Malformed/unreadable target — bail out, never destroy data.
        sys.exit(0)


def dump(path: str, data: dict) -> None:
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
        fh.write("\n")


def main() -> None:
    project_dir = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
    shared_path = os.path.join(project_dir, ".claude", "settings.json")
    local_path = os.path.join(project_dir, ".claude", "settings.local.json")

    shared = load(shared_path)
    if not isinstance(shared, dict):
        sys.exit(0)
    perms = shared.get("permissions")
    if not isinstance(perms, dict):
        sys.exit(0)

    moved_allow = [r for r in perms.get("allow", []) if isinstance(r, str) and is_machine_specific(r)]
    moved_dirs = [d for d in perms.get("additionalDirectories", []) if isinstance(d, str) and is_machine_specific(d)]

    if not moved_allow and not moved_dirs:
        sys.exit(0)  # nothing to relocate

    local = load(local_path)
    if not isinstance(local, dict):
        local = {}
    local_perms = local.setdefault("permissions", {})

    def merge(target_key: str, incoming: list) -> None:
        existing = local_perms.get(target_key, [])
        if not isinstance(existing, list):
            existing = []
        for item in incoming:
            if item not in existing:
                existing.append(item)
        if existing:
            local_perms[target_key] = existing

    merge("allow", moved_allow)
    merge("additionalDirectories", moved_dirs)

    # Strip the relocated entries from the shared file.
    if moved_allow:
        perms["allow"] = [r for r in perms.get("allow", []) if r not in moved_allow]
    if moved_dirs:
        perms["additionalDirectories"] = [d for d in perms.get("additionalDirectories", []) if d not in moved_dirs]
        if not perms["additionalDirectories"]:
            del perms["additionalDirectories"]

    dump(local_path, local)
    dump(shared_path, shared)

    # Pre-commit mode: if settings.json is already staged for this commit, refresh
    # the staged copy with the cleaned content. Never stage it if the user did not
    # already stage it — we must not inject an unrelated file into their commit.
    if os.environ.get("RELOCATE_RESTAGE"):
        restage_if_staged(project_dir)

    moved = len(moved_allow) + len(moved_dirs)
    print(json.dumps({
        "systemMessage": f"Reubicados {moved} permisos de máquina a settings.local.json"
    }))


def restage_if_staged(project_dir: str) -> None:
    try:
        staged = subprocess.run(
            ["git", "-C", project_dir, "diff", "--cached", "--name-only"],
            capture_output=True, text=True, timeout=5,
        ).stdout.splitlines()
        if ".claude/settings.json" in staged:
            subprocess.run(
                ["git", "-C", project_dir, "add", "--", ".claude/settings.json"],
                capture_output=True, timeout=5,
            )
    except Exception:
        pass


if __name__ == "__main__":
    try:
        main()
    except Exception:
        sys.exit(0)
