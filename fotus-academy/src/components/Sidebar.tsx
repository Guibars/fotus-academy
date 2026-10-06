import React from 'react';
import { TabId } from '../types';
import { FotusLogo } from './FotusLogo';
import { ToolIcon } from './ToolIcon';

interface SidebarProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  mobile?: boolean;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'cursos', label: 'Cursos & Vídeos' },
  { id: 'hibrido', label: 'Conecta Híbridos' },
  { id: 'juros', label: 'Conecta Juros' },
  { id: 'agendamento', label: 'Agendar Treinamento' },
] as const;

export function Sidebar({ currentTab, onSelectTab, mobile = false }: SidebarProps) {
  return <div className={`sidebar-dock${mobile ? ' sidebar-dock--mobile' : ''}`}>
    <aside className="sidebar-pill" aria-label="Ferramentas Fotus Academy">
      <div className="sidebar-brand">
        <img src={`${import.meta.env.BASE_URL}assets/fotus-symbol.png`} alt={mobile ? '' : 'Fotus Academy'} className="sidebar-symbol" />
        <FotusLogo className="sidebar-wordmark" />
      </div>
      <nav className="sidebar-nav" aria-label="Navegação Principal">
        {tabs.map(({ id, label }) => <button
          key={id}
          type="button"
          onClick={() => onSelectTab(id)}
          aria-label={label}
          aria-current={currentTab === id ? 'page' : undefined}
          className={`sidebar-link${currentTab === id ? ' sidebar-link--active' : ''}`}
        >
          <span className="sidebar-icon"><ToolIcon tab={id} className="w-7 h-7" /></span>
          <span className="sidebar-label">{label}</span>
        </button>)}
      </nav>
    </aside>
  </div>;
}
