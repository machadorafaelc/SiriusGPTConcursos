import React, { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { ragService, type Document } from "../services/ragService";

interface PDFUploadProps {
  disciplina: string;
  onUploadComplete?: (documents: Document[]) => void;
}

export function PDFUpload({ disciplina, onUploadComplete }: PDFUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Document[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    setPendingFiles(prev => [...prev, ...arr]);
  };

  const handleUploadAll = async () => {
    if (pendingFiles.length === 0) return;
    setIsUploading(true);
    try {
      const allDocs: Document[] = [];
      for (const file of pendingFiles) {
        const docs = await ragService.uploadFile(file, disciplina);
        allDocs.push(...docs);
      }
      setUploadedFiles(prev => [...prev, ...allDocs]);
      onUploadComplete?.(allDocs);
      setPendingFiles([]);
    } catch (error) {
      console.error("Erro ao enviar arquivos:", error);
      alert("Erro ao processar os arquivos. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  const removeDocument = (id: string) => {
    ragService.deleteDocument(id);
    setUploadedFiles(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Área de Upload */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-white/20 hover:border-white/40"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,text/plain"
          multiple
          onChange={(e) => handleAddFiles(e.target.files)}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-2">
          <Upload className="w-8 h-8 text-white/60" />
          <div className="text-white/80">
            <p className="font-medium">Arraste um PDF/TXT aqui ou clique para selecionar</p>
            <p className="text-sm text-white/60">
              Arquivos serão processados para {disciplina}
            </p>
          </div>
          
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isUploading ? "Aguardando..." : "Selecionar Arquivos"}
            </button>
            <button
              onClick={handleUploadAll}
              disabled={isUploading || pendingFiles.length === 0}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {isUploading ? "Enviando..." : `Enviar todos (${pendingFiles.length})`}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Arquivos Pendentes */}
      {pendingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">Arquivos pendentes:</h4>
          {pendingFiles.map((f, i) => (
            <div key={`${f.name}-${i}`} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-300" />
                <div>
                  <p className="text-sm font-medium text-white">{f.name}</p>
                  <p className="text-xs text-white/60">{(f.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                onClick={() => setPendingFiles(prev => prev.filter((_, idx) => idx !== i))}
                className="p-1 text-white/60 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lista de Arquivos Enviados */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">
            Documentos processados:
          </h4>
          {uploadedFiles.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {doc.title}
                  </p>
                  <p className="text-xs text-white/60">
                    Página {doc.page} • {doc.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              
              <button
                onClick={() => removeDocument(doc.id)}
                className="p-1 text-white/60 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
