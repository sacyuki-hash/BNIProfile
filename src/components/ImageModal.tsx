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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-[#130f1b] border border-[#3b2d47] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#291e32] bg-[#0c0912]/80">
          <span className="text-xs font-mono tracking-wider text-[#f4addb] truncate uppercase">
            {title}
          </span>
          <div className="flex items-center gap-2">
            <a
              href={proxiedUrl}
              download={`${title}.jpg`}
              className="p-2 text-[#9a89a0] hover:text-white rounded-lg hover:bg-[#20182b] transition-colors"
              title="画像をダウンロード"
            >
              <Download className="w-4 h-4" />
            </a>
            <a
              href={proxiedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#9a89a0] hover:text-white rounded-lg hover:bg-[#20182b] transition-colors"
              title="別タブで開く"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-[#9a89a0] hover:text-white rounded-lg hover:bg-[#20182b] transition-colors"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Content */}
        <div className="p-4 flex items-center justify-center overflow-auto flex-1 bg-black/60">
          <img
            src={proxiedUrl}
            alt={title}
            className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = imageUrl;
            }}
          />
        </div>
      </div>
    </div>
  );
};
