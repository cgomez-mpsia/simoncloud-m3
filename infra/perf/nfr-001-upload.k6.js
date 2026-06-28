/**
 * NFR-001: Tiempo de subida (p95) < 30 s para archivos ≤ 100 MB en red campus
 * Trazabilidad: FSD §10 NFR-001, DTI §11, DTI §12.4
 *
 * Ejecución:
 *   k6 run --env BASE_URL=http://localhost:3000 \
 *          --env JWT_TOKEN=<token_docente> \
 *          --env DROP_ID=<uuid> \
 *          infra/perf/nfr-001-upload.k6.js
 *
 * Resultados esperados:
 *   ✅ http_req_duration p(95) < 30 000 ms
 *   ✅ http_req_failed    rate  < 1 %
 *   ✅ checks             rate  = 100 %
 *
 * Nota: este script valida NFR-001 en staging DTIC (Módulo 5).
 * No se ejecuta contra POC-03 (single-PUT through server, sin presigned URLs).
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// ── Métricas personalizadas ──────────────────────────────────────────────────
const uploadErrors = new Rate('upload_errors');
const uploadDuration = new Trend('upload_duration_ms', true);

// ── Configuración de carga ────────────────────────────────────────────────────
export const options = {
  scenarios: {
    // NFR-001: p95 < 30 s con VUs concurrentes en red campus
    nfr_001_upload_latency: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 10 },   // ramp-up
        { duration: '2m',  target: 10 },   // steady state
        { duration: '30s', target: 0  },   // ramp-down
      ],
      gracefulRampDown: '10s',
      tags: { scenario: 'nfr_001' },
    },
  },
  thresholds: {
    // NFR-001: p95 de subida < 30 s
    'http_req_duration{scenario:nfr_001}': ['p(95)<30000'],
    // Tasa de error < 1 %
    'http_req_failed{scenario:nfr_001}': ['rate<0.01'],
    // Métrica personalizada también debe cumplir
    upload_duration_ms: ['p(95)<30000'],
    upload_errors: ['rate<0.01'],
    // Todos los checks deben pasar
    checks: ['rate==1.0'],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Genera un ArrayBuffer de `sizeBytes` bytes con contenido pseudoaleatorio. */
function generateFilePayload(sizeBytes) {
  // k6 no tiene crypto.getRandomValues; usamos un patrón repetido para simular
  const chunk = 'SimonCloud-NFR-001-perf-test-payload-';
  const repeated = chunk.repeat(Math.ceil(sizeBytes / chunk.length));
  return repeated.slice(0, sizeBytes);
}

// ── Setup (se ejecuta una sola vez) ───────────────────────────────────────────
export function setup() {
  const baseUrl  = __ENV.BASE_URL  || 'http://localhost:3000';
  const jwtToken = __ENV.JWT_TOKEN || '';
  const dropId   = __ENV.DROP_ID   || '';

  if (!jwtToken) {
    console.warn('JWT_TOKEN no provisto — las peticiones fallarán con 401');
  }
  if (!dropId) {
    console.warn('DROP_ID no provisto — usar un UUID válido de un SimonDrop abierto');
  }

  return { baseUrl, jwtToken, dropId };
}

// ── Escenario principal ───────────────────────────────────────────────────────
export default function (data) {
  const { baseUrl, jwtToken, dropId } = data;

  // Archivo de prueba: 10 MB (ajustable; 100 MB = 100 * 1024 * 1024)
  const FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB para CI; cambiar a 100 MB en staging
  const fileName = `test-upload-${__VU}-${__ITER}.bin`;

  const payload = generateFilePayload(FILE_SIZE_BYTES);

  const headers = {
    Authorization: `Bearer ${jwtToken}`,
    'Content-Type': 'multipart/form-data',
  };

  const formData = {
    file: http.file(payload, fileName, 'application/octet-stream'),
  };

  const startTime = Date.now();

  const res = http.post(
    `${baseUrl}/api/drops/${dropId}/upload`,
    formData,
    { headers, tags: { scenario: 'nfr_001' } },
  );

  const elapsed = Date.now() - startTime;
  uploadDuration.add(elapsed);

  const ok = check(res, {
    'status 201 Created':       (r) => r.status === 201,
    'respuesta tiene archivoId': (r) => {
      try {
        const body = JSON.parse(r.body);
        return typeof body.id === 'string' && body.id.length > 0;
      } catch {
        return false;
      }
    },
    'p95 < 30 s':               () => elapsed < 30_000,
  });

  if (!ok || res.status !== 201) {
    uploadErrors.add(1);
  }

  sleep(1);
}

// ── Teardown ──────────────────────────────────────────────────────────────────
export function teardown(data) {
  console.log(`NFR-001 k6 run completo. Base URL: ${data.baseUrl}`);
  console.log('Revisar resumen: upload_duration_ms p(95) debe ser < 30 000 ms');
}
