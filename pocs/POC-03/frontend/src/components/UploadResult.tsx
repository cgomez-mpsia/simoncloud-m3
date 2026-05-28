import { CheckCircle, Hash, HardDrive, FileText, ExternalLink } from 'lucide-react';
import type { UploadResult } from './DropZone';

interface Props {
  result: UploadResult;
  onReset: () => void;
}

function formatBytes(bytes: string): string {
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function UploadResult({ result, onReset }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-green-50 border-b border-green-100 px-6 py-4 flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
        <div>
          <p className="font-semibold text-green-800">Entrega registrada en SimonDrop</p>
          <p className="text-xs text-green-600">
            PostgreSQL + MinIO + RabbitMQ (Outbox Pattern)
          </p>
        </div>
      </div>

      {/* Datos */}
      <div className="p-6 space-y-4">
        <Row icon={<FileText className="w-4 h-4 text-gray-400" />} label="Archivo">
          <span className="font-medium text-gray-800">{result.filename}</span>
          <span className="text-gray-400 text-sm ml-2">({formatBytes(result.sizeBytes)})</span>
        </Row>

        <Row icon={<Hash className="w-4 h-4 text-blue-500" />} label="SHA-256">
          <code className="text-xs font-mono break-all bg-blue-50 text-blue-800 px-2 py-1 rounded">
            {result.sha256Hash}
          </code>
        </Row>

        <Row icon={<HardDrive className="w-4 h-4 text-purple-500" />} label="MinIO">
          <a
            href={result.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:underline text-sm flex items-center gap-1"
          >
            Ver objeto <ExternalLink className="w-3 h-3" />
          </a>
        </Row>

        {/* Pipeline de tecnologías */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Pipeline ejecutado</p>
          <div className="flex flex-wrap gap-2">
            {['React + Vite', 'NestJS', 'Hexagonal', 'Prisma', 'PostgreSQL', 'MinIO', 'SHA-256', 'RabbitMQ (Outbox)'].map((t) => (
              <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={onReset}
          className="w-full border border-gray-300 text-gray-600 rounded-lg py-2 hover:bg-gray-50 transition-colors text-sm"
        >
          Subir otro archivo
        </button>
      </div>
    </div>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <div>{children}</div>
      </div>
    </div>
  );
}
