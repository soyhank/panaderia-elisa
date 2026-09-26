import type { APIRoute } from 'astro';
import { verificarCredenciales, crearSesion } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const f = await request.formData();
  const usuario = String(f.get('usuario') || '').trim();
  const clave = String(f.get('clave') || '');
  let ok = false;
  try {
    ok = await verificarCredenciales(usuario, clave);
  } catch (e) {
    console.error('login', (e as Error).message);
  }
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800)); // frena intentos por fuerza bruta
    return redirect('/admin?error=1', 303);
  }
  crearSesion(cookies, usuario);
  return redirect('/admin/panel', 303);
};
