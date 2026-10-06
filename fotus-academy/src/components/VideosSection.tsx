import React, { useState } from 'react';
import { VideoCourse } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { StoryCoverCard } from './StoryCoverCard';
interface VideosSectionProps { onPlayCourse: (course: VideoCourse) => void; onOpenStories?: (course: VideoCourse) => void; searchFilter?: string; }
const categories = [{ id: 'todos', label: 'Todos os módulos' }, { id: 'dimensionamento', label: 'Dimensionamento' }, { id: 'offgrid', label: 'Off-Grid' }, { id: 'backup', label: 'Backup com Baterias' }, { id: 'gestao', label: 'Time Shifting' }, { id: 'hardware', label: 'Porta GEN' }];
export function VideosSection({ onPlayCourse, searchFilter = '' }: VideosSectionProps) {
  const [category, setCategory] = useState('todos');
  const query = searchFilter.trim().toLocaleLowerCase('pt-BR');
  const courses = COURSES_DATA.filter(course => (category === 'todos' || course.category === category) && `${course.title} ${course.subtitle}`.toLocaleLowerCase('pt-BR').includes(query));
  return <section className="p-6 lg:p-8 space-y-6">
    <header><h1 className="text-2xl font-black text-slate-800">Cursos & Vídeos</h1><p className="text-sm text-slate-500 mt-1">Módulos Fotus Academy</p></header>
    <div className="flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Categorias de cursos">{categories.map(item => <button key={item.id} aria-pressed={category === item.id} onClick={() => setCategory(item.id)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border ${category === item.id ? 'bg-[#0d518e] text-white border-[#0d518e]' : 'bg-white text-slate-500 border-slate-200 hover:border-[#0d518e]'}`}>{item.label}</button>)}</div>
    {courses.length ? <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5 items-start">{courses.map(course => <StoryCoverCard key={course.id} course={course} onPlay={onPlayCourse} />)}</div> : <p className="p-6 bg-white border border-slate-200 rounded-2xl text-sm text-slate-500">Nenhum módulo encontrado.</p>}
  </section>;
}
