import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { leerAjustes, EVENTOS } from '../../lib/ajustes';

export const prerender = false;

const GRAPH = 'https://graph.facebook.com/v23.0';
const PERMITIDOS = new Set<string>([...EVENTOS.map((e) => e.id), 'PageView']);
const sha = (v: string) => createHash('sha256').update(v.trim().toLowerCase()).digest('hex');

// Réplica de eventos del navegador a la API de conversiones de Meta (servidor a servidor).
// Usa el mismo event_id que el píxel para que Meta deduplique.
export const POST: APIRoute = async ({ request, clientAddress }) => {
  const a = await leerAjustes();
  if (!a.pixelActivo || !a.pixelId || !a.capiToken) return new Response(null, { status: 204 });

  let b: any;
  try {
    b = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!b || !PERMITIDOS.has(b.evento) || a.eventos[b.evento] === false) return new Response(null, { status: 204 });

  const user_data: Record<string, unknown> = {
    client_ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress,
    client_user_agent: request.headers.get('user-agent') || '',
  };
  if (typeof b.fbp === 'string') user_data.fbp = b.fbp.slice(0, 200);
  if (typeof b.fbc === 'string') user_data.fbc = b.fbc.slice(0, 300);
  const u = b.usuario || {};
  if (u.correo) user_data.em = [sha(String(u.correo))];
  if (u.telefono) user_data.ph = [sha(String(u.telefono).replace(/\D/g, ''))];
  if (u.nombre) user_data.fn = [sha(String(u.nombre).split(' ')[0])];

  const cuerpo: Record<string, unknown> = {
    data: [
      {
        event_name: b.evento,
        event_time: Math.floor(Date.now() / 1000),
        event_id: String(b.eventId || '').slice(0, 100) || undefined,
        event_source_url: String(b.url || '').slice(0, 500),
        action_source: 'website',
        user_data,
        custom_data: b.params && typeof b.params === 'object' ? b.params : {},
      },
    ],
  };
  if (a.testEventCode) cuerpo.test_event_code = a.testEventCode;

  try {
    const r = await fetch(`${GRAPH}/${encodeURIComponent(a.pixelId)}/events?access_token=${encodeURIComponent(a.capiToken)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });
    if (!r.ok) console.error('CAPI', r.status, (await r.text()).slice(0, 300));
  } catch (e) {
    console.error('CAPI', (e as Error).message);
  }
  return new Response(null, { status: 204 });
};
