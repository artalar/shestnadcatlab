import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';

export const ADMIN_COOKIE = 'shest_admin';

function getAdminSecret(): string {
  const secret = import.meta.env.ADMIN_SECRET;
  if (!secret || secret.length < 8) {
    throw new Error('ADMIN_SECRET must be set (min 8 characters)');
  }
  return secret;
}

export function createAdminToken(): string {
  return createHmac('sha256', getAdminSecret()).update('shestnadcat-admin').digest('hex');
}

export function verifyAdminSecret(candidate: string): boolean {
  const expected = getAdminSecret();
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) {
    return false;
  }
  const expected = createAdminToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

export function isAdminAuthenticated(cookies: AstroCookies): boolean {
  try {
    return verifyAdminToken(cookies.get(ADMIN_COOKIE)?.value);
  } catch {
    return false;
  }
}

export function setAdminCookie(cookies: AstroCookies): void {
  cookies.set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function clearAdminCookie(cookies: AstroCookies): void {
  cookies.delete(ADMIN_COOKIE, { path: '/' });
}
