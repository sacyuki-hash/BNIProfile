import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import { generateQrDataUrl } from '../utils/qrcode.ts';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  memberName: string;
  companyName: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  url,
  memberName,
  companyName,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && url) {
      generateQrDataUrl(url).then(setQrCodeUrl);
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${memberName} (${companyName}) - BNI スマートプロフィール`,
          text: `${memberName} 様のスマホ最適化プロフィール・1to1シートです。`,
          url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(
    `${memberName} 様のスマホ最適化プロフィール・1to1シートです。`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="閉じる"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-1">
          Smart Profile QR
        </span>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {memberName}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          {companyName}
        </p>

        {/* QR Code Container */}
        <div className="p-3 bg-white rounded-2xl shadow-inner border border-slate-100 mb-4 flex items-center justify-center">
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="Profile QR Code"
              className="w-48 h-48 object-contain"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
              QRコード生成中...
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
          スマホのカメラでスキャンすると、最適化されたプロフィールと1to1シートを直接開けます。
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <button
            onClick={handleCopy}
            className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>URLをコピーしました！</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>プロフィールURLをコピー</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={lineShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>LINEで送る</span>
            </a>

            <button
              onClick={handleNativeShare}
              className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>端末で共有</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
