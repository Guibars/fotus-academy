import React from 'react';
interface FotusLogoProps { className?: string; showSubtitle?: boolean; withAcademyBadge?: boolean; }
export function FotusLogo({ className = 'h-16' }: FotusLogoProps) {
  return <img src={`${import.meta.env.BASE_URL}assets/fotus-academy.png`} alt="Fotus Academy" className={`object-contain max-w-full ${className}`} />;
}
