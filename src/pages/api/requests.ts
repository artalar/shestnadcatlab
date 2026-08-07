import type { APIRoute } from 'astro';
import { createFilmRequest, parseFilmRequestInput, RequestValidationError } from '../../lib/requests';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const input = parseFilmRequestInput(body);
    const row = await createFilmRequest(input);
    return new Response(JSON.stringify({ ok: true, id: row.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error(error);
    return new Response(JSON.stringify({ error: 'Не удалось отправить заявку' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
