import {
  memoryCreateRequest,
  memoryDeleteRequest,
  memoryListRequests,
  memoryUpdateRequest,
} from './memory-store';
import { createServiceClient, hasSupabaseConfig } from './supabase';
import type { FilmRequest, FilmRequestInput, RequestStatus } from './types';
import {
  FILM_FORMATS,
  FILM_PROCESSES,
  SCAN_OPTIONS,
} from './types';

export class RequestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestValidationError';
  }
}

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function parseFilmRequestInput(body: unknown): FilmRequestInput {
  if (!body || typeof body !== 'object') {
    throw new RequestValidationError('Некорректное тело запроса');
  }

  const data = body as Record<string, unknown>;
  const name = asTrimmedString(data.name);
  const contact = asTrimmedString(data.contact);
  const email = asTrimmedString(data.email);
  const notes = asTrimmedString(data.notes);
  const filmProcess = asTrimmedString(data.film_process);
  const filmFormat = asTrimmedString(data.film_format);
  const scanOption = asTrimmedString(data.scan_option);
  const rollsRaw = data.rolls_count;
  const rollsCount = typeof rollsRaw === 'number' ? rollsRaw : Number(rollsRaw);

  if (name.length < 2) {
    throw new RequestValidationError('Укажите имя');
  }
  if (contact.length < 3) {
    throw new RequestValidationError('Укажите телефон или Telegram');
  }
  if (!FILM_PROCESSES.includes(filmProcess as FilmRequestInput['film_process'])) {
    throw new RequestValidationError('Выберите процесс проявки');
  }
  if (!FILM_FORMATS.includes(filmFormat as FilmRequestInput['film_format'])) {
    throw new RequestValidationError('Выберите формат плёнки');
  }
  if (!SCAN_OPTIONS.includes(scanOption as FilmRequestInput['scan_option'])) {
    throw new RequestValidationError('Выберите вариант скана');
  }
  if (!Number.isInteger(rollsCount) || rollsCount < 1 || rollsCount > 100) {
    throw new RequestValidationError('Количество плёнок: от 1 до 100');
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new RequestValidationError('Некорректный email');
  }

  return {
    name,
    contact,
    email: email || null,
    film_process: filmProcess as FilmRequestInput['film_process'],
    film_format: filmFormat as FilmRequestInput['film_format'],
    rolls_count: rollsCount,
    scan_option: scanOption as FilmRequestInput['scan_option'],
    notes: notes || null,
  };
}

export async function createFilmRequest(input: FilmRequestInput): Promise<FilmRequest> {
  if (!hasSupabaseConfig()) {
    return memoryCreateRequest(input);
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('film_requests')
    .insert({
      name: input.name,
      contact: input.contact,
      email: input.email,
      film_process: input.film_process,
      film_format: input.film_format,
      rolls_count: input.rolls_count,
      scan_option: input.scan_option,
      notes: input.notes,
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Не удалось сохранить заявку');
  }
  return data as FilmRequest;
}

export async function listFilmRequests(): Promise<FilmRequest[]> {
  if (!hasSupabaseConfig()) {
    return memoryListRequests();
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('film_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []) as FilmRequest[];
}

export async function updateFilmRequest(
  id: string,
  patch: { status?: RequestStatus; admin_notes?: string | null },
): Promise<FilmRequest | null> {
  if (!hasSupabaseConfig()) {
    return memoryUpdateRequest(id, patch);
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('film_requests')
    .update(patch)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return (data as FilmRequest | null) ?? null;
}

export async function deleteFilmRequest(id: string): Promise<boolean> {
  if (!hasSupabaseConfig()) {
    return memoryDeleteRequest(id);
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase.from('film_requests').delete().eq('id', id).select('id');

  if (error) {
    throw new Error(error.message);
  }
  return (data?.length ?? 0) > 0;
}
