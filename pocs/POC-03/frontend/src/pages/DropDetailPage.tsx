import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Hash, Trash2, Share2, Upload, FileText, Check } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { api, Drop, FileRecord } from '../api';

function formatBytes(bytes: string) {
  const n = Number(bytes);
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function DropDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [drop, setDrop] = useState<Drop | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const loadFiles = useCallback(() => {
    if (id && token) api.listFiles(id, token).then(setFiles).catch(console.error);
  }, [id, token]);

  useEffect(() => {
    if (!id || !token) return;
    api.getDrop(id, token).then(setDrop).catch(console.error);
    loadFiles();
  }, [id, token, loadFiles]);

  const handleUpload = async (file: File) => {
    if (!id || !token || !drop || drop.status !== 'OPEN') return;
    setUploading(true);
    try {
      const result = await api.uploadFile(id, file, token);
      setFiles((prev) => [result, ...prev]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al subir');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!token || !confirm('¿Eliminar este archivo?')) return;
    await api.deleteFile(fileId, token);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleShare = (url: string, fileId: string) => {
    navigator.clipboard.writeText(url);
    setCopied(fileId);
    setTimeout(() => setCopied(null), 2000);
  };

  const isDocente = user?.role === 'DOCENTE';
  const canUpload = !isDocente && drop?.status === 'OPEN';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <button onClick={() => navigate(isDocente ? '/docente' : '/estudiante')} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-gray-900">{drop?.name ?? '...'}</h1>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${drop?.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {drop?.status === 'OPEN' ? 'Abierto' : 'Cerrado'}
            </span>
            {isDocente && <span className="text-xs text-gray-400">Vista docente — todas las entregas</span>}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-4">
        {/* DropZone — solo estudiante con buzón abierto */}
        {canUpload && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f); }}
            className={`flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed transition-colors cursor-pointer
              ${dragging ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 bg-white hover:bg-gray-50'}
              ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
          >
            {uploading ? (
              <>
                <Upload className="w-10 h-10 text-emerald-500 animate-bounce" />
                <p className="text-gray-600 text-sm">Subiendo a MinIO + generando SHA-256...</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-300" />
                <p className="text-gray-500 text-sm">Arrastra tu archivo aquí o</p>
                <label className="cursor-pointer bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-emerald-700">
                  Seleccionar archivo
                  <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                </label>
              </>
            )}
          </div>
        )}

        {/* Lista de archivos */}
        <div className="space-y-2">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
            {isDocente ? `Entregas recibidas (${files.length})` : `Mis entregas (${files.length})`}
          </h2>

          {files.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              {isDocente ? 'Ningún estudiante ha entregado aún.' : 'Aún no has realizado ninguna entrega.'}
            </p>
          )}

          {files.map((file) => (
            <div key={file.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{file.filename}</p>
                    <p className="text-xs text-gray-400">
                      {formatBytes(file.sizeBytes)} · {new Date(file.uploadedAt).toLocaleString('es-BO')}
                      {isDocente && file.uploader && ` · por ${file.uploader.name}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2 shrink-0">
                  <button
                    onClick={() => handleShare(file.publicUrl, file.id)}
                    title="Copiar enlace"
                    className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg"
                  >
                    {copied === file.id ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  {(isDocente || file.uploadedAt) && (
                    <button onClick={() => handleDelete(file.id)} title="Eliminar" className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Hash SHA-256 */}
              <div className="flex items-start gap-2 bg-blue-50 rounded-lg px-3 py-2">
                <Hash className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <code className="text-xs font-mono text-blue-700 break-all">{file.sha256Hash}</code>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
