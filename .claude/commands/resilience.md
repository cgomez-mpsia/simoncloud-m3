# Skill: simoncloud-resilience

## Role
Defines la estrategia de resiliencia para los servicios críticos de SimonCloud contra sus dependencias externas. Aplicas Circuit Breaker, Retry + Timeout + Exponential Backoff con Jitter, Fallback degradado, Bulkhead y Auto-scaling, con parámetros numéricos concretos. Declaras la métrica observable que valida cada patrón y aplicas CAP theorem por flujo.

## Activation context
Activar cuando: se necesita poblar DTI §6.2 (Resiliencia), redactar un ADR de resiliencia, o revisar la estrategia de tolerancia a fallos de SimonCloud. NO activar si los servicios críticos aún no están identificados.

## Context / Inputs requeridos
- `AGENTS.md` — 7 microservicios de SimonCloud y sus dependencias externas (MinIO, RabbitMQ, WebSISS SSO, QR Simple Bolivia, LTI Moodle/Classroom).
- `docs/prd/PRD_vFinal.md §8` — NFRs de disponibilidad y latencia.
- `docs/fsd/FSD_vFinal.md §11` — NFRs detallados con umbrales.
- Perfil de tráfico: on-premise UMSS, picos al inicio de semestre, picos en horario de entrega de tareas (20:00–23:59 UTC-4).

## Reasoning (pasos en orden)

1. **Verificar inputs**: si faltan dependencias externas o NFRs, STOP.
2. **Para cada servicio crítico y dependencia**, decidir combinación de patrones:

   - **Circuit Breaker**: estados Closed → Open → Half-Open. Parámetros mínimos: failure rate threshold (típico 50 %), sliding window (típico 100 calls o 60 s), wait duration en Open (típico 30 s), minimum calls antes de evaluar (típico 20).
   - **Retry + Timeout + Exponential Backoff + Jitter**: max retries 3, timeout por intento 1-2 s, backoff base 200 ms, jitter [0, base × 2^n]. Retry SOLO en 5xx/timeouts, NUNCA en 4xx.
   - **Fallback degradado**: respuesta cacheada, respuesta vacía documentada, o feature flag para degradar gracefully. Nunca silencioso — emitir métrica.
   - **Bulkhead**: pools de conexiones Prisma separados por dependencia; si MinIO se cae, no debe agotar el pool de PostgreSQL.
   - **Rate Limiting**: token bucket en el API Gateway (NestJS `@nestjs/throttler`). Típico: 100 req/s por tenant institucional.
   - **Auto-scaling**: Docker Swarm replica scaling trigger: CPU > 70 % o queue depth RabbitMQ > 500 msgs.

3. **Aplicar CAP theorem por flujo**: en partición de red, documentar si se sacrifica Consistency (responder con dato stale) o Availability (responder 503).
4. **Asignar parámetros numéricos concretos** — cero "razonable", "moderado" o "típico" sin número.
5. **Identificar la métrica observable** (p99 latency, error rate por dependencia, CB state transitions, queue depth, retry count).
6. **Plantear plan de Chaos Engineering**: 1-2 experimentos por dependencia al semestre (kill MinIO container, latencia RabbitMQ inyectada de 5 s, WebSISS SSO 503 forzado).

## Stop condition
Detente cuando: cada servicio crítico tiene al menos una fila con 4+ parámetros numéricos, métrica observable y dimensión CAP declarada.

## Output esperado

Tabla para DTI §6.2:

| Servicio | Dependencia externa | Patrón | Parámetros numéricos | Métrica observable | CAP elegido |
|----------|---------------------|--------|----------------------|--------------------|-------------|
| SimonDrop | MinIO (upload binario) | CB + Retry + Fallback | failure rate 50 %, window 100 calls, wait open 30 s, retry max 3, timeout 5 s, backoff base 500 ms, jitter [0,1000 ms] | p99 upload latency, CB state transitions | AP (acepto retry diferido si MinIO cae) |
| SimonDrop | WebSISS SSO | CB + Retry | failure rate 30 %, window 50 calls, wait open 15 s, retry max 2, timeout 2 s, backoff base 200 ms | SSO error rate, CB open events | CP (mejor error 503 que token inválido) |
| Gateway | QR Simple Bolivia | CB + Retry + Fallback | failure rate 50 %, window 80 calls, wait open 60 s, retry max 3, timeout 3 s, backoff base 300 ms, fallback: encolar pago para reintentar | payment error rate, CB state | AP (encolo y notifico) |
| Notificaciones | RabbitMQ | Bulkhead + Retry | max consumers 20, prefetch 10, retry max 5, backoff 1 s, DLQ tras 5 fallos | queue depth, consumer lag, DLQ count | AP (mensaje llega eventual) |

Plus: bullets de plan Chaos Engineering (1 experimento por dependencia crítica, criterio de éxito medible).

## Invariantes
- MUST: Retry NUNCA en 4xx (incluye JWT 401 — no tiene sentido reintentar).
- MUST: Fallback siempre emite métrica/alerta (no silencioso).
- MUST: Circuit Breaker en toda llamada sync cross-servicio (evitar cascade failure).
- MUST: Backoff siempre con jitter para evitar thundering herd en inicio de semestre.
- MUST NOT: `retries = 3, timeout = 5s` para todo sin justificación por SLA de la dependencia.

## Anti-patrones específicos SimonCloud
- **Sin CB en llamada NestJS → WebSISS SSO sync**: si WebSISS se cae al inicio de semestre (pico de autenticaciones) → toda la plataforma cae en cascada.
- **Upload MinIO sin timeout**: hilo bloqueado indefinidamente con archivos de 50+ MB. Mitigación: timeout 30 s + streaming chunked.
- **RabbitMQ sin DLQ**: mensajes de notificación perdidos silenciosamente si el consumer falla. Mitigación: DLQ con TTL 48 h + alerta.

## Mini ejemplo de invocación
> "Servicios críticos: SimonDrop (dep. MinIO, WebSISS SSO), Gateway (dep. QR Simple Bolivia), Notificaciones (dep. RabbitMQ). NFRs: p99 < 500 ms, error rate < 1 %, disponibilidad 99 %. Picos al inicio de semestre. Usa `/project:resilience` y genera tabla DTI §6.2 + plan Chaos Engineering."
