import React from 'react';
import { Role } from '../types';
import { LayoutDashboard, FilePlus, Users, FileCheck, Shield, Settings, PieChart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentRole: Role;
  setRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentRole, setRole, activeTab, setActiveTab }) => {
  
  const getMenuItems = (role: Role) => {
    switch (role) {
      case Role.REQUESTER:
        return [
          { id: 'dashboard', label: 'Meus Pedidos', icon: LayoutDashboard },
          { id: 'new-request', label: 'Novo Pedido', icon: FilePlus },
        ];
      case Role.MANAGER:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'reports', label: 'Relatórios Avançados', icon: PieChart },
          { id: 'distribution', label: 'Distribuição', icon: Users },
        ];
      case Role.ANALYST:
        return [
          { id: 'dashboard', label: 'Minhas Tarefas', icon: FileCheck },
        ];
      case Role.ADMIN:
        return [
          { id: 'admin-users', label: 'Gestão de Usuários', icon: Users },
          { id: 'admin-config', label: 'Configurações do Sistema', icon: Shield },
        ];
      default:
        return [];
    }
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    // Force switch to the first allowed tab for the new role to prevent unauthorized view
    const firstAllowedTab = getMenuItems(newRole)[0]?.id || 'dashboard';
    setActiveTab(firstAllowedTab);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            PlanFlow
          </h1>
          <p className="text-xs text-slate-400 mt-1">Gestão Inteligente</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {getMenuItems(currentRole).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Role Switcher (Simulation Only) */}
        <div className="p-4 bg-slate-800 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">Simular Acesso Como:</p>
          <div className="space-y-2">
            {Object.values(Role).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center justify-between ${
                  currentRole === r 
                    ? 'bg-teal-500 text-white font-bold' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {r === Role.ADMIN ? 'Admin' : r.split(' ')[0]} 
                {currentRole === r && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            {currentRole.split('(')[0]}
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs border border-slate-200">
              Modo de Simulação
            </span>
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow">
              {currentRole[0]}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;