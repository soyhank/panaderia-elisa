// Píxel de Meta configurable desde /admin.
// El sitio es estático: al cargar pide /api/config y, si hay un ID, instala el píxel
// y mide los clics a WhatsApp (pedidos de productos = Lead, resto = Contact).

declare global {
  interface Window { fbq?: any; _fbq?: any }
}
interface Config { pixelId: string; eventos: Record<string, boolean>; capi: boolean }
interface Pendiente { evento: string; params: Record<string, unknown>; eventId: string }

let cfg: Config | null = null;
const cola: Pendiente[] = [];
const sesion = (() => { try { return sessionStorage; } catch { return null; } })();
const modoPrueba = new URLSearchParams(location.search).has('probar_pixel') || sesion?.getItem('probar_pixel') === '1';
if (modoPrueba) sesion?.setItem('probar_pixel', '1');

const nuevoId = () => (crypto as any).randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
const cookie = (n: string) => document.cookie.split('; ').find((c) => c.startsWith(n + '='))?.split('=')[1];

export function rastrear(evento: string, params: Record<string, unknown> = {}) {
  const p = { evento, params, eventId: nuevoId() };
  cfg ? enviar(p) : cola.push(p);
}

function enviar(p: Pendiente) {
  if (!cfg) return;
  const activo = Boolean(cfg.pixelId) && (p.evento === 'PageView' || cfg.eventos[p.evento] !== false);
  if (activo && window.fbq) {
    window.fbq('track', p.evento, p.params, { eventID: p.eventId });
    if (cfg.capi) {
      const cuerpo = JSON.stringify({ evento: p.evento, params: p.params, eventId: p.eventId, url: location.href, fbp: cookie('_fbp'), fbc: cookie('_fbc') });
      if (!navigator.sendBeacon?.('/api/evento', new Blob([cuerpo], { type: 'text/plain' }))) {
        fetch('/api/evento', { method: 'POST', body: cuerpo, keepalive: true }).catch(() => {});
      }
    }
  }
  if (modoPrueba) mostrarPrueba(p, activo);
}

function instalarPixel(id: string) {
  /* Código base oficial del píxel de Meta */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function (...args: unknown[]) { n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args); });
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true; t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode!.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', id);
}

export async function iniciarPixel() {
  let datos: Config | null = null;
  try {
    const g = JSON.parse(sesion?.getItem('elisa_config') || 'null');
    if (g && g.hasta > Date.now() && !modoPrueba) datos = g.datos;
  } catch {}
  if (!datos) {
    try {
      const r = await fetch('/api/config');
      if (r.ok) {
        datos = await r.json();
        sesion?.setItem('elisa_config', JSON.stringify({ datos, hasta: Date.now() + 120_000 }));
      }
    } catch {}
  }
  cfg = datos || { pixelId: '', eventos: {}, capi: false };
  if (cfg.pixelId) instalarPixel(cfg.pixelId);
  if (cfg.pixelId || modoPrueba) cola.unshift({ evento: 'PageView', params: {}, eventId: nuevoId() });
  cola.splice(0).forEach(enviar);
}

// Clics a WhatsApp: un pedido de producto es Lead; cualquier otro botón, Contact.
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="wa.me"]');
  if (!a) return;
  const producto = a.dataset.pedido;
  if (producto) {
    const precio = Number(a.dataset.precio) || undefined;
    rastrear('Lead', { content_name: producto, content_category: a.dataset.categoria || 'pedido', content_type: 'product', ...(precio ? { value: precio, currency: 'PEN' } : {}) });
  } else {
    rastrear('Contact', { content_name: 'boton_whatsapp' });
  }
});

// La carta a la vista y filtros por categoría
const carta = document.getElementById('carta');
if (carta) {
  const io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { rastrear('ViewContent', { content_name: 'Carta', content_category: 'todos' }); io.disconnect(); }
  }, { rootMargin: '0px 0px -40% 0px' });
  io.observe(carta);
  document.querySelectorAll<HTMLButtonElement>('#cat-tabs [role=tab]').forEach((t) =>
    t.addEventListener('click', () => rastrear('ViewContent', { content_name: 'Carta', content_category: t.dataset.cat })),
  );
}

// Panel flotante para comprobar los eventos (se activa con ?probar_pixel=1).
function mostrarPrueba(p: Pendiente, activo: boolean) {
  let caja = document.getElementById('prueba-pixel');
  if (!caja) {
    caja = document.createElement('div');
    caja.id = 'prueba-pixel';
    caja.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:9999;width:min(340px,calc(100% - 32px));background:#fff;color:#2b1a12;border-radius:16px;box-shadow:0 20px 50px -10px rgba(0,0,0,.4);font:13px system-ui,sans-serif;overflow:hidden';
    caja.innerHTML = `<div style="background:#2b1a12;color:#f7f1e8;padding:10px 14px;display:flex;justify-content:space-between;gap:8px"><span><strong>Prueba del píxel</strong><br><small>${cfg?.pixelId ? 'ID ' + cfg.pixelId : 'sin ID configurado'}${cfg?.capi ? ' · API de conversiones' : ''}</small></span><button type="button" aria-label="Cerrar" style="background:none;border:0;color:#fff;font-size:20px;cursor:pointer">×</button></div><ol style="list-style:none;margin:0;padding:8px 14px;max-height:220px;overflow:auto"></ol>`;
    caja.querySelector('button')!.addEventListener('click', () => { sesion?.removeItem('probar_pixel'); caja!.remove(); });
    document.body.appendChild(caja);
  }
  const li = document.createElement('li');
  li.style.cssText = `padding:5px 0;border-bottom:1px solid #eee;color:${activo ? '#0b7a55' : '#8a6b5c'}`;
  const valor = p.params.value != null ? ` · S/ ${p.params.value}` : '';
  const nombre = p.params.content_name ? ` · ${p.params.content_name}` : '';
  li.textContent = `${activo ? '●' : '○'} ${new Date().toLocaleTimeString('es-PE')} · ${p.evento}${nombre}${valor}${activo ? '' : ' (no enviado)'}`;
  caja.querySelector('ol')!.prepend(li);
}
