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
          title: `${memberName} (${companyName}) - BNI スマホプロフィール`,
          text: `${memberName} 様のスマホ最適化プロフィール・1to1シートです。`,
          url,
        });
      } catch {
        // User cancelled
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full bg-[#130f1a] border border-[#3b2d47] rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center text-[#f5eff5]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#9a89a0] hover:text-white rounded-full hover:bg-[#251b30] transition-colors"
          aria-label="閉じる"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[10px] font-mono tracking-widest text-[#f4addb] uppercase mb-1">
          SMART PROFILE QR
        </span>
        <h3 className="text-xl font-black text-white">
          {memberName}
        </h3>
        <p className="text-xs text-[#b39fb9] mb-4">
          {companyName}
        </p>

        {/* QR Code Container */}
        <div className="p-3 bg-white rounded-2xl shadow-xl border border-white/20 mb-4 flex items-center justify-center">
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="Profile QR Code"
              className="w-48 h-48 object-contain"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-slate-500 text-xs font-mono">
              QRコード生成中...
            </div>
          )}
        </div>

        <p className="text-xs text-[#9a89a0] mb-5 leading-relaxed">
          スマホのカメラでかざすと、このプロフィールと1to1シートを直接開けます。
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <button
            onClick={handleCopy}
            className="w-full h-11 rounded-xl bg-white hover:bg-slate-200 text-[#17121b] font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>共有URLをコピーしました ✳</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#17121b]" />
                <span>プロフィールURLをコピー</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={lineShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>LINEで送る</span>
            </a>

            <button
              onClick={handleNativeShare}
              className="h-10 rounded-xl bg-[#231a2e] hover:bg-[#312340] text-[#f5eff5] border border-[#443254] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4 text-[#f4addb]" />
              <span>端末で共有</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
