import React from 'react';
import { Search } from 'lucide-react';
import { TabId } from '../types';
interface HeaderProps { searchQuery: string; onSearchChange: (query: string) => void; onSelectTab: (tab: TabId) => void; }
export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return <header className="bg-white/80 border-b border-slate-200 px-6 lg:px-8 py-5 flex items-center justify-between gap-4"><label className="relative max-w-lg w-full"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input aria-label="Buscar cursos" value={searchQuery} onChange={e => onSearchChange(e.target.value)} placeholder="Buscar cursos e vídeos..." className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d518e]/20" /></label><span className="hidden sm:block text-xs font-semibold text-slate-500 whitespace-nowrap">Portal do Integrador</span></header>;
}
