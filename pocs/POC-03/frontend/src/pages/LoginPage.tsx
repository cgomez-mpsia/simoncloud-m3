import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const PRESETS = [
  { label: 'Docente 1', email: 'docente1@umss.edu', password: 'docente123', role: 'DOCENTE' },
  { label: 'Docente 2', email: 'docente2@umss.edu', password: 'docente123', role: 'DOCENTE' },
  { label: 'Estudiante 1', email: 'estudiante1@umss.edu', password: 'estudiante123', role: 'ESTUDIANTE' },
  { label: 'Estudiante 2', email: 'estudiante2@umss.edu', password: 'estudiante123', role: 'ESTUDIANTE' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPreset, setLoadingPreset] = useState<string | null>(null);

  const doLogin = async (em: string, pw: string, presetLabel?: string) => {
    setError('');
    if (presetLabel) setLoadingPreset(presetLabel);
    else setLoading(true);
    try {
      const user = await login(em, pw);
      navigate(user.role === 'DOCENTE' ? '/docente' : '/estudiante');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
      setLoadingPreset(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-5">

        {/* Branding */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl shadow-lg mb-2">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SimonCloud</h1>
          <p className="text-sm text-gray-500">Sistema de Entregas Académicas · POC-03</p>
        </div>

        {/* Acceso rápido */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Acceso rápido</p>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => {
              const isLoading = loadingPreset === p.label;
              return (
                <button
                  key={p.email}
                  onClick={() => doLogin(p.email, p.password, p.label)}
                  disabled={!!loadingPreset || loading}
                  className={`p-3 rounded-xl text-left border transition-all disabled:opacity-60 ${
                    p.role === 'DOCENTE'
                      ? 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800'
                      : 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                  }`}
                >
                  <p className="font-semibold text-sm">{isLoading ? 'Entrando...' : p.label}</p>
                  <p className="text-xs opacity-60 mt-0.5">{p.role === 'DOCENTE' ? 'Docente' : 'Estudiante'}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Separador */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">o ingresa manualmente</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <form onSubmit={(e) => { e.preventDefault(); doLogin(email, password); }} className="space-y-3">
            <input
              type="email"
              placeholder="correo@umss.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !!loadingPreset}
              className="w-full bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
