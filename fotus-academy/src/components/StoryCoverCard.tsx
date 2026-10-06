import React from 'react';
import { Play } from 'lucide-react';
import { VideoCourse } from '../types';
interface StoryCoverCardProps {
  course: VideoCourse;
  aspectRatio?: '16/9' | '9/16' | 'auto';
  onPlay: (course: VideoCourse) => void;
  onOpenStories?: (course: VideoCourse) => void;
  compact?: boolean;
}
export function StoryCoverCard({ course, onPlay }: StoryCoverCardProps) {
  return <button type="button" onClick={() => onPlay(course)} aria-label={`${course.videoUrl ? 'Reproduzir vídeo de' : 'Abrir'} ${course.title}`} className="group relative block w-full rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-[#0d518e]">
    <img src={`${import.meta.env.BASE_URL}${course.coverUrl}`} alt={`${course.title} — ${course.subtitle}`} width={course.coverWidth ?? 941} height={course.coverHeight ?? 1672} loading="lazy" className="block w-full h-auto object-contain bg-white" />
    {course.videoUrl && <span aria-hidden="true" className="absolute bottom-3 right-3 flex items-center justify-center w-10 h-10 rounded-full bg-[#0d518e] text-white border-2 border-white shadow-md transition-colors group-hover:bg-[#093c6b]"><Play size={17} fill="currentColor" className="ml-0.5" /></span>}
  </button>;
}
