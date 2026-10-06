import React from 'react';
import { VideoCourse } from '../types';
interface StoryCoverCardProps {
  course: VideoCourse;
  aspectRatio?: '16/9' | '9/16' | 'auto';
  onPlay: (course: VideoCourse) => void;
  onOpenStories?: (course: VideoCourse) => void;
  compact?: boolean;
}
export function StoryCoverCard({ course, onPlay }: StoryCoverCardProps) {
  return <button onClick={() => onPlay(course)} aria-label={`Abrir ${course.title}`} className="group block w-full rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-[#0d518e]">
    <img src={`${import.meta.env.BASE_URL}${course.coverUrl}`} alt={`${course.title} — ${course.subtitle}`} width="941" height="1672" loading="lazy" className="block w-full aspect-[9/16] object-contain bg-white" />
  </button>;
}
