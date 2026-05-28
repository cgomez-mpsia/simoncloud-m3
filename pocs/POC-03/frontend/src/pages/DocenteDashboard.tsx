import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder, FolderOpen, Trash2, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { api, Drop } from '../api';

export default function DocenteDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) api.listDrops(token).then(setDrops).catch(console.error);
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !form.name.trim()) return;
    setError('');
    try {
      const drop = await api.createDrop(form.name, form.description, token);
      setDrops((prev) => [drop, ...prev]);
      setForm({ name: '', description: '' });
      setCreating(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  const handleClose = async (id: string) => {
    if (!token) return;
    const updated = await api.closeDrop(id, token);
    setDrops((prev) => prev.map((d) => (d.id === id ? { ...d, status: updated.status } : d)));
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('¿Eliminar este SimonDrop y todos sus archivos?')) return;
    await api.deleteDrop(id, token);
    setDrops((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-900">SimonCloud — Docente</h1>
          <p className="text-sm text-gray-500">{user?.name}</p>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm">
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-4">
        {/* Crear drop */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">Mis SimonDrops ({drops.length})</h2>
          <button
            onClick={() => setCreating(!creating)}
            className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" /> Nuevo SimonDrop
          </button>
        </div>

        {creating && (
          <form onSubmit={handleCreate} className="bg-white border border-indigo-200 rounded-xl p-4 space-y-3">
            <input
              autoFocus required placeholder="Nombre del buzón (ej. Proyecto Final)" value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              placeholder="Descripción (opcional)" value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">Crear</button>
              <button type="button" onClick={() => setCreating(false)} className="text-gray-500 px-4 py-2 text-sm hover:text-gray-700">Cancelar</button>
            </div>
          </form>
        )}

        {/* Lista */}
        {drops.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No tienes SimonDrops aún. ¡Crea el primero!</p>
        ) : (
          drops.map((drop) => (
            <div key={drop.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3 cursor-pointer flex-1" onClick={() => navigate(`/drops/${drop.id}`)}>
                {drop.status === 'OPEN'
                  ? <FolderOpen className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                  : <Folder className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />}
                <div>
                  <p className="font-medium text-gray-800">{drop.name}</p>
                  {drop.description && <p className="text-sm text-gray-500">{drop.description}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${drop.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {drop.status === 'OPEN' ? 'Abierto' : 'Cerrado'}
                    </span>
                    <span className="text-xs text-gray-400">{drop._count.files} archivo(s)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                {drop.status === 'OPEN' && (
                  <button onClick={() => handleClose(drop.id)} title="Cerrar buzón" className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg">
                    <Lock className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => handleDelete(drop.id)} title="Eliminar" className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
