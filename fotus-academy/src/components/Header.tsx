import React from 'react';
import { Search } from 'lucide-react';
import { TabId } from '../types';
interface HeaderProps { searchQuery: string; onSearchChange: (query: string) => void; onSelectTab: (tab: TabId) => void; }
export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-3">
    <header className="bg-white/95 border border-slate-200 rounded-full px-3 sm:px-5 py-2 flex items-center justify-between gap-4 shadow-sm">
      <label className="relative max-w-md w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input aria-label="Buscar cursos" value={searchQuery} onChange={e => onSearchChange(e.target.value)} placeholder="Buscar cursos e vídeos..." className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d518e]/20" /></label>
      <span className="hidden sm:block text-xs font-semibold text-slate-500 whitespace-nowrap">Portal do Integrador</span>
    </header>
  </div>;
}
