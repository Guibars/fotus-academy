import React from 'react';
import { LayoutDashboard, PlaySquare, Cpu, Calculator, CalendarCheck, HelpCircle } from 'lucide-react';
import { TabId } from '../types';
import { FotusLogo } from './FotusLogo';
interface SidebarProps { currentTab: TabId; onSelectTab: (tab: TabId) => void; onOpenSettings?: () => void; }
const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cursos', label: 'Cursos & Vídeos', icon: PlaySquare },
  { id: 'hibrido', label: 'Conecta Híbridos', icon: Cpu },
  { id: 'juros', label: 'Conecta Juros', icon: Calculator },
  { id: 'agendamento', label: 'Agendar Treinamento', icon: CalendarCheck },
] as const;
export function Sidebar({ currentTab, onSelectTab }: SidebarProps) {
  return (
    <aside className="w-64 h-full min-h-screen bg-white/95 border-r border-slate-200 flex flex-col justify-between p-5 shrink-0">
      <div>
        <div className="py-3 px-2 mb-8"><FotusLogo className="h-auto w-full" /></div>
        <nav className="flex flex-col gap-1.5" aria-label="Navegação Principal">
          {tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onSelectTab(id)} aria-current={currentTab === id ? 'page' : undefined} className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${currentTab === id ? 'bg-[#eaf2fb] text-[#0d518e] font-bold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}><Icon className="w-5 h-5 shrink-0" /><span>{label}</span></button>)}
        </nav>
      </div>
      <div className="pt-6 mt-8 border-t border-slate-100"><a href="https://fotus.com.br" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:text-[#0d518e]"><HelpCircle className="w-4 h-4" />Suporte Fotus Solar</a></div>
    </aside>
  );
}
