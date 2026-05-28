import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, LogOut } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { api, Drop } from '../api';

export default function EstudianteDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    if (token) api.listDrops(token).then(setDrops).catch(console.error);
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-900">SimonCloud — Estudiante</h1>
          <p className="text-sm text-gray-500">{user?.name}</p>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm">
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Buzones disponibles ({drops.length})</h2>

        {drops.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No hay buzones abiertos en este momento.</p>
        ) : (
          drops.map((drop) => (
            <div
              key={drop.id}
              onClick={() => navigate(`/drops/${drop.id}`)}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:shadow-sm hover:border-emerald-300 transition-all"
            >
              <FolderOpen className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-800">{drop.name}</p>
                {drop.description && <p className="text-sm text-gray-500">{drop.description}</p>}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Abierto</span>
                  {drop.docente && <span className="text-xs text-gray-400">por {drop.docente.name}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
