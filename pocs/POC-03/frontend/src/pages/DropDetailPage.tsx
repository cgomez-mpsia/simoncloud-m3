import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Hash, Trash2, Share2, Upload, FileText, Check, FolderOpen, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { api, Drop, FileRecord } from '../api';
import AppHeader from '../components/AppHeader';
import { FileCardSkeleton } from '../components/Skeleton';
import { formatRelative, formatBytes } from '../utils/format';

function groupByFolder(files: FileRecord[]): Map<string, FileRecord[]> {
  const map = new Map<string, FileRecord[]>();
  for (const f of files) {
    const parts = f.filePath?.split('/') ?? [];
    const group = parts.length > 1 ? parts[0] : '';
    const key = group || '__root__';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(f);
  }
  return new Map([...map.entries()].sort((a, b) => {
    if (a[0] === '__root__') return 1;
    if (b[0] === '__root__') return -1;
    return a[0].localeCompare(b[0]);
  }));
}

interface UploadProgress { name: string; done: boolean; error?: string; }

export default function DropDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [drop, setDrop] = useState<Drop | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loadingDrop, setLoadingDrop] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const isDocente = user?.role === 'DOCENTE';
  const backRoute = isDocente ? '/docente' : '/estudiante';

  const loadFiles = useCallback(() => {
    if (!id || !token) return;
    api.listFiles(id, token)
      .then(data => {
        setFiles(data);
        setExpandedFolders(new Set(groupByFolder(data).keys()));
      })
      .catch(console.error)
      .finally(() => setLoadingFiles(false));
  }, [id, token]);

  useEffect(() => {
    if (!id || !token) return;
    api.getDrop(id, token)
      .then(setDrop)
      .catch(console.error)
      .finally(() => setLoadingDrop(false));
    loadFiles();
  }, [id, token, loadFiles]);

  const uploadSingle = async (file: File, filePath?: string) => {
    if (!id || !token) return null;
    return api.uploadFile(id, file, token, filePath);
  };

  const handleUpload = async (file: File) => {
    if (!drop || drop.status !== 'OPEN') return;
    setUploading(true);
    setProgress([{ name: file.name, done: false }]);
    try {
      const result = await uploadSingle(file);
      if (result) setFiles((prev) => [result, ...prev]);
      setProgress([{ name: file.name, done: true }]);
    } catch (err) {
      setProgress([{ name: file.name, done: false, error: err instanceof Error ? err.message : 'Error' }]);
    } finally {
      setTimeout(() => { setUploading(false); setProgress([]); }, 1800);
    }
  };

  const handleFolderUpload = async (fileList: FileList) => {
    if (!drop || drop.status !== 'OPEN') return;
    const items = Array.from(fileList);
    if (items.length === 0) return;
    setUploading(true);
    setProgress(items.map(f => ({ name: f.webkitRelativePath || f.name, done: false })));
    const results: FileRecord[] = [];
    for (let i = 0; i < items.length; i++) {
      const f = items[i];
      const filePath = f.webkitRelativePath || f.name;
      try {
        const result = await uploadSingle(f, filePath);
        if (result) results.push(result);
        setProgress(prev => prev.map((p, idx) => idx === i ? { ...p, done: true } : p));
      } catch {
        setProgress(prev => prev.map((p, idx) => idx === i ? { ...p, done: true, error: 'Error' } : p));
      }
    }
    setFiles(prev => [...results, ...prev]);
    setExpandedFolders(new Set(groupByFolder([...results, ...files]).keys()));
    setTimeout(() => { setUploading(false); setProgress([]); }, 1800);
  };

  const handleDelete = async (fileId: string) => {
    if (!token) return;
    setConfirmDelete(null);
    await api.deleteFile(fileId, token);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleShare = (url: string, fileId: string) => {
    navigator.clipboard.writeText(url);
    setCopied(fileId);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleFolder = (key: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const canUpload = !isDocente && drop?.status === 'OPEN';
  const grouped = groupByFolder(files);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        title={loadingDrop ? '...' : (drop?.name ?? 'SimonDrop')}
        subtitle={isDocente ? 'Vista docente — todas las entregas' : 'Portal de estudiante'}
        back={backRoute}
        backLabel="Volver al dashboard"
      />

      {/* Barra de info del drop */}
      {!loadingDrop && drop && (
        <div className="bg-white border-b border-gray-100 px-6 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-3 flex-wrap">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              drop.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {drop.status === 'OPEN' ? 'Abierto' : 'Cerrado'}
            </span>
            {drop.description && (
              <span className="text-sm text-gray-500">{drop.description}</span>
            )}
            <span className="text-xs text-gray-400 ml-auto">{formatRelative(drop.createdAt)}</span>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto p-6 space-y-4">

        {/* DropZone — solo estudiante con buzón abierto */}
        {canUpload && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f); }}
            className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-colors
              ${dragging ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 bg-white hover:bg-gray-50'}
              ${uploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            {uploading ? (
              <div className="w-full space-y-2 max-h-52 overflow-y-auto px-2">
                <p className="text-sm text-gray-500 text-center">Subiendo a MinIO + generando SHA-256...</p>
                {progress.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className={`shrink-0 w-2.5 h-2.5 rounded-full ${
                      p.error ? 'bg-red-400' : p.done ? 'bg-emerald-400' : 'bg-gray-300 animate-pulse'
                    }`} />
                    <span className="truncate text-gray-600 font-mono flex-1">{p.name}</span>
                    {p.error && <span className="text-red-400 shrink-0">{p.error}</span>}
                    {p.done && !p.error && <Check className="w-3 h-3 text-emerald-500 shrink-0" />}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-300" />
                <p className="text-gray-500 text-sm">Arrastra un archivo aquí o</p>
                <div className="flex gap-2">
                  <label className="cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                    Seleccionar archivo
                    <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                  </label>
                  <button
                    onClick={() => folderInputRef.current?.click()}
                    className="flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                  >
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                    Subir carpeta
                  </button>
                  <input
                    ref={folderInputRef}
                    type="file"
                    className="hidden"
                    // @ts-expect-error webkitdirectory no está en los tipos estándar
                    webkitdirectory=""
                    multiple
                    onChange={(e) => { if (e.target.files) handleFolderUpload(e.target.files); }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Buzón cerrado — aviso al estudiante */}
        {!isDocente && drop?.status !== 'OPEN' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-700 flex items-center gap-2">
            <span className="text-base">🔒</span>
            Este buzón está cerrado. Ya no se aceptan nuevas entregas.
          </div>
        )}

        {/* Lista de archivos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {isDocente ? `Entregas recibidas · ${files.length}` : `Mis entregas · ${files.length}`}
            </h2>
          </div>

          {/* Loading skeleton */}
          {loadingFiles && (
            <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden">
              {[1, 2].map(i => <FileCardSkeleton key={i} />)}
            </div>
          )}

          {/* Empty state */}
          {!loadingFiles && files.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                {isDocente ? 'Ningún estudiante ha entregado aún.' : 'Aún no has realizado ninguna entrega.'}
              </p>
            </div>
          )}

          {/* Archivos agrupados */}
          {!loadingFiles && [...grouped.entries()].map(([folderKey, folderFiles]) => {
            const isRoot = folderKey === '__root__';
            const isExpanded = expandedFolders.has(folderKey);

            return (
              <div key={folderKey} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                {/* Cabecera de carpeta */}
                {!isRoot && (
                  <button
                    onClick={() => toggleFolder(folderKey)}
                    className="w-full flex items-center gap-2 px-4 py-3 bg-amber-50 hover:bg-amber-100 border-b border-amber-100 text-left transition-colors"
                  >
                    <ChevronRight className={`w-4 h-4 text-amber-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                    <span className="font-medium text-amber-800 text-sm">{folderKey}</span>
                    <span className="ml-auto text-xs text-amber-600">
                      {folderFiles.length} archivo{folderFiles.length !== 1 ? 's' : ''}
                    </span>
                  </button>
                )}

                {(isRoot || isExpanded) && (
                  <div className="divide-y divide-gray-100">
                    {folderFiles.map((file) => {
                      const displayPath = !isRoot && file.filePath
                        ? file.filePath.substring(folderKey.length + 1)
                        : file.filename;

                      return (
                        <div key={file.id} className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium text-gray-800 truncate text-sm">{displayPath}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {formatBytes(file.sizeBytes)}
                                  <span className="mx-1 text-gray-300">·</span>
                                  {formatRelative(file.uploadedAt)}
                                  {isDocente && file.uploader && (
                                    <><span className="mx-1 text-gray-300">·</span>por {file.uploader.name}</>
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Acciones */}
                            {confirmDelete === file.id ? (
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-red-600 font-medium">¿Eliminar?</span>
                                <button
                                  onClick={() => handleDelete(file.id)}
                                  className="text-xs bg-red-600 text-white px-2.5 py-1 rounded-lg hover:bg-red-700"
                                >
                                  Sí
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="text-xs text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => handleShare(file.publicUrl, file.id)}
                                  title="Copiar enlace"
                                  className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  {copied === file.id
                                    ? <Check className="w-4 h-4 text-green-500" />
                                    : <Share2 className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(file.id)}
                                  title="Eliminar"
                                  className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* SHA-256 */}
                          <div className="flex items-start gap-2 bg-blue-50 rounded-xl px-3 py-2">
                            <Hash className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                            <code className="text-xs font-mono text-blue-700 break-all">{file.sha256Hash}</code>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
