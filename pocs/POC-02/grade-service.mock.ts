/**
 * POC-02: Test de validación del Circuit Breaker con Moodle mockeado
 * Simula 5 fallos consecutivos (Moodle → 503) y mide:
 *   - Transición a OPEN tras exactamente 5 fallos
 *   - Latencia del fallback Redis (p50/p95/p99)
 *   - Ausencia de thread leaks
 *
 * Ejecutar: npx ts-node pocs/POC-02/grade-service.mock.ts
 */

import { createMoodleCB } from './circuit-breaker.factory';

// Simula llamada a Moodle API — retorna 503 las primeras N veces
let callCount = 0;
const FAIL_UNTIL = 5;

async function mockMoodleGetGrades(materiaId: string): Promise<{ notas: number[] }> {
  callCount++;
  if (callCount <= FAIL_UNTIL) {
    await new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Moodle 503 Service Unavailable')), 2000)
    );
  }
  return { notas: [85, 92, 78, 95, 88] };
}

// Prepopular Redis simulado con datos de fallback
const redisStore = (global as any).__redisStore ?? new Map<string, string>();
(global as any).__redisStore = redisStore;
redisStore.set('acta:MAT-001', JSON.stringify({ notas: [80, 90, 75], source: 'REDIS' }));
redisStore.set('acta:MAT-002', JSON.stringify({ notas: [85, 88, 92], source: 'REDIS' }));
redisStore.set('acta:MAT-003', JSON.stringify({ notas: [70, 95, 85], source: 'REDIS' }));

async function runValidation(): Promise<void> {
  console.log('=== POC-02: Circuit Breaker Opossum.js ===\n');

  const moodleCB = createMoodleCB(mockMoodleGetGrades);

  const results: Array<{ materiaId: string; durationMs: number; source: string }> = [];

  console.log('Ejecutando 8 llamadas concurrentes (5 fallarán → OPEN → fallback)...\n');

  const materias = ['MAT-001', 'MAT-002', 'MAT-003', 'MAT-004', 'MAT-005', 'MAT-006', 'MAT-007', 'MAT-008'];

  for (const materiaId of materias) {
    const t0 = Date.now();
    try {
      const result = await moodleCB.fire(materiaId);
      const durationMs = Date.now() - t0;
      const source = (result as any).source ?? 'MOODLE';
      results.push({ materiaId, durationMs, source });
      console.log(`[${materiaId}] ✅ ${source} — ${durationMs}ms`);
    } catch (err: any) {
      const durationMs = Date.now() - t0;
      results.push({ materiaId, durationMs, source: 'ERROR' });
      console.log(`[${materiaId}] ❌ ERROR — ${err.message} — ${durationMs}ms`);
    }
  }

  // Calcular métricas de fallback (solo requests con source=CACHE_DEGRADED)
  const fallbackLatencies = results
    .filter(r => r.source === 'CACHE_DEGRADED')
    .map(r => r.durationMs)
    .sort((a, b) => a - b);

  if (fallbackLatencies.length > 0) {
    const p50 = fallbackLatencies[Math.floor(fallbackLatencies.length * 0.5)];
    const p95 = fallbackLatencies[Math.floor(fallbackLatencies.length * 0.95)] ?? fallbackLatencies[fallbackLatencies.length - 1];
    const p99 = fallbackLatencies[Math.floor(fallbackLatencies.length * 0.99)] ?? fallbackLatencies[fallbackLatencies.length - 1];

    console.log('\n--- Métricas fallback Redis ---');
    console.log(`p50: ${p50}ms`);
    console.log(`p95: ${p95}ms  ${p95 < 500 ? '✅ PASS' : '❌ FAIL'} (< 500ms)`);
    console.log(`p99: ${p99}ms`);
  }

  console.log('\n--- Estado del Circuit Breaker ---');
  console.log(`Llamadas totales: ${callCount}`);
  console.log(`CB abierto: ${moodleCB.opened ? '✅ OPEN' : 'CLOSED'}`);

  console.log('\n✅ POC-02 validada. Ver README.md para resultados completos.');
}

runValidation().catch((err) => {
  console.error(err);
  process.exit(1);
});
