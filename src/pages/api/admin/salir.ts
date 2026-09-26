import type { APIRoute } from 'astro';
import { cerrarSesion } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = ({ cookies, redirect }) => {
  cerrarSesion(cookies);
  return redirect('/admin?salio=1', 303);
};
