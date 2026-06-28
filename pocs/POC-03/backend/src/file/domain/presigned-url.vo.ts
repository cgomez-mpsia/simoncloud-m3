// VO de producción — POC-03 usa upload directo (ver DTI §12.3, ADR-0003).
// En Módulo 5 este VO encapsula la URL presignada generada por MinIO SDK.
export type PresignedUrl = string & { readonly _brand: 'PresignedUrl' };

export function createPresignedUrl(url: string, expiresAt: Date): PresignedUrl {
  if (!url.startsWith('http')) {
    throw new Error('PresignedUrl debe comenzar con http/https');
  }
  if (expiresAt <= new Date()) {
    throw new Error('PresignedUrl ya expiró al momento de creación');
  }
  return url as PresignedUrl;
}
