# ADR-0004: Saga Orquestada para Upgrade de Cuota con QR Simple

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptada |
| **Fecha** | 2026-05-20 |
| **Autores** | Carlos Alberto Gomez Ormachea |
| **Trazabilidad** | `docs/fsd/FSD_vFinal.md §4.3 FSD-UC-003`, `docs/DTI.md §7.2`, `docs/dti/patrones_asincronos.md §1` |

---

## Contexto

El upgrade de cuota (FSD-UC-003) involucra 3 microservicios (quota-service, payment-service, notification-service) y una API externa (QR Simple). El flujo es: reservar upgrade → generar QR → esperar pago via webhook → activar cuota → notificar. Una transacción distribuida (2PC) no es viable con APIs externas que no soportan el protocolo. Se necesita un mecanismo de consistencia eventual con compensaciones explícitas.

## Decisión

Usar una **Saga Orquestada** con **AWS Step Functions** como orquestador.

- **Transacción Compensable**: `quota-service` reserva el upgrade en estado `PENDING`. Si falla, se cancela con `CancelUpgradeRequest`.
- **Transacción Pivote**: Validación del webhook `payment.confirmed` con HMAC. Punto de no retorno.
- **Transacciones Retornables**: `UpgradeQuota` y `SendConfirmationEmail` — reintentos ilimitados hasta éxito.

## Alternativas consideradas

| Alternativa | Razón de descarte |
|-------------|-------------------|
| **Saga Coreografiada** | Cada servicio debería conocer el estado de los demás para detectar que "el QR expiró y hay que compensar". Aumenta el acoplamiento implícito. Dificulta la observabilidad del flujo completo. |
| **2PC (Two-Phase Commit)** | No soportado por QR Simple (API externa). Bloquea recursos durante la fase de prepare; alto riesgo de deadlock en producción. No viable con arquitectura de microservicios. |
| **Llamada síncrona en cadena** | Si QR Simple tarda > 5min (tiempo de escaneo del usuario), la conexión HTTP se corta. No hay forma de reanudar el flujo. |

## Consecuencias

**Positivas**:
- Estado de la saga trazable en Step Functions (dashboard visual).
- Compensaciones explícitas y documentadas.
- QR puede tardar 5 minutos sin bloquear ningún hilo.

**Negativas**:
- Acoplamiento al orquestador (Step Functions); mitigado por ser un servicio gestionado de AWS.
- Latencia adicional por la coordinación del orquestador (aceptable para flujo de pago).

## Flujo de compensación

Si el QR expira (> 5 min sin webhook):
1. Step Functions dispara timeout.
2. Orquestador ejecuta `CancelUpgradeRequest` en `quota-service`.
3. Estado del upgrade pasa a `CANCELLED`.
4. Usuario recibe notificación "QR expirado, genera uno nuevo".
