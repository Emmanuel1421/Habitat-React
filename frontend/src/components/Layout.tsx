import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, Columns3, FilePlus, Users, BarChart3, LogOut, Scale, Menu, ChevronUp, User, Settings
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/kanban', label: 'Mural de Casos', icon: Columns3 },
  { path: '/cadastro', label: 'Novo Atendimento', icon: FilePlus },
  { path: '/relatorios', label: 'Relatórios', icon: BarChart3 },
];

const masterItems = [
  { path: '/usuarios', label: 'Gestão de Usuários', icon: Users },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const allItems = user?.role === 'master' ? [...navItems, ...masterItems] : navItems;

  const roleLabel: Record<string, string> = {
    master: 'Administrador',
    coordenador: 'Coordenador(a)',
    estagiario: 'Estagiário(a)',
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Scale className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-base text-sidebar-foreground">Sistema Habitat</h1>
            <p className="text-xs text-sidebar-foreground/60">Gestão Jurídica</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {allItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'}`}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border relative">
          {isProfileMenuOpen && (
            <div className="absolute bottom-[72px] left-4 right-4 mb-2 z-50">
              <div className="bg-sidebar border border-sidebar-border rounded-lg shadow-xl overflow-hidden py-1">
                <button 
                  onClick={() => { setIsProfileMenuOpen(false); navigate('/perfil'); }}
                  className="w-full px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent flex items-center gap-3 transition-colors text-left"
                >
                  <User size={16} />
                  Meu Perfil
                </button>
                
                <button 
                  onClick={() => { setIsProfileMenuOpen(false); navigate('/configuracoes'); }}
                  className="w-full px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent flex items-center gap-3 transition-colors text-left"
                >
                  <Settings size={16} />
                  Configurações
                </button>
                
                <div className="h-px bg-sidebar-border my-1"></div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-destructive hover:bg-sidebar-accent flex items-center gap-3 transition-colors text-left"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-sidebar-accent transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sm font-bold text-sidebar-primary shrink-0">
                {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate text-sidebar-foreground">{user?.nome}</p>
                <p className="text-xs text-sidebar-foreground/50 truncate">{roleLabel[user?.role || '']}</p>
              </div>
            </div>
            <ChevronUp 
              size={16} 
              className={`text-sidebar-foreground/50 transition-transform duration-200 shrink-0 ${isProfileMenuOpen ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border bg-card flex items-center px-4 lg:px-6 shrink-0">
          <button className="lg:hidden mr-3" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1" />
          <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
        </header>
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;