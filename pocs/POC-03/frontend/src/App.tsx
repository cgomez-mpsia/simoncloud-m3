import { useState } from 'react';
import { DropZone, type UploadResult } from './components/DropZone';
import { UploadResult as UploadResultView } from './components/UploadResult';

export default function App() {
  const [result, setResult] = useState<UploadResult | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">SimonDrop</h1>
          <p className="text-gray-500 text-sm mt-1">
            POC-03 — NestJS · Prisma · PostgreSQL · MinIO · RabbitMQ
          </p>
        </div>

        {/* Main card */}
        {result ? (
          <UploadResultView result={result} onReset={() => setResult(null)} />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-4">
              Entrega un archivo al buzón. El backend calcula el SHA-256 y registra el evento
              en RabbitMQ vía Outbox Pattern (transacción atómica PostgreSQL).
            </p>
            <DropZone onResult={setResult} />
          </div>
        )}
      </div>
    </div>
  );
}
