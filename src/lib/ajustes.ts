import { leerJSON, guardarJSON } from './almacen';

// Eventos que el sitio sabe disparar, con dónde ocurren (se muestran en /admin).
export const EVENTOS = [
  { id: 'ViewContent', donde: 'Al llegar a la carta o filtrar por categoría' },
  { id: 'Lead', donde: 'Al tocar «Pedir» en un producto o «Cotizar mi torta» (con el precio del producto)' },
  { id: 'Contact', donde: 'Al tocar cualquier otro botón de WhatsApp (cabecera, portada, flotante, contacto)' },
] as const;

export interface Ajustes {
  pixelId: string;
  pixelActivo: boolean;
  eventos: Record<string, boolean>;
  capiToken: string;
  testEventCode: string;
  actualizado: string | null;
  actualizadoPor: string | null;
}

export const RUTA_AJUSTES = 'config/ajustes.json';

export const ajustesPorDefecto = (): Ajustes => ({
  pixelId: '',
  pixelActivo: true,
  eventos: Object.fromEntries(EVENTOS.map((e) => [e.id, true])),
  capiToken: '',
  testEventCode: '',
  actualizado: null,
  actualizadoPor: null,
});

let cache: { datos: Ajustes; hasta: number } | null = null;

export async function leerAjustes(fresco = false): Promise<Ajustes> {
  if (!fresco && cache && cache.hasta > Date.now()) return cache.datos;
  const guardado = await leerJSON<Partial<Ajustes>>(RUTA_AJUSTES);
  const base = ajustesPorDefecto();
  const datos: Ajustes = { ...base, ...guardado, eventos: { ...base.eventos, ...(guardado?.eventos || {}) } };
  cache = { datos, hasta: Date.now() + 30_000 };
  return datos;
}

export async function guardarAjustes(datos: Ajustes): Promise<void> {
  await guardarJSON(RUTA_AJUSTES, datos);
  cache = { datos, hasta: Date.now() + 30_000 };
}

// Solo lo que puede ver cualquier visitante (nunca el token de la API de conversiones).
export const ajustesPublicos = (a: Ajustes) => ({
  pixelId: a.pixelActivo ? a.pixelId : '',
  eventos: a.eventos,
  capi: Boolean(a.pixelActivo && a.pixelId && a.capiToken),
});
