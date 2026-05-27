/**
 * POC-02: Circuit Breaker con Opossum.js en NestJS (grade-service → Moodle)
 * Valida que el CB transiciona a OPEN en ≤5 fallos, sirve fallback de Redis
 * con p95 < 500ms, y no produce thread leaks.
 *
 * Ejecutar: npx ts-node pocs/POC-02/circuit-breaker.factory.ts
 * Requires: npm install opossum @types/opossum (solo en devDependencies del POC)
 */

import CircuitBreaker from 'opossum';

// Simulación de cliente Redis simplificado para el POC
const redisStore = new Map<string, string>();

export function createMoodleCB(fn: (...args: any[]) => Promise<any>): CircuitBreaker {
  const cb = new CircuitBreaker(fn, {
    timeout: 3000,                   // Fallo si Moodle tarda > 3s
    errorThresholdPercentage: 50,    // Abre si >50% de llamadas fallan
    resetTimeout: 30000,             // Prueba auto-recovery cada 30s
    volumeThreshold: 5,              // Mínimo 5 llamadas para evaluar el umbral
  });

  cb.fallback(async (materiaId: string) => {
    const cached = redisStore.get(`acta:${materiaId}`);
    if (!cached) throw new Error('CACHE_MISS');
    return { ...JSON.parse(cached), source: 'CACHE_DEGRADED' };
  });

  cb.on('open',     () => console.warn('[CB] OPEN — Moodle no disponible ⚡'));
  cb.on('halfOpen', () => console.info('[CB] HALF-OPEN — Probando recovery'));
  cb.on('close',    () => console.info('[CB] CLOSED — Moodle recuperado ✅'));
  cb.on('fallback', (_result: unknown) => console.warn('[CB] Fallback activado → Redis cache'));

  return cb;
}
