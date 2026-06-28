import { ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  back?: string;           // ruta a la que volver (undefined = no mostrar botón)
  backLabel?: string;
  children?: React.ReactNode; // acciones extra en el lado derecho
}

export default function AppHeader({ title, subtitle, back, backLabel, children }: AppHeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
      {back && (
        <button
          onClick={() => navigate(back)}
          title={backLabel ?? 'Volver'}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      <div className="flex-1 min-w-0">
        <h1 className="font-bold text-gray-900 truncate">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 truncate">{subtitle}</p>}
      </div>

      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}

      {/* User badge + logout */}
      <div className="flex items-center gap-2 ml-2 shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
          <div className={`w-2 h-2 rounded-full ${user?.role === 'DOCENTE' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
          <span className="text-xs font-medium text-gray-700 hidden sm:block">{user?.name}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full hidden sm:block ${
            user?.role === 'DOCENTE' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {user?.role === 'DOCENTE' ? 'Docente' : 'Estudiante'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
