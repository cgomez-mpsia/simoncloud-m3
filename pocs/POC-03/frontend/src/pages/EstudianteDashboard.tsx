import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, ChevronRight, BookOpen } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { api, Drop } from '../api';
import AppHeader from '../components/AppHeader';
import { DropCardSkeleton } from '../components/Skeleton';
import { formatRelative } from '../utils/format';

export default function EstudianteDashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.listDrops(token)
      .then(setDrops)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="SimonCloud" subtitle="Portal de estudiante" />

      <main className="max-w-3xl mx-auto p-6 space-y-5">

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <DropCardSkeleton key={i} />)}
          </div>
        )}

        {!loading && drops.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8 text-emerald-300" />
            </div>
            <p className="font-medium text-gray-700">No hay buzones disponibles</p>
            <p className="text-sm text-gray-400">Los docentes publicarán buzones de entrega aquí</p>
          </div>
        )}

        {!loading && drops.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
              Buzones abiertos · {drops.length}
            </h2>
            {drops.map((drop) => (
              <button
                key={drop.id}
                onClick={() => navigate(`/drops/${drop.id}`)}
                className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-start gap-3 hover:border-emerald-300 hover:shadow-sm transition-all text-left"
              >
                <FolderOpen className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{drop.name}</p>
                  {drop.description && (
                    <p className="text-sm text-gray-500 truncate">{drop.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Abierto
                    </span>
                    {drop.docente && (
                      <span className="text-xs text-gray-400">por {drop.docente.name}</span>
                    )}
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{formatRelative(drop.createdAt)}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
              </button>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
