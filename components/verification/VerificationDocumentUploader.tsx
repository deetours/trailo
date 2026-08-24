'use client';

import { useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import type { BusinessEntityType, VerificationDocumentType } from '@/types/business';

export interface PendingDocument {
  type: VerificationDocumentType;
  fileName: string;
}

const DOC_LABELS: Record<VerificationDocumentType, string> = {
  pan: 'PAN Card',
  aadhaar: 'Aadhaar Card',
  'entity-registration': 'Entity Registration Certificate',
  'address-proof': 'Address Proof',
  other: 'Other Document',
};

function requiredDocsFor(entityType?: BusinessEntityType): VerificationDocumentType[] {
  if (entityType === 'sole-proprietorship') return ['pan', 'aadhaar'];
  if (entityType) return ['pan', 'entity-registration'];
  return ['pan'];
}

export default function VerificationDocumentUploader({
  entityType,
  documents,
  onChange,
}: {
  entityType?: BusinessEntityType;
  documents: PendingDocument[];
  onChange: (docs: PendingDocument[]) => void;
}) {
  const [pendingType, setPendingType] = useState<VerificationDocumentType>('pan');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const required = requiredDocsFor(entityType);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange([...documents, { type: pendingType, fileName: file.name }]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeDoc = (index: number) => {
    onChange(documents.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {required.map(type => {
          const satisfied = documents.some(d => d.type === type);
          return (
            <span
              key={type}
              className={`text-xs font-medium px-2.5 py-1 rounded-full border ${satisfied ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-muted text-muted-foreground border-border'}`}
            >
              {satisfied ? '✓ ' : ''}{DOC_LABELS[type]}
            </span>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={pendingType}
          onChange={(e) => setPendingType(e.target.value as VerificationDocumentType)}
          className="bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
        >
          {(Object.keys(DOC_LABELS) as VerificationDocumentType[]).map(type => (
            <option key={type} value={type}>{DOC_LABELS[type]}</option>
          ))}
        </select>
        <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg px-4 py-2 text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors cursor-pointer text-sm">
          <Upload size={16} />
          Choose file
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFile} />
        </label>
      </div>

      {documents.length > 0 && (
        <ul className="space-y-2">
          {documents.map((doc, index) => (
            <li key={`${doc.type}-${doc.fileName}-${index}`} className="flex items-center justify-between gap-3 bg-background border border-border rounded-lg px-4 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={16} className="text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground truncate">{doc.fileName}</span>
                <span className="text-xs text-muted-foreground shrink-0">— {DOC_LABELS[doc.type]}</span>
              </div>
              <button type="button" onClick={() => removeDoc(index)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0" aria-label="Remove document">
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
