import type { APIRoute } from 'astro';
import { deleteFilmRequest, updateFilmRequest } from '../../../../lib/requests';
import { REQUEST_STATUSES, type RequestStatus } from '../../../../lib/types';

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  }

  try {
    const body = (await request.json()) as {
      status?: string;
      admin_notes?: string | null;
    };

    const patch: { status?: RequestStatus; admin_notes?: string | null } = {};
    if (body.status !== undefined) {
      if (!REQUEST_STATUSES.includes(body.status as RequestStatus)) {
        return new Response(JSON.stringify({ error: 'Некорректный статус' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      patch.status = body.status as RequestStatus;
    }
    if (body.admin_notes !== undefined) {
      patch.admin_notes = body.admin_notes;
    }

    const row = await updateFilmRequest(id, patch);
    if (!row) {
      return new Response(JSON.stringify({ error: 'Не найдено' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true, request: row }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Ошибка обновления' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  }

  try {
    const removed = await deleteFilmRequest(id);
    if (!removed) {
      return new Response(JSON.stringify({ error: 'Не найдено' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Ошибка удаления' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
