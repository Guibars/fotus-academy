import React from 'react';
import { X } from 'lucide-react';
import { VideoCourse } from '../types';
interface VideoPlayerModalProps { course: VideoCourse | null; onClose: () => void; onMarkCompleted?: (courseId: string) => void; }
export function VideoPlayerModal({ course, onClose, onMarkCompleted }: VideoPlayerModalProps) {
  React.useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', handleKey); };
  }, [onClose]);
  if (!course) return null;
  return <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
    <section role="dialog" aria-modal="true" aria-labelledby="course-modal-title" className="bg-white rounded-3xl max-w-3xl w-full max-h-[90dvh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
      <header className="flex items-center justify-between gap-4 p-5 border-b border-slate-200"><h2 id="course-modal-title" className="font-bold text-[#0d518e]">{course.title}</h2><button autoFocus onClick={onClose} aria-label="Fechar módulo" className="p-2 rounded-xl hover:bg-slate-100"><X size={20} /></button></header>
      {course.videoUrl ? <video src={course.videoUrl} controls className="w-full aspect-video bg-black" onEnded={() => onMarkCompleted?.(course.id)} /> : <div className="p-5 flex flex-col sm:flex-row items-center gap-6"><img src={`${import.meta.env.BASE_URL}${course.coverUrl}`} alt={course.title} className="w-44 aspect-[9/16] object-contain rounded-xl" /><div><p className="font-semibold text-slate-700">{course.subtitle}</p><p className="text-sm text-slate-500 mt-3">O vídeo deste módulo ainda não foi disponibilizado.</p></div></div>}
    </section>
  </div>;
}
