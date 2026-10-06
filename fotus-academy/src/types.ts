export type TabId = 'dashboard' | 'cursos' | 'hibrido' | 'juros' | 'agendamento';

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  completed?: boolean;
}

export interface VideoCourse {
  id: string;
  title: string;
  subtitle: string;
  coverId: number;
  coverUrl: string;
  coverWidth?: number;
  coverHeight?: number;
  videoUrl?: string;
  category: 'dimensionamento' | 'offgrid' | 'backup' | 'gestao' | 'hardware' | 'mobilidade' | 'armazenamento';
}

export interface TrainingEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  instructor: string;
  modality: 'Online Ao Vivo' | 'Presencial (Fotus Lab)' | 'Híbrido';
  location: string;
  totalSpots: number;
  filledSpots: number;
  badge: string;
  status: 'confirmed' | 'open' | 'waitlist';
  prerequisite: string;
}

export interface Certificate {
  id: string;
  title: string;
  category: string;
  issueDate: string;
  hours: number;
  credentialCode: string;
  recipient: string;
  grade: string;
}

export interface CRMLead {
  id: string;
  client: string;
  city: string;
  powerKwp: number;
  systemType: 'Híbrido Backup' | 'On-Grid' | 'Zero Grid' | 'Off-Grid';
  stage: 'Proposta' | 'Dimensionamento' | 'Financiamento' | 'Fechado';
  value: number;
  updatedAt: string;
}
