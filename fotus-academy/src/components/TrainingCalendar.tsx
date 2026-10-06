import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { TRAINING_EVENTS } from '../data/coursesData';

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function TrainingCalendar({ onOpenSchedule }: { onOpenSchedule: () => void }) {
  const today = new Date();
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => dateKey(today));
  const monthPrefix = dateKey(month).slice(0, 7);
  const monthEvents = TRAINING_EVENTS.filter(event => event.date.slice(0, 7) === monthPrefix);
  const selectedEvents = monthEvents.filter(event => event.date.slice(0, 10) === selectedDate);
  const firstWeekday = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const monthLabel = month.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const selectedLabel = new Date(`${selectedDate}T12:00:00`).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  const changeMonth = (offset: number) => {
    const next = new Date(month.getFullYear(), month.getMonth() + offset, 1);
    setMonth(next);
    setSelectedDate(dateKey(next));
  };

  return <section className="training-calendar bg-white border border-slate-200 rounded-3xl p-5 shadow-sm" aria-label="Calendário de treinamentos">
    <div className="flex items-center justify-between gap-3 mb-4">
      <div><h2 className="font-bold text-slate-800">Calendário</h2><p className="text-xs text-slate-500 mt-1">Agenda de treinamentos</p></div>
      <button type="button" onClick={() => { setMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDate(dateKey(today)); }} className="rounded-full px-3 py-1.5 bg-blue-50 text-[#0d518e] text-xs font-bold hover:bg-blue-100">Hoje</button>
    </div>
    <div className="flex items-center justify-between mb-2">
      <button type="button" aria-label="Mês anterior" onClick={() => changeMonth(-1)} className="p-2 rounded-full text-[#0d518e] hover:bg-blue-50"><ChevronLeft size={16} /></button>
      <span className="text-sm font-bold text-[#0d518e] capitalize" aria-live="polite">{monthLabel}</span>
      <button type="button" aria-label="Próximo mês" onClick={() => changeMonth(1)} className="p-2 rounded-full text-[#0d518e] hover:bg-blue-50"><ChevronRight size={16} /></button>
    </div>
    <table className="w-full table-fixed border-separate" style={{ borderSpacing: '0 3px' }}>
      <caption className="sr-only">Treinamentos em {monthLabel}. Selecione um dia para consultar a agenda.</caption>
      <thead><tr>{['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => <th key={day} scope="col" className="text-[10px] font-semibold text-slate-400 pb-1">{day}</th>)}</tr></thead>
      <tbody>{Array.from({ length: cellCount / 7 }, (_, week) => <tr key={week}>
        {Array.from({ length: 7 }, (_, weekday) => {
          const day = week * 7 + weekday - firstWeekday + 1;
          if (day < 1 || day > daysInMonth) return <td key={weekday} />;
          const date = new Date(month.getFullYear(), month.getMonth(), day);
          const key = dateKey(date);
          const events = monthEvents.filter(event => event.date.slice(0, 10) === key);
          const selected = key === selectedDate;
          const isToday = key === dateKey(today);
          return <td key={weekday} className="text-center"><button
            type="button"
            onClick={() => setSelectedDate(key)}
            aria-pressed={selected}
            aria-current={isToday ? 'date' : undefined}
            aria-label={`${date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}${isToday ? ', hoje' : ''}, ${events.length} treinamento${events.length === 1 ? '' : 's'}`}
            className={`calendar-day relative inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${selected ? 'bg-[#0d518e] text-white' : isToday ? 'bg-[#fff5d9] text-[#0d518e]' : 'text-slate-600 hover:bg-blue-50'}`}
          >{day}{events.length > 0 && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#fab515]" aria-hidden="true" />}</button></td>;
        })}
      </tr>)}</tbody>
    </table>
    <div className="mt-3 border-t border-slate-100 pt-3 text-xs" aria-live="polite">
      {monthEvents.length === 0 ? <p className="text-slate-500 leading-relaxed">Nenhum treinamento cadastrado neste mês.</p> : <>
        <p className="font-bold text-[#0d518e] mb-2">{selectedLabel}</p>
        {selectedEvents.length === 0 ? <p className="text-slate-500">Nenhum treinamento cadastrado neste dia.</p> : <ul className="space-y-2">{selectedEvents.map(event => <li key={event.id} className="rounded-xl bg-blue-50 p-3"><p className="font-bold text-[#0d518e]">{event.title}</p><p className="text-slate-600 mt-1">{event.time} · {event.modality}</p></li>)}</ul>}
        <p className="flex items-center gap-2 mt-3 text-slate-500"><span className="w-1.5 h-1.5 rounded-full bg-[#fab515]" />Dia com treinamento cadastrado</p>
      </>}
      <button type="button" onClick={onOpenSchedule} className="mt-3 text-[#0d518e] font-bold inline-flex items-center gap-1">Ver treinamentos<ArrowUpRight size={14} /></button>
    </div>
  </section>;
}
