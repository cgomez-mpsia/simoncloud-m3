import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './pages/LoginPage';
import DocenteDashboard from './pages/DocenteDashboard';
import EstudianteDashboard from './pages/EstudianteDashboard';
import DropDetailPage from './pages/DropDetailPage';

function Guard({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'DOCENTE' ? '/docente' : '/estudiante'} replace />;
  return <>{children}</>;
}

function Root() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'DOCENTE' ? '/docente' : '/estudiante'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/docente" element={<Guard role="DOCENTE"><DocenteDashboard /></Guard>} />
          <Route path="/estudiante" element={<Guard role="ESTUDIANTE"><EstudianteDashboard /></Guard>} />
          <Route path="/drops/:id" element={<Guard><DropDetailPage /></Guard>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
