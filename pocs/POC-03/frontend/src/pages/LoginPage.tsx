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

  const handleLogin = async (e?: React.FormEvent, preset?: typeof PRESETS[0]) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(preset?.email ?? email, preset?.password ?? password);
      const role = preset?.role ?? (email.includes('docente') ? 'DOCENTE' : 'ESTUDIANTE');
      navigate(role === 'DOCENTE' ? '/docente' : '/estudiante');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">SimonCloud</h1>
          <p className="text-gray-500 mt-1">Sistema de Entregas Académicas — POC-03</p>
        </div>

        {/* Acceso rápido demo */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Acceso rápido (demo)</p>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.email}
                onClick={() => handleLogin(undefined, p)}
                disabled={loading}
                className={`p-3 rounded-xl text-left border transition-all ${
                  p.role === 'DOCENTE'
                    ? 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800'
                    : 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                }`}
              >
                <p className="font-semibold text-sm">{p.label}</p>
                <p className="text-xs opacity-70">{p.role}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Formulario manual */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">O ingresa manualmente</p>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="email" placeholder="correo@umss.edu" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password" placeholder="Contraseña" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
