import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
}) => {
  if (!isOpen || !imageUrl) return null;

  const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60">
          <span className="text-sm font-medium text-slate-200 truncate">{title}</span>
          <div className="flex items-center gap-2">
            <a
              href={proxiedUrl}
              download={`${title}.jpg`}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="画像をダウンロード"
            >
              <Download className="w-4 h-4" />
            </a>
            <a
              href={proxiedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="別タブで開く"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Content */}
        <div className="p-4 flex items-center justify-center overflow-auto flex-1 bg-black/40">
          <img
            src={proxiedUrl}
            alt={title}
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-md"
            onError={(e) => {
              // Fallback directly to original URL if proxy fails
              (e.target as HTMLImageElement).src = imageUrl;
            }}
          />
        </div>
      </div>
    </div>
  );
};
