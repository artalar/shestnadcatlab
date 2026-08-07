import type { APIRoute } from 'astro';
import { setAdminCookie, verifyAdminSecret } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = (await request.json()) as { secret?: string };
    const secret = typeof body.secret === 'string' ? body.secret : '';
    if (!verifyAdminSecret(secret)) {
      return new Response(JSON.stringify({ error: 'Неверный ключ' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    setAdminCookie(cookies);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Ошибка входа' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
