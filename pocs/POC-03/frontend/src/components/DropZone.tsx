import React, { useCallback, useState } from 'react';
import { Upload, FileUp } from 'lucide-react';

interface Props {
  onResult: (result: UploadResult) => void;
}

export interface UploadResult {
  id: string;
  filename: string;
  sizeBytes: string;
  mimeType: string;
  sha256Hash: string;
  status: string;
  publicUrl: string;
  uploadedAt: string;
}

export function DropZone({ onResult }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message ?? 'Error en el servidor');
        }

        const result: UploadResult = await res.json();
        onResult(result);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setUploading(false);
      }
    },
    [onResult],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`
        flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border-2 border-dashed
        transition-colors cursor-pointer
        ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
        ${uploading ? 'opacity-60 pointer-events-none' : ''}
      `}
    >
      {uploading ? (
        <>
          <Upload className="w-12 h-12 text-blue-500 animate-bounce" />
          <p className="text-gray-600 font-medium">Subiendo a MinIO + calculando SHA-256...</p>
        </>
      ) : (
        <>
          <FileUp className="w-12 h-12 text-gray-400" />
          <p className="text-gray-600 font-medium">Arrastra un archivo aquí</p>
          <p className="text-gray-400 text-sm">o</p>
          <label className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Seleccionar archivo
            <input
              type="file"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </label>
        </>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
