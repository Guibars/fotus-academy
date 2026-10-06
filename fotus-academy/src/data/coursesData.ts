import { VideoCourse, TrainingEvent, Certificate, CRMLead } from '../types';

// Titles and subtitles transcribed from the original covers supplied by the user.
// Add verified video URLs and metadata here when available.
export const COURSES_DATA: VideoCourse[] = [
  {
    "id": "dimensionar-hibrido",
    "title": "Como Dimensionar um Sistema Híbrido",
    "subtitle": "Inversor híbrido + bateria na prática",
    "category": "dimensionamento",
    "coverId": 1,
    "coverUrl": "assets/covers/dimensionar-hibrido.png"
  },
  {
    "id": "hibrido-offgrid",
    "title": "Sistema Híbrido Off-Grid",
    "subtitle": "Energia mesmo sem a rede",
    "category": "offgrid",
    "coverId": 2,
    "coverUrl": "assets/covers/hibrido-offgrid.png"
  },
  {
    "id": "backup-baterias",
    "title": "Backup com Baterias",
    "subtitle": "Como funciona no sistema híbrido",
    "category": "backup",
    "coverId": 3,
    "coverUrl": "assets/covers/backup-baterias.png"
  },
  {
    "id": "time-shifting",
    "title": "Time Shifting",
    "subtitle": "Uso inteligente da energia no horário de ponta",
    "category": "gestao",
    "coverId": 4,
    "coverUrl": "assets/covers/time-shifting.png"
  },
  {
    "id": "porta-gen",
    "title": "Porta GEN e Aplicações",
    "subtitle": "Recursos importantes do sistema híbrido",
    "category": "hardware",
    "coverId": 5,
    "coverUrl": "assets/covers/porta-gen.png"
  }
];

export const TRAINING_EVENTS: TrainingEvent[] = [];
export const USER_CERTIFICATES: Certificate[] = [];
export const CRM_LEADS_SAMPLE: CRMLead[] = [];
