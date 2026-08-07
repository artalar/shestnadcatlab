import { defineMiddleware } from 'astro:middleware';
import { isAdminAuthenticated } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  const isAdminArea = path === '/admin' || path.startsWith('/admin/');
  const isLoginPage = path === '/admin/login' || path === '/admin/login/';
  const isAdminApi = path.startsWith('/api/admin/');
  const isLoginApi = path === '/api/admin/login';

  if (isAdminArea && !isLoginPage && !isAdminAuthenticated(context.cookies)) {
    return context.redirect('/admin/login');
  }

  if (isAdminApi && !isLoginApi && !isAdminAuthenticated(context.cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return next();
});
