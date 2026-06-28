/**
 * POC-01: SHA-256 Incremental en Subidas Chunked (2GB+)
 * Valida que crypto.createHash('sha256') con múltiples .update(chunk)
 * produce el mismo resultado que el cálculo monolítico, con RAM pico mínima.
 *
 * Hipótesis: procesar un archivo de 2GB con chunks de 8MB usa < 100MB RAM
 * y termina en < 30s.
 *
 * Ejecutar: npx ts-node pocs/POC-01/sha256-incremental.ts
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const CHUNK_SIZE = 8 * 1024 * 1024; // 8MB por chunk
const TEST_FILE = '/tmp/simoncloud-poc01-2gb.bin';
const FILE_SIZE_MB = 512; // Reducido a 512MB para CI; cambiar a 2048 para validación completa

export async function computeSHA256Incremental(filePath: string): Promise<string> {
  const hash = crypto.createHash('sha256');
  const stream = fs.createReadStream(filePath, { highWaterMark: CHUNK_SIZE });

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => {
      hash.update(chunk);
    });
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

async function generateTestFile(filePath: string, sizeMb: number): Promise<void> {
  if (fs.existsSync(filePath)) {
    console.log(`Archivo de prueba ya existe: ${filePath}`);
    return;
  }
  console.log(`Generando archivo de prueba ${sizeMb}MB...`);
  execSync(`dd if=/dev/urandom of=${filePath} bs=1M count=${sizeMb} status=progress`, {
    stdio: 'inherit',
  });
}

function computeSHA256OpenSSL(filePath: string): string {
  const output = execSync(`openssl sha256 ${filePath}`).toString().trim();
  // formato: "SHA256(path)= <hash>"
  return output.split('= ')[1];
}

async function main() {
  console.log('=== POC-01: SHA-256 Incremental ===\n');

  await generateTestFile(TEST_FILE, FILE_SIZE_MB);

  const memBefore = process.memoryUsage().heapUsed;

  console.time('SHA-256 incremental');
  const hashIncremental = await computeSHA256Incremental(TEST_FILE);
  console.timeEnd('SHA-256 incremental');

  const memAfter = process.memoryUsage().heapUsed;
  const memDeltaMB = ((memAfter - memBefore) / 1024 / 1024).toFixed(2);

  console.log(`\nHash incremental (Node.js): ${hashIncremental}`);
  console.log(`RAM delta:                  ${memDeltaMB} MB`);

  console.log('\nCalculando hash de referencia con openssl...');
  const hashOpenSSL = computeSHA256OpenSSL(TEST_FILE);
  console.log(`Hash OpenSSL (referencia):  ${hashOpenSSL}`);

  const match = hashIncremental === hashOpenSSL;
  console.log(`\n✅ Hashes coinciden: ${match}`);

  console.log('\n--- Resultados vs criterios de éxito ---');
  console.log(`Hash match:    ${match ? '✅ PASS' : '❌ FAIL'} (esperado: true)`);
  console.log(`RAM delta:     ${parseFloat(memDeltaMB) < 100 ? '✅ PASS' : '❌ FAIL'} ${memDeltaMB}MB < 100MB`);

  if (!match) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
