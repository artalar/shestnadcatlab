export const REQUEST_STATUSES = [
  'new',
  'in_progress',
  'ready',
  'done',
  'cancelled',
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const FILM_PROCESSES = ['c41', 'bw', 'e6', 'ecn2'] as const;
export type FilmProcess = (typeof FILM_PROCESSES)[number];

export const FILM_FORMATS = ['135', '120', 'other'] as const;
export type FilmFormat = (typeof FILM_FORMATS)[number];

export const SCAN_OPTIONS = ['none', 'standard', 'high'] as const;
export type ScanOption = (typeof SCAN_OPTIONS)[number];

export interface FilmRequest {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  contact: string;
  email: string | null;
  film_process: FilmProcess;
  film_format: FilmFormat;
  rolls_count: number;
  scan_option: ScanOption;
  notes: string | null;
  status: RequestStatus;
  admin_notes: string | null;
}

export interface FilmRequestInput {
  name: string;
  contact: string;
  email?: string | null;
  film_process: FilmProcess;
  film_format: FilmFormat;
  rolls_count: number;
  scan_option: ScanOption;
  notes?: string | null;
}

export const STATUS_LABELS: Record<RequestStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  ready: 'Готово',
  done: 'Выдано',
  cancelled: 'Отмена',
};

export const PROCESS_LABELS: Record<FilmProcess, string> = {
  c41: 'C-41 (цвет)',
  bw: 'Ч/Б',
  e6: 'E-6 (слайд)',
  ecn2: 'ECN-2',
};

export const FORMAT_LABELS: Record<FilmFormat, string> = {
  '135': '35 мм',
  '120': '120 (средний формат)',
  other: 'Другой',
};

export const SCAN_LABELS: Record<ScanOption, string> = {
  none: 'Только проявка',
  standard: 'Проявка + скан',
  high: 'Проявка + hi-res скан',
};
