import type { APIRoute } from 'astro';
import { leerSesion } from '../../../lib/auth';
import { leerAjustes, guardarAjustes, EVENTOS } from '../../../lib/ajustes';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const usuario = leerSesion(cookies);
  if (!usuario) return redirect('/admin', 303);

  const f = await request.formData();
  const actual = await leerAjustes(true);
  const pixelId = String(f.get('pixelId') || '').replace(/\D/g, '');
  if (pixelId && (pixelId.length < 10 || pixelId.length > 20)) return redirect('/admin/panel?error=pixel', 303);

  const token = String(f.get('capiToken') || '').trim();
  await guardarAjustes({
    ...actual,
    pixelId,
    pixelActivo: f.get('pixelActivo') === '1',
    eventos: Object.fromEntries(EVENTOS.map((e) => [e.id, f.get(`ev_${e.id}`) === '1'])),
    capiToken: f.get('borrarToken') === '1' ? '' : token || actual.capiToken,
    testEventCode: String(f.get('testEventCode') || '').trim().slice(0, 40),
    actualizado: new Date().toISOString(),
    actualizadoPor: usuario,
  });
  return redirect('/admin/panel?ok=1', 303);
};
