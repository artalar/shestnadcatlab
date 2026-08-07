import type { APIRoute } from 'astro';
import { createFilmRequest, parseFilmRequestInput, RequestValidationError } from '../../lib/requests';

export const prerender = false;

async function readBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return request.json();
  }
  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

export const POST: APIRoute = async ({ request }) => {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json')
    || (request.headers.get('content-type') ?? '').includes('application/json');

  try {
    const body = await readBody(request);
    const input = parseFilmRequestInput(body);
    const row = await createFilmRequest(input);

    if (!wantsJson) {
      return new Response(null, {
        status: 303,
        headers: { Location: '/?sent=1#request' },
      });
    }

    return new Response(JSON.stringify({ ok: true, id: row.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof RequestValidationError) {
      if (!wantsJson) {
        return new Response(null, {
          status: 303,
          headers: { Location: `/?error=${encodeURIComponent(error.message)}#request` },
        });
      }
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error(error);
    if (!wantsJson) {
      return new Response(null, {
        status: 303,
        headers: { Location: '/?error=send#request' },
      });
    }
    return new Response(JSON.stringify({ error: 'Не удалось отправить заявку' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
