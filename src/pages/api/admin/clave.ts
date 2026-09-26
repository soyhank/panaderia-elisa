import type { APIRoute } from 'astro';
import { leerSesion, verificarCredenciales, cambiarCredenciales, crearSesion } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const usuario = leerSesion(cookies);
  if (!usuario) return redirect('/admin', 303);

  const f = await request.formData();
  const actual = String(f.get('actual') || '');
  const nuevoUsuario = String(f.get('nuevoUsuario') || '').trim() || usuario;
  const nueva = String(f.get('nueva') || '');
  const repetir = String(f.get('repetir') || '');

  if (!(await verificarCredenciales(usuario, actual))) return redirect('/admin/panel?error=actual#seguridad', 303);
  if (nueva.length < 8) return redirect('/admin/panel?error=corta#seguridad', 303);
  if (nueva !== repetir) return redirect('/admin/panel?error=repetir#seguridad', 303);
  if (!/^[\w.@-]{3,40}$/.test(nuevoUsuario)) return redirect('/admin/panel?error=usuario#seguridad', 303);

  await cambiarCredenciales(nuevoUsuario, nueva);
  crearSesion(cookies, nuevoUsuario);
  return redirect('/admin/panel?ok=clave#seguridad', 303);
};
