export type SHA256Hash = string & { readonly _brand: 'SHA256Hash' };

export function createSHA256Hash(value: string): SHA256Hash {
  if (!/^[0-9a-f]{64}$/.test(value)) {
    throw new Error(`SHA256Hash inválido: ${value.length} chars — debe ser 64 hex lowercase`);
  }
  return value as SHA256Hash;
}
