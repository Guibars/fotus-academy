import { VideoCourse, TrainingEvent, Certificate, CRMLead } from '../types';

// Titles and subtitles transcribed from the original covers supplied by the user.
// Add verified video URLs and metadata here when available.
export const COURSES_DATA: VideoCourse[] = [
  {
    "id": "conheca-conecta-fotus",
    "title": "Conheça o Conecta Fotus",
    "subtitle": "Agendamento online com especialistas da Fotus para tirar dúvidas e conhecer soluções técnicas e comerciais.",
    "category": "conecta",
    "coverId": 1,
    "coverUrl": "assets/covers/conheca-conecta-fotus.png",
    "coverWidth": 941,
    "coverHeight": 1672,
    "videoUrl": `${import.meta.env.BASE_URL}assets/videos/conheca-conecta-fotus.mp4`
  },
  {
    "id": "solplanet-unipower",
    "title": "Conheça + Solplanet",
    "subtitle": "Inversor Solplanet + bateria Unipower",
    "category": "hardware",
    "coverId": 2,
    "coverUrl": "assets/covers/solplanet-unipower.png",
    "coverWidth": 941,
    "coverHeight": 1672,
    "videoUrl": `${import.meta.env.BASE_URL}assets/videos/solplanet-unipower.mp4`
  },
  {
    "id": "backup-baterias",
    "title": "Backup com Baterias",
    "subtitle": "Como funciona no sistema híbrido",
    "category": "backup",
    "coverId": 3,
    "coverUrl": "assets/covers/backup-baterias-secpower.png",
    "coverWidth": 941,
    "coverHeight": 1672,
    "videoUrl": `${import.meta.env.BASE_URL}assets/videos/backup-baterias.mp4`
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
  },
  {
    "id": "carregador-dc-beny",
    "title": "Carregador DC Beny",
    "subtitle": "Solução de recarga rápida para veículos elétricos",
    "category": "mobilidade",
    "coverId": 6,
    "coverUrl": "assets/covers/carregador-dc-beny.png",
    "coverWidth": 1122,
    "coverHeight": 1402
  },
  {
    "id": "chint-bess-ci",
    "title": "CHINT BESS C&I",
    "subtitle": "CPS ES-125KW-261KWH — Sistema de armazenamento de energia para aplicações comerciais e industriais",
    "category": "armazenamento",
    "coverId": 7,
    "coverUrl": "assets/covers/chint-bess-ci.png",
    "coverWidth": 1122,
    "coverHeight": 1402
  }
];

// Real training dates only. Use YYYY-MM-DD in `date` so the calendar can mark each day.
export const TRAINING_EVENTS: TrainingEvent[] = [];
export const USER_CERTIFICATES: Certificate[] = [];
export const CRM_LEADS_SAMPLE: CRMLead[] = [];
