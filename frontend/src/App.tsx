import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JoinPage from './pages/JoinPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TaskPage';
import TeamPage from './pages/TeamPage';
import AdminPage from './pages/AdminPage';

import LoadingSpinner from './components/common/LoadingSpinner';
import MainLayout from './components/layout/MainLayout';
import { Sparkles, Construction } from 'lucide-react';
import "./App.css";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-700">
    <div className="w-24 h-24 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-2xl shadow-indigo-500/10 animate-bounce">
      <Construction className="w-12 h-12 text-indigo-400" />
    </div>
    <div className="space-y-2">
      <h2 className="text-4xl font-black text-white font-heading tracking-tighter uppercase">{title}</h2>
      <p className="text-gray-500 text-lg font-medium flex items-center justify-center gap-2">
        Tactical engineers are currently fortifying this sector <Sparkles className="w-5 h-5 text-indigo-400" />
      </p>
    </div>
    <div className="max-w-xs h-1 w-full bg-white/5 rounded-full overflow-hidden">
       <div className="h-full bg-indigo-500 w-1/3 animate-[progress_2s_ease-in-out_infinite]" />
    </div>
  </div>
);

function App() {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      <BrowserRouter suppressHydrationWarning>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/join" element={<JoinPage />} />
          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <MainLayout>
                  <TasksPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/team"
            element={
              <PrivateRoute>
                <MainLayout>
                  <TeamPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <MainLayout>
                  <AdminPage />
                </MainLayout>
              </PrivateRoute>
            }
          />

          
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <MainLayout>
                  <ComingSoon title="Signal Matrix" />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <MainLayout>
                  <ComingSoon title="System Configuration" />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </SWRConfig>
  );
}

export default App;