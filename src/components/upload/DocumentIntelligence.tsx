import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Image, Upload, Loader2, CheckCircle2, ArrowRight, X, Download } from 'lucide-react';
import { extractDocumentData, hasApiKey } from '../../lib/claudeApi';

type DocType = 'invoice' | 'purchase_order' | 'vendor_statement' | 'work_order' | 'unknown';

interface ProcessedDoc {
  fileName: string;
  fileSize: string;
  docType: DocType;
  result: {
    documentType: string;
    extractedFields: Record<string, string>;
    summary: string;
    routeTo: 'MAI' | 'NATALIA' | 'BOTH';
    actionItems: string[];
  };
  processedAt: Date;
}

const docTypeLabels: Record<DocType, string> = {
  invoice: 'Invoice',
  purchase_order: 'Purchase Order',
  vendor_statement: 'Vendor Statement',
  work_order: 'Work Order',
  unknown: 'Auto-detect',
};

const routeColors = {
  MAI: 'bg-mai-accent/10 text-mai-accent border-mai-accent/30',
  NATALIA: 'bg-natalia-accent/10 text-natalia-accent border-natalia-accent/30',
  BOTH: 'bg-accent-blue-light text-accent-blue border-accent-blue/30',
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DocumentIntelligence: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocType>('unknown');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedDoc['result'] | null>(null);
  const [history, setHistory] = useState<ProcessedDoc[]>([]);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setResult(null);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  const processDocument = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      let fileBase64 = '';
      const mediaType = selectedFile.type || 'application/octet-stream';

      if (selectedFile.type.startsWith('image/')) {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        fileBase64 = btoa(binary);
      }

      const extracted = await extractDocumentData({
        fileBase64,
        mediaType,
        documentType: docType,
      });

      setResult(extracted);
      setHistory(prev => [{
        fileName: selectedFile.name,
        fileSize: formatFileSize(selectedFile.size),
        docType,
        result: extracted,
        processedAt: new Date(),
      }, ...prev.slice(0, 4)]);
    } catch (err) {
      if (!hasApiKey()) {
        // Mock result for demo
        const mockResult = {
          documentType: docType === 'unknown' ? 'invoice' : docType,
          extractedFields: {
            'vendor/client': 'Ecolab Inc.',
            'amount': '$12,400.00',
            'date': 'March 15, 2026',
            'reference': 'INV-ECO-2026-0341',
            'terms': 'Net 30',
            'line_items': 'Janitorial supplies, cleaning chemicals (18 items)',
            'po_number': 'PO-SMM-9821',
            'notes': 'Monthly supply contract',
          },
          summary: 'Monthly vendor invoice from Ecolab for janitorial supplies totaling $12,400.',
          routeTo: 'NATALIA' as const,
          actionItems: [
            'Match against PO-SMM-9821 for approval',
            'Add to weekly AP batch B-2026-13',
            'Verify against Ecolab vendor statement',
          ],
        };
        setResult(mockResult);
        setHistory(prev => [{
          fileName: selectedFile.name,
          fileSize: formatFileSize(selectedFile.size),
          docType,
          result: mockResult,
          processedAt: new Date(),
        }, ...prev.slice(0, 4)]);
      } else {
        setError('Failed to process document. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const fileIcon = selectedFile?.type.startsWith('image/') ? Image : FileText;
  const FileIcon = fileIcon;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Document Intelligence Center</h1>
          <p className="text-sm text-text-muted mt-0.5">AI-powered document extraction and routing</p>
        </div>
        {!hasApiKey() && (
          <div className="bg-accent-amber-light text-accent-amber text-xs px-3 py-1.5 rounded-full font-medium">
            Demo mode — Add API key for real AI extraction
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Upload zone */}
        <div className="col-span-2 space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-accent-blue bg-accent-blue-light' : 'border-border-base hover:border-accent-blue/50 hover:bg-bg-secondary'}`}
          >
            <input {...getInputProps()} />
            <Upload size={32} className={`mx-auto mb-3 ${isDragActive ? 'text-accent-blue' : 'text-text-muted'}`} />
            {isDragActive ? (
              <p className="text-accent-blue font-medium">Drop it here...</p>
            ) : (
              <>
                <p className="text-sm font-medium text-text-primary">Drag & drop a document here</p>
                <p className="text-xs text-text-muted mt-1">or click to browse — PDF, JPG, PNG, CSV, XLSX</p>
              </>
            )}
          </div>

          {/* File preview */}
          {selectedFile && !result && (
            <div className="bg-bg-card border border-border-base rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent-blue-light rounded-lg flex items-center justify-center">
                  <FileIcon size={20} className="text-accent-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{selectedFile.name}</p>
                  <p className="text-xs text-text-muted">{formatFileSize(selectedFile.size)} · {selectedFile.type || 'Unknown type'}</p>
                </div>
                <button onClick={() => setSelectedFile(null)} className="text-text-muted hover:text-text-primary">
                  <X size={16} />
                </button>
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-text-secondary block mb-2">Document Type</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(docTypeLabels) as DocType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setDocType(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${docType === t ? 'bg-accent-blue text-white' : 'bg-bg-secondary text-text-secondary hover:bg-accent-blue-light hover:text-accent-blue'}`}
                    >
                      {docTypeLabels[t]}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-xs text-accent-red mb-3">{error}</p>}

              <button
                onClick={processDocument}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-lg bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    AI is analyzing your document...
                  </>
                ) : (
                  <>
                    <Upload size={15} />
                    Process with AI
                  </>
                )}
              </button>
            </div>
          )}

          {/* Results */}
          {result && selectedFile && (
            <div className="bg-bg-card border border-accent-blue/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-accent-green" />
                  <span className="text-sm font-semibold text-text-primary">Extraction Complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${routeColors[result.routeTo]}`}>
                    Route to: {result.routeTo}
                  </span>
                </div>
              </div>

              <p className="text-xs text-text-secondary bg-bg-secondary rounded-lg p-3">{result.summary}</p>

              {/* Extracted fields */}
              <div>
                <p className="text-xs font-semibold text-text-secondary mb-2">Extracted Fields</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(result.extractedFields).map(([key, value]) => (
                    <div key={key} className="bg-bg-secondary rounded-lg p-2.5">
                      <p className="text-[10px] text-text-muted uppercase tracking-wide font-medium">{key.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-text-primary font-medium mt-0.5 truncate">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action items */}
              <div>
                <p className="text-xs font-semibold text-text-secondary mb-2">Recommended Actions</p>
                <div className="space-y-2">
                  {result.actionItems.map((action, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                      <ArrowRight size={11} className="text-accent-blue flex-shrink-0" />
                      {action}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setSelectedFile(null); setResult(null); }}
                  className="flex-1 py-2 rounded-lg border border-border-base text-sm text-text-secondary hover:bg-bg-secondary transition-colors"
                >
                  Process Another
                </button>
                <button className="flex-1 py-2 rounded-lg bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue/90 transition-colors flex items-center justify-center gap-2">
                  <Download size={14} /> Import to Platform
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History */}
        <div>
          <h2 className="text-sm font-semibold text-text-primary mb-3">Recent Documents</h2>
          {history.length === 0 ? (
            <div className="bg-bg-secondary rounded-xl p-6 text-center text-text-muted text-xs">
              Processed documents will appear here
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((doc, i) => (
                <div key={i} className="bg-bg-card border border-border-base rounded-xl p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <FileText size={14} className="text-text-muted flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-primary truncate">{doc.fileName}</p>
                      <p className="text-[10px] text-text-muted">{doc.fileSize}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-text-secondary">{doc.result.summary}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${routeColors[doc.result.routeTo]}`}>
                      {doc.result.routeTo}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {doc.processedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentIntelligence;
