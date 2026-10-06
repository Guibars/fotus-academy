import React from 'react';
import { ArrowUpRight, Cpu, Calculator, CalendarCheck } from 'lucide-react';
import { VideoCourse, Certificate, TabId } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { StoryCoverCard } from './StoryCoverCard';
interface DashboardProps { onSelectTab: (tab: TabId) => void; onPlayCourse: (course: VideoCourse) => void; onViewCertificate?: (cert: Certificate) => void; }
export function Dashboard({ onSelectTab, onPlayCourse }: DashboardProps) {
  return <section className="p-6 lg:p-8 space-y-7">
    <header><h1 className="text-2xl font-black text-slate-800">Fotus Academy</h1><p className="text-sm text-slate-500 mt-1">Cursos e ferramentas para o integrador solar.</p></header>
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-[#0d518e] text-white p-7 lg:p-8 shadow-sm">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#fab515] rounded-full opacity-90" aria-hidden="true" />
        <div className="relative max-w-md"><span className="text-xs font-bold text-[#fab515] uppercase tracking-widest">Academy</span><h2 className="text-2xl lg:text-3xl font-black mt-3 leading-tight">Conhecimento e ferramentas para seus projetos</h2><p className="mt-3 text-sm text-blue-100">Explore os módulos de sistemas híbridos e use os simuladores Conecta.</p><button onClick={() => onSelectTab('cursos')} className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#fab515] text-[#0d518e] text-xs font-bold">Ver módulos<ArrowUpRight size={16} /></button></div>
      </div>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"><h2 className="font-bold text-slate-800 mb-4">Acesso rápido</h2><div className="space-y-3">{[{ id: 'hibrido', label: 'Conecta Híbridos', icon: Cpu }, { id: 'juros', label: 'Conecta Juros', icon: Calculator }, { id: 'agendamento', label: 'Treinamentos', icon: CalendarCheck }].map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onSelectTab(id as TabId)} className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 rounded-xl text-sm font-semibold text-[#0d518e]"><Icon size={18} />{label}<ArrowUpRight size={16} className="ml-auto" /></button>)}</div></div>
    </div>
    <div><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-slate-800">Módulos Fotus Academy</h2><button onClick={() => onSelectTab('cursos')} className="text-xs font-bold text-[#0d518e]">Ver todos</button></div><div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5 items-start">{COURSES_DATA.map(course => <StoryCoverCard key={course.id} course={course} onPlay={onPlayCourse} />)}</div></div>
  </section>;
}
