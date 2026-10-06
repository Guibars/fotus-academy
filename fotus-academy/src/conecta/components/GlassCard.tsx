import React from 'react';
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'premium' | 'lite';
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
export default function GlassCard({ children, className = '', variant = 'default', ...props }: GlassCardProps) {
  return <div {...props} className={`academy-tool-card academy-tool-card--${variant} rounded-2xl ${className}`}>{children}</div>;
}
