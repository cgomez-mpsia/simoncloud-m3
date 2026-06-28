import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder, FolderOpen, Trash2, Lock, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { api, Drop } from '../api';
import AppHeader from '../components/AppHeader';
import { DropCardSkeleton } from '../components/Skeleton';
import { formatRelative } from '../utils/format';

export default function DocenteDashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api.listDrops(token)
      .then(setDrops)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !form.name.trim()) return;
    setFormError('');
    setSaving(true);
    try {
      const drop = await api.createDrop(form.name.trim(), form.description.trim(), token);
      setDrops((prev) => [drop, ...prev]);
      setForm({ name: '', description: '' });
      setCreating(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error al crear');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = async (id: string) => {
    if (!token) return;
    setConfirmClose(null);
    const updated = await api.closeDrop(id, token);
    setDrops((prev) => prev.map((d) => d.id === id ? { ...d, status: updated.status } : d));
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setConfirmDelete(null);
    await api.deleteDrop(id, token);
    setDrops((prev) => prev.filter((d) => d.id !== id));
  };

  const openDrops = drops.filter(d => d.status === 'OPEN');
  const closedDrops = drops.filter(d => d.status !== 'OPEN');

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="SimonCloud" subtitle="Panel de docente">
        <button
          onClick={() => { setCreating(true); setFormError(''); }}
          className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo SimonDrop
        </button>
      </AppHeader>

      <main className="max-w-3xl mx-auto p-6 space-y-5">

        {/* Modal inline para crear */}
        {creating && (
          <div className="bg-white border border-indigo-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-indigo-100 bg-indigo-50">
              <h2 className="font-semibold text-indigo-900 text-sm">Nuevo SimonDrop</h2>
              <button onClick={() => setCreating(false)} className="text-indigo-400 hover:text-indigo-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-3">
              <input
                autoFocus
                required
                placeholder="Nombre del buzón (ej. Proyecto Final Programación)"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                placeholder="Descripción (opcional)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {formError && <p className="text-red-500 text-sm">{formError}</p>}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Creando...' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="text-gray-500 px-4 py-2 text-sm hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <DropCardSkeleton key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && drops.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto">
              <FolderOpen className="w-8 h-8 text-indigo-300" />
            </div>
            <p className="font-medium text-gray-700">No tienes SimonDrops aún</p>
            <p className="text-sm text-gray-400">Crea el primero para empezar a recibir entregas</p>
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 mt-2"
            >
              <Plus className="w-4 h-4" /> Crear SimonDrop
            </button>
          </div>
        )}

        {/* Buzones abiertos */}
        {!loading && openDrops.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
              Abiertos · {openDrops.length}
            </h2>
            {openDrops.map((drop) => (
              <DropCard
                key={drop.id}
                drop={drop}
                onOpen={() => navigate(`/drops/${drop.id}`)}
                onClose={() => setConfirmClose(drop.id)}
                onDelete={() => setConfirmDelete(drop.id)}
                confirmClose={confirmClose === drop.id}
                confirmDelete={confirmDelete === drop.id}
                onConfirmClose={() => handleClose(drop.id)}
                onConfirmDelete={() => handleDelete(drop.id)}
                onCancelClose={() => setConfirmClose(null)}
                onCancelDelete={() => setConfirmDelete(null)}
              />
            ))}
          </section>
        )}

        {/* Buzones cerrados */}
        {!loading && closedDrops.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
              Cerrados · {closedDrops.length}
            </h2>
            {closedDrops.map((drop) => (
              <DropCard
                key={drop.id}
                drop={drop}
                onOpen={() => navigate(`/drops/${drop.id}`)}
                onClose={() => setConfirmClose(drop.id)}
                onDelete={() => setConfirmDelete(drop.id)}
                confirmClose={confirmClose === drop.id}
                confirmDelete={confirmDelete === drop.id}
                onConfirmClose={() => handleClose(drop.id)}
                onConfirmDelete={() => handleDelete(drop.id)}
                onCancelClose={() => setConfirmClose(null)}
                onCancelDelete={() => setConfirmDelete(null)}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

interface DropCardProps {
  drop: Drop;
  onOpen: () => void;
  onClose: () => void;
  onDelete: () => void;
  confirmClose: boolean;
  confirmDelete: boolean;
  onConfirmClose: () => void;
  onConfirmDelete: () => void;
  onCancelClose: () => void;
  onCancelDelete: () => void;
}

function DropCard({ drop, onOpen, onClose, onDelete, confirmClose, confirmDelete, onConfirmClose, onConfirmDelete, onCancelClose, onCancelDelete }: DropCardProps) {
  const isOpen = drop.status === 'OPEN';

  return (
    <div className={`bg-white border rounded-2xl transition-all overflow-hidden ${
      isOpen ? 'border-gray-200 hover:border-indigo-200 hover:shadow-sm' : 'border-gray-100 opacity-75'
    }`}>
      <div className="p-4 flex items-start gap-3">
        {/* Icono clickeable */}
        <button onClick={onOpen} className="shrink-0 mt-0.5">
          {isOpen
            ? <FolderOpen className="w-5 h-5 text-indigo-500" />
            : <Folder className="w-5 h-5 text-gray-400" />}
        </button>

        {/* Info clickeable */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onOpen}>
          <p className="font-medium text-gray-900 truncate">{drop.name}</p>
          {drop.description && (
            <p className="text-sm text-gray-500 truncate">{drop.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {isOpen ? 'Abierto' : 'Cerrado'}
            </span>
            <span className="text-xs text-gray-400">
              {drop._count.files} {drop._count.files === 1 ? 'archivo' : 'archivos'}
            </span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{formatRelative(drop.createdAt)}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1 shrink-0 ml-1">
          <button onClick={onOpen} className="p-2 text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Zona de confirmaciones */}
      {(confirmClose || confirmDelete) && (
        <div className={`px-4 py-3 border-t flex items-center justify-between ${
          confirmDelete ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
        }`}>
          <p className={`text-sm font-medium ${confirmDelete ? 'text-red-700' : 'text-amber-700'}`}>
            {confirmDelete
              ? '¿Eliminar este SimonDrop y todos sus archivos?'
              : '¿Cerrar este buzón? Los estudiantes no podrán subir más archivos.'}
          </p>
          <div className="flex gap-2 ml-4 shrink-0">
            <button
              onClick={confirmDelete ? onConfirmDelete : onConfirmClose}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                confirmDelete
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              Confirmar
            </button>
            <button
              onClick={confirmDelete ? onCancelDelete : onCancelClose}
              className="text-xs px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Acciones secundarias (fuera de confirmación) */}
      {!confirmClose && !confirmDelete && (
        <div className="px-4 pb-3 flex gap-2">
          {isOpen && (
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-xs text-amber-600 hover:bg-amber-50 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> Cerrar buzón
            </button>
          )}
          <button
            onClick={onDelete}
            className="flex items-center gap-1 text-xs text-red-400 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
