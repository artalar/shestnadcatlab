import { randomUUID } from 'node:crypto';
import type { FilmRequest, FilmRequestInput, RequestStatus } from './types';

const requests = new Map<string, FilmRequest>();

function seedIfEmpty(): void {
  if (requests.size > 0) {
    return;
  }
  const now = new Date().toISOString();
  const sample: FilmRequest = {
    id: randomUUID(),
    created_at: now,
    updated_at: now,
    name: 'Анна К.',
    contact: '@anna_film',
    email: 'anna@example.com',
    film_process: 'c41',
    film_format: '135',
    rolls_count: 2,
    scan_option: 'standard',
    notes: 'Демо-заявка для локального режима',
    status: 'new',
    admin_notes: null,
  };
  requests.set(sample.id, sample);
}

export function memoryListRequests(): FilmRequest[] {
  seedIfEmpty();
  return [...requests.values()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function memoryCreateRequest(input: FilmRequestInput): FilmRequest {
  seedIfEmpty();
  const now = new Date().toISOString();
  const row: FilmRequest = {
    id: randomUUID(),
    created_at: now,
    updated_at: now,
    name: input.name,
    contact: input.contact,
    email: input.email ?? null,
    film_process: input.film_process,
    film_format: input.film_format,
    rolls_count: input.rolls_count,
    scan_option: input.scan_option,
    notes: input.notes ?? null,
    status: 'new',
    admin_notes: null,
  };
  requests.set(row.id, row);
  return row;
}

export function memoryUpdateRequest(
  id: string,
  patch: Partial<Pick<FilmRequest, 'status' | 'admin_notes'>>,
): FilmRequest | null {
  seedIfEmpty();
  const existing = requests.get(id);
  if (!existing) {
    return null;
  }
  const next: FilmRequest = {
    ...existing,
    status: (patch.status as RequestStatus | undefined) ?? existing.status,
    admin_notes: patch.admin_notes === undefined ? existing.admin_notes : patch.admin_notes,
    updated_at: new Date().toISOString(),
  };
  requests.set(id, next);
  return next;
}

export function memoryDeleteRequest(id: string): boolean {
  seedIfEmpty();
  return requests.delete(id);
}
