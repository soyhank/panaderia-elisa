import type { APIRoute } from 'astro';
import { leerAjustes, ajustesPublicos } from '../../lib/ajustes';

export const prerender = false;

// Configuración pública que usa el navegador: píxel, eventos activos, WhatsApp y aviso.
export const GET: APIRoute = async () => {
  const ajustes = await leerAjustes();
  return new Response(JSON.stringify(ajustesPublicos(ajustes)), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=0, s-maxage=15',
    },
  });
};
