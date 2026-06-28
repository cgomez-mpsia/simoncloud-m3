# PR-UC-005 — Componente React Uploader con Progress y SHA-256

| Campo | Valor |
|-------|-------|
| **ID** | `PR-UC-005` |
| **Título** | Componente React de subida de archivos con barra de progreso |
| **Artefacto origen** | `docs/fsd/FSD_vFinal.md §4.2 FSD-UC-002 (UI)` |
| **Tipo** | Generación / Frontend |
| **Modelo** | Claude Sonnet 4 |
| **Temperatura** | 0.0 |
| **Versión** | v1.0 |
| **Fecha** | 2026-05-17 |
| **Estado** | applied |

## Role
```
Eres un Frontend Engineer experto en React 18, TypeScript y Tailwind CSS,
con experiencia en drag-and-drop y manejo de FormData para file upload.
```

## Task
```
Crear un componente React que permita arrastrar archivos o seleccionarlos
con un input, subirlos al backend via multipart/form-data con XMLHttpRequest
(para poder mostrar progreso en %), y mostrar el hash SHA-256 retornado.
```

## Context
```
- Fuente: FSD-UC-002 en docs/fsd/FSD_vFinal.md
- Stack: React 18, TypeScript 5, Tailwind CSS
- Endpoint: POST /api/drops/:dropId/upload (multipart, campo 'file')
- Respuesta incluye: { sha256Hash: string, publicUrl: string, filename: string }
- UX: barra de progreso con %, hash visible post-upload, drag-and-drop visual
```

## Reasoning
```
1. onDragOver / onDrop handlers para área de drag-and-drop
2. XMLHttpRequest con upload.onprogress para % real
3. FormData con file adjunto
4. Al completar: mostrar sha256Hash en badge monoespaciado
5. Estado: idle | uploading (0-100%) | done | error
```

## Output Esperado
```tsx
const [progress, setProgress] = useState(0);
const xhr = new XMLHttpRequest();
xhr.upload.onprogress = (e) => setProgress(Math.round(e.loaded / e.total * 100));
xhr.onload = () => { const result = JSON.parse(xhr.responseText); setFile(result); };
const fd = new FormData();
fd.append('file', selectedFile);
xhr.open('POST', `/api/drops/${dropId}/upload`);
xhr.setRequestHeader('Authorization', `Bearer ${token}`);
xhr.send(fd);
```

## Invariantes
- **MUST** usar XMLHttpRequest (no fetch) para acceder a onprogress
- **MUST** mostrar sha256Hash del servidor, nunca calcularlo en el cliente
- **MUST** manejar estado de error con mensaje visible

## Failure Modes
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_FETCH_NO_PROGRESS` | Usar fetch sin streams | Sin progreso real; cambiar a XHR |
| `E_CLIENT_HASH` | Hash calculado en browser | Inseguro; siempre usar hash del servidor |
