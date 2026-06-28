# PR-UC-008 — Worker RabbitMQ — Notificaciones Push/Email

| Campo | Valor |
|-------|-------|
| **ID** | `PR-UC-008` |
| **Título** | Worker de consumo RabbitMQ para notificaciones push y email |
| **Artefacto origen** | `docs/fsd/FSD_vFinal.md §4.7 FSD-UC-007` |
| **Tipo** | Generación / Messaging |
| **Modelo** | Claude Sonnet 4 |
| **Temperatura** | 0.0 |
| **Versión** | v1.0 |
| **Fecha** | 2026-05-17 |
| **Estado** | applied |

## Role
```
Eres un Backend Engineer experto en NestJS, amqplib, mensajería asíncrona
y patrones de retry con dead-letter queues (DLQ).
```

## Task
```
Crear un worker NestJS que consuma la cola 'simondrop.file.uploaded' de
RabbitMQ, procese el evento FileUploadedEvent y dispare notificaciones
(email + push) al docente propietario del SimonDrop. Máximo 3 reintentos
antes de enrutar al DLQ.
```

## Context
```
- Fuente: FSD-UC-007 en docs/fsd/FSD_vFinal.md
- Cola: simondrop.file.uploaded (at-least-once delivery)
- Evento: { fileId, filename, sha256Hash, dropId, uploaderId, uploadedAt }
- Stack: amqplib, NestJS 10, @nestjs/schedule
- DLQ: simondrop.file.uploaded.dlq tras 3 reintentos fallidos
- Notificación: email (SMTP/SendGrid) + push (WebPush VAPID)
```

## Reasoning
```
1. Conectar a RabbitMQ al arrancar (OnModuleInit)
2. channel.consume('simondrop.file.uploaded', handler, { noAck: false })
3. En handler: extraer payload, buscar docente del drop, enviar notificación
4. Si éxito: channel.ack(msg)
5. Si falla y retryCount < 3: channel.nack(msg, false, true) — requeue
6. Si retryCount >= 3: channel.nack(msg, false, false) → DLQ
```

## Output Esperado
```typescript
@Injectable()
export class NotificationWorker implements OnModuleInit {
  async onModuleInit() {
    this.channel.consume('simondrop.file.uploaded', async (msg) => {
      if (!msg) return;
      try {
        const event = JSON.parse(msg.content.toString());
        await this.notifyDocente(event);
        this.channel.ack(msg);
      } catch {
        const retries = (msg.properties.headers['x-retry-count'] ?? 0) + 1;
        retries < 3
          ? this.channel.nack(msg, false, true)
          : this.channel.nack(msg, false, false);
      }
    });
  }
}
```

## Invariantes
- **MUST** usar manual ack (noAck: false)
- **MUST** implementar máximo 3 reintentos con x-retry-count header
- **MUST** enrutar a DLQ tras agotar reintentos (nack sin requeue)

## Failure Modes
| Código | Descripción | Acción |
|--------|-------------|--------|
| `E_AUTO_ACK` | noAck: true — mensajes perdidos en crash | Cambiar a manual ack |
| `E_INFINITE_RETRY` | Sin límite de reintentos | Implementar contador x-retry-count |
