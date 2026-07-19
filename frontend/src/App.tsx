import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CasosProvider } from '@/contexts/CasosContext';

import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import KanbanBoard from '@/pages/KanbanBoard';
import CadastroAtendimento from '@/pages/CadastroAtendimento';
import DetalhesCaso from '@/pages/DetalhesCaso';
import Relatorios from '@/pages/Relatorios';
import GestaoUsuarios from '@/pages/GestaoUsuarios';
import Perfil from '@/pages/Perfil';
import Configuracoes from '@/pages/Configuracoes';
import NotFound from '@/pages/NotFound';
import Layout from '@/components/Layout';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/" replace />;
};

const MasterRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user?.role === 'master' ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const FullScreenLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <p className="text-sm text-muted-foreground">Carregando...</p>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <FullScreenLoader />;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/kanban" element={<ProtectedRoute><KanbanBoard /></ProtectedRoute>} />
      <Route path="/cadastro" element={<ProtectedRoute><CadastroAtendimento /></ProtectedRoute>} />
      <Route path="/caso/:id" element={<ProtectedRoute><DetalhesCaso /></ProtectedRoute>} />
      <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute><MasterRoute><GestaoUsuarios /></MasterRoute></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CasosProvider>
            <AppRoutes />
          </CasosProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
