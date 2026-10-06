import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { VideoCourse, Certificate, TabId } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { StoryCoverCard } from './StoryCoverCard';
import { ToolIcon } from './ToolIcon';
import { TrainingCalendar } from './TrainingCalendar';

interface DashboardProps {
  onSelectTab: (tab: TabId) => void;
  onPlayCourse: (course: VideoCourse) => void;
  onViewCertificate?: (cert: Certificate) => void;
}

const shortcuts = [
  { id: 'cursos', label: 'Cursos & Vídeos', description: 'Explore os módulos' },
  { id: 'hibrido', label: 'Conecta Híbridos', description: 'Dimensione seu sistema' },
  { id: 'juros', label: 'Conecta Juros', description: 'Simule as parcelas' },
  { id: 'agendamento', label: 'Treinamentos', description: 'Consulte a programação' },
] as const;

export function Dashboard({ onSelectTab, onPlayCourse }: DashboardProps) {
  const brandPath = `${import.meta.env.BASE_URL}assets/brand/`;
  return <section className="p-5 lg:p-8 space-y-6">
    <header className="flex items-center gap-3">
      <span className="flex items-center justify-center w-12 h-12 bg-white border border-slate-200 rounded-2xl text-[#0d518e]"><ToolIcon tab="dashboard" className="w-7 h-7" /></span>
      <div><h1 className="text-2xl font-black text-slate-800">Fotus Academy</h1><p className="text-sm text-slate-500 mt-1">Cursos e ferramentas para o integrador solar.</p></div>
    </header>
    <div className="relative overflow-hidden rounded-3xl bg-[#0d518e] text-white shadow-sm">
      <div className="relative p-7 lg:p-8">
        <div className="hidden md:block absolute right-10 top-8 w-44 h-44 rounded-full bg-[#fab515]" aria-hidden="true"><img src={`${brandPath}sunburst.png`} alt="" className="w-full h-full object-contain p-5" /></div>
        <div className="hidden xl:flex absolute right-60 top-12 bg-white/10 rounded-3xl w-24 h-24 items-center justify-center" aria-hidden="true"><img src={`${brandPath}semicircles.png`} alt="" className="w-16 h-16 object-contain" /></div>
        <div className="relative max-w-lg md:pr-12 xl:pr-0">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#fab515] uppercase tracking-widest"><span className="w-1.5 h-1.5 rounded-full bg-[#fab515]" />Academy</span>
          <h2 className="text-2xl lg:text-3xl font-black mt-3 leading-tight">Conhecimento e ferramentas para seus projetos</h2>
          <p className="mt-3 text-sm text-blue-100 leading-relaxed">Explore os cursos e use as ferramentas Conecta no seu próximo projeto.</p>
          <button type="button" onClick={() => onSelectTab('cursos')} className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#fab515] text-[#0d518e] text-xs font-bold hover:bg-[#ffca47]">Ver módulos<ArrowUpRight size={16} /></button>
        </div>
      </div>
      <img src={`${brandPath}pattern.png`} alt="" aria-hidden="true" className="w-full h-5 object-cover" />
    </div>
    <div className="grid lg:grid-cols-5 gap-5 items-start">
      <section className="lg:col-span-3 relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-5 lg:p-6 shadow-sm" aria-label="Acesso rápido">
        <img src={`${brandPath}arc.png`} alt="" aria-hidden="true" className="absolute -right-8 -bottom-8 w-44 h-auto opacity-5 pointer-events-none" />
        <div className="relative">
          <h2 className="font-bold text-slate-800">Acesso rápido</h2>
          <p className="text-xs text-slate-500 mt-1 mb-5">Suas ferramentas, a um clique.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {shortcuts.map(({ id, label, description }) => <button key={id} type="button" onClick={() => onSelectTab(id)} className="group text-left p-4 rounded-2xl border border-slate-100 bg-[#f5f8fc] hover:bg-[#edf4fc] hover:border-[#cbdbea] transition-colors">
              <div className="flex items-center justify-between mb-4"><span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-[#0d518e] shadow-sm"><ToolIcon tab={id} className="w-8 h-8" /></span><ArrowUpRight size={17} className="text-slate-400 group-hover:text-[#0d518e]" /></div>
              <span className="block text-sm font-bold text-[#0d518e]">{label}</span><span className="block text-xs text-slate-500 mt-1">{description}</span>
            </button>)}
          </div>
        </div>
      </section>
      <div className="lg:col-span-2"><TrainingCalendar onOpenSchedule={() => onSelectTab('agendamento')} /></div>
    </div>
    <div><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-slate-800">Módulos Fotus Academy</h2><button type="button" onClick={() => onSelectTab('cursos')} className="text-xs font-bold text-[#0d518e]">Ver todos</button></div><div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5 items-start">{COURSES_DATA.map(course => <StoryCoverCard key={course.id} course={course} onPlay={onPlayCourse} />)}</div></div>
  </section>;
}
