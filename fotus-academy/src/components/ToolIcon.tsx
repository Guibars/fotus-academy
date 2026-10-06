import React from 'react';
import { TabId } from '../types';

// A shared vector family inspired by the Fotus arcs, circles and blue/yellow palette.
export function ToolIcon({ tab, className = 'w-6 h-6' }: { tab: TabId; className?: string }) {
  return <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true" focusable="false">
    {tab === 'dashboard' && <>
      <path d="M4 14V11a7 7 0 0 1 7-7h3v10H4ZM18 18h10v3a7 7 0 0 1-7 7h-3V18Z" fill="currentColor" />
      <rect x="4" y="18" width="10" height="10" rx="3" fill="currentColor" opacity=".5" />
      <circle cx="23" cy="9" r="5" fill="#fab515" />
    </>}
    {tab === 'cursos' && <>
      <path d="M4 12a8 8 0 0 1 8-8h16v16a8 8 0 0 1-8 8H4V12Z" fill="currentColor" />
      <path d="m13 10 10 6-10 6V10Z" fill="#fab515" stroke="#fab515" strokeLinejoin="round" />
      <path d="M8 25h7" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
    </>}
    {tab === 'hibrido' && <>
      <path d="M5 13a9 9 0 0 1 9-9h13v7H14a2 2 0 0 0-2 2H5ZM27 19a9 9 0 0 1-9 9H5v-7h13a2 2 0 0 0 2-2h7Z" fill="currentColor" />
      <circle cx="16" cy="16" r="7" fill="#fab515" />
      <path d="m17 10-5 7h4l-1 5 5-7h-4l1-5Z" fill="#0d518e" />
    </>}
    {tab === 'juros' && <>
      <path d="M4 20a8 8 0 0 1 8-8v16H4v-8ZM16 13a9 9 0 0 1 9-9h3v24H16V13Z" fill="currentColor" />
      <circle cx="8" cy="7" r="3" fill="#fab515" />
      <path d="m19 20 6-8m-6 1h.01M25 19h.01" stroke="#fab515" strokeWidth="2.5" strokeLinecap="round" />
    </>}
    {tab === 'agendamento' && <>
      <path d="M4 12a6 6 0 0 1 6-6h18v16a6 6 0 0 1-6 6H4V12Z" fill="currentColor" />
      <path d="M11 3v6M23 3v6M8 13h16" stroke="#fab515" strokeWidth="2.5" strokeLinecap="round" />
      <path d="m11 20 3 3 7-7" stroke="#fab515" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </>}
  </svg>;
}
