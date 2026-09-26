// Autenticación del panel: usuario/contraseña (variables de entorno o la
// contraseña cambiada desde el panel) y sesión en una cookie firmada con HMAC.
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { leerJSON, guardarJSON } from './almacen';

export const COOKIE = 'elisa_admin';
const DURACION_MS = 1000 * 60 * 60 * 12; // 12 horas
const RUTA_CREDENCIALES = 'config/credenciales.json';

interface Credenciales {
  usuario: string;
  sal: string;
  hash: string;
  cambiado: string;
}

const secreto = () => {
  const s = process.env.SESSION_SECRET;
  if (s) return s;
  if (import.meta.env.DEV) return 'solo-para-desarrollo';
  throw new Error('Falta SESSION_SECRET');
};

const firmar = (texto: string) => createHmac('sha256', secreto()).update(texto).digest('base64url');

const iguales = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

const hashClave = (clave: string, sal: string) => scryptSync(clave, sal, 64).toString('hex');

export async function verificarCredenciales(usuario: string, clave: string): Promise<boolean> {
  const guardadas = await leerJSON<Credenciales>(RUTA_CREDENCIALES);
  if (guardadas) {
    return iguales(usuario, guardadas.usuario) && iguales(hashClave(clave, guardadas.sal), guardadas.hash);
  }
  const u = process.env.ADMIN_USER || (import.meta.env.DEV ? 'admin' : '');
  const c = process.env.ADMIN_PASSWORD || (import.meta.env.DEV ? 'admin' : '');
  if (!u || !c) return false;
  return iguales(usuario, u) && iguales(clave, c);
}

export async function usuarioActual(): Promise<string> {
  const guardadas = await leerJSON<Credenciales>(RUTA_CREDENCIALES);
  return guardadas?.usuario || process.env.ADMIN_USER || 'admin';
}

export async function cambiarCredenciales(usuario: string, clave: string): Promise<void> {
  const sal = randomBytes(16).toString('hex');
  await guardarJSON(RUTA_CREDENCIALES, { usuario, sal, hash: hashClave(clave, sal), cambiado: new Date().toISOString() });
}

export function crearSesion(cookies: AstroCookies, usuario: string) {
  const datos = Buffer.from(JSON.stringify({ u: usuario, exp: Date.now() + DURACION_MS })).toString('base64url');
  cookies.set(COOKIE, `${datos}.${firmar(datos)}`, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: DURACION_MS / 1000,
  });
}

export function leerSesion(cookies: AstroCookies): string | null {
  const valor = cookies.get(COOKIE)?.value;
  if (!valor) return null;
  const [datos, firma] = valor.split('.');
  if (!datos || !firma) return null;
  try {
    if (!iguales(firma, firmar(datos))) return null;
    const { u, exp } = JSON.parse(Buffer.from(datos, 'base64url').toString());
    return typeof u === 'string' && exp > Date.now() ? u : null;
  } catch {
    return null;
  }
}

export function cerrarSesion(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/' });
}
