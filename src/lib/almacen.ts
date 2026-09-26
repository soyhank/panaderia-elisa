// Almacén de ajustes del sitio: Vercel Blob privado en producción y un archivo
// local (.data/) cuando no hay BLOB_READ_WRITE_TOKEN (desarrollo).
import { get, put } from '@vercel/blob';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const usaBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const carpetaLocal = path.join(process.cwd(), '.data');

export async function leerJSON<T>(ruta: string): Promise<T | null> {
  if (!usaBlob()) {
    try {
      return JSON.parse(await fs.readFile(path.join(carpetaLocal, ruta), 'utf8')) as T;
    } catch {
      return null;
    }
  }
  try {
    const r = await get(ruta, { access: 'private', useCache: false });
    if (!r || r.statusCode !== 200) return null;
    return JSON.parse(await new Response(r.stream).text()) as T;
  } catch (e) {
    if ((e as Error).name === 'BlobNotFoundError') return null;
    throw e;
  }
}

export async function guardarJSON(ruta: string, datos: unknown): Promise<void> {
  const cuerpo = JSON.stringify(datos, null, 2);
  if (!usaBlob()) {
    const destino = path.join(carpetaLocal, ruta);
    await fs.mkdir(path.dirname(destino), { recursive: true });
    await fs.writeFile(destino, cuerpo, 'utf8');
    return;
  }
  await put(ruta, cuerpo, {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 60,
  });
}
