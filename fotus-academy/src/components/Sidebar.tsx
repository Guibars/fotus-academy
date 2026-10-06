import React from 'react';
import { LayoutDashboard, PlaySquare, Cpu, Calculator, CalendarCheck, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { TabId } from '../types';
import { FotusLogo } from './FotusLogo';
interface SidebarProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}
const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cursos', label: 'Cursos & Vídeos', icon: PlaySquare },
  { id: 'hibrido', label: 'Conecta Híbridos', icon: Cpu },
  { id: 'juros', label: 'Conecta Juros', icon: Calculator },
  { id: 'agendamento', label: 'Agendar Treinamento', icon: CalendarCheck },
] as const;
export function Sidebar({ currentTab, onSelectTab, collapsed = false, onToggleCollapsed }: SidebarProps) {
  return (
    <aside className={`sticky top-0 h-screen overflow-y-auto bg-white/95 border-r border-slate-200 shrink-0 transition-[width,padding] duration-200 motion-reduce:transition-none ${collapsed ? 'w-20 p-3' : 'w-64 p-5'}`}>
      <div>
        <div className={`py-3 mb-4 ${collapsed ? '' : 'px-2'}`}><FotusLogo className="h-auto w-full" /></div>
        {onToggleCollapsed && <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expandir menu de ferramentas' : 'Minimizar menu de ferramentas'}
          aria-expanded={!collapsed}
          title={collapsed ? 'Expandir menu' : 'Minimizar menu'}
          className={`flex items-center gap-2 mb-4 p-2 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-[#0d518e] focus-visible:outline-2 focus-visible:outline-[#0d518e] ${collapsed ? 'mx-auto' : 'ml-auto'}`}
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          {!collapsed && <span className="text-xs font-semibold">Minimizar</span>}
        </button>}
        <nav className="flex flex-col gap-1.5" aria-label="Navegação Principal">
          {tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => onSelectTab(id)} aria-label={label} title={collapsed ? label : undefined} aria-current={currentTab === id ? 'page' : undefined} className={`w-full flex items-center py-3 rounded-2xl text-sm font-semibold transition-colors ${collapsed ? 'justify-center px-3' : 'gap-3.5 px-4'} ${currentTab === id ? 'bg-[#eaf2fb] text-[#0d518e] font-bold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}><Icon className="w-5 h-5 shrink-0" />{!collapsed && <span className="whitespace-nowrap">{label}</span>}</button>)}
        </nav>
      </div>
    </aside>
  );
}
