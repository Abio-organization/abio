import { QRCodeCanvas } from "qrcode.react";
import { Copy, QrCode, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { toast } from "@/shared/lib/toast";

interface SharePanelProps {
  username: string | null;
}

export function SharePanel({ username }: SharePanelProps) {
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const profileLink = username ? `${window.location.origin}/${username}` : null;

  const handleCopy = async () => {
    if (!profileLink) return;
    try {
      await navigator.clipboard.writeText(profileLink);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (!profileLink) return;
    
    // Always open the custom dialog
    setIsShareOpen(true);
  };

  const handleDownloadQr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `abio-qr-${username}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const openShareUrl = (url: string) =>
    window.open(url, "_blank", "noopener,noreferrer");

  return (
    <>
      <div className="flex w-full min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => setIsQrOpen(true)}
          disabled={!profileLink}
          className="flex h-11 w-11 items-center justify-center border border-[#331400]/15 text-[#331400] hover:bg-[#331400]/5 disabled:opacity-40 dark:border-[#F5EEE4]/15 dark:text-[#F5EEE4]"
        >
          <QrCode className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!profileLink}
          className="flex h-11 w-11 items-center justify-center border border-[#331400]/15 text-[#331400] hover:bg-[#331400]/5 disabled:opacity-40 dark:border-[#F5EEE4]/15 dark:text-[#F5EEE4]"
        >
          <Copy className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={!profileLink}
          className="flex h-11 w-11 items-center justify-center border border-[#331400]/15 text-[#331400] hover:bg-[#331400]/5 disabled:opacity-40 dark:border-[#F5EEE4]/15 dark:text-[#F5EEE4]"
        >
          <Share2 className="h-5 w-5" />
        </button>
        {profileLink && (
          <span
            className="min-w-0 flex-1 truncate text-sm cursor-pointer"
            onClick={() => window.open(profileLink, "_blank")}
          >
            <span className="text-red-500">{window.location.origin}</span>
            <span className="text-[#666464] dark:text-[#F5EEE4]/50">
              /{username}
            </span>
          </span>
        )}
      </div>

      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent>
          <DialogHeader className="text-center">
            <DialogTitle>Here is your code!!!</DialogTitle>
            <DialogDescription>
              This is your unique code for another person to scan
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            {profileLink && (
              <QRCodeCanvas
                ref={canvasRef}
                value={profileLink}
                size={150}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            )}
            <Button
              onClick={handleDownloadQr}
              className="shadow-[4px_4px_0px_0px_#000000] w-full h-10 bg-[#FED45C] text-[#331400] hover:bg-[#FED45C]/90"
            >
              Download PNG
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="p-0 overflow-hidden sm:max-w-md">
          <div className="w-full">
            <div className="p-6 border-b border-gray-100 dark:border-[#F5EEE4]/10">
              <DialogHeader className="text-center px-10">
                <DialogTitle className="text-2xl font-bold mb-2 text-gray-900 dark:text-[#F5EEE4]">
                  Share Your Profile
                </DialogTitle>

                <DialogDescription className="text-sm text-gray-500 dark:text-[#F5EEE4]/60">
                  Abio is more effective when you connect with friends!
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 dark:text-[#F5EEE4]/80 mb-2">
                  Share your link
                </p>

                <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#F5EEE4]/5 border border-gray-200 dark:border-[#F5EEE4]/10 p-3">
                  <input
                    readOnly
                    value={profileLink || ""}
                    className="bg-transparent w-full text-sm text-gray-800 dark:text-[#F5EEE4] outline-none truncate"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      profileLink && navigator.clipboard.writeText(profileLink)
                    }
                    className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-[#F5EEE4]/10 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-[#331400] dark:text-[#F5EEE4]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm font-medium text-gray-700 dark:text-[#F5EEE4]/80 mb-4">
                Share to
              </p>

              <div className="grid grid-cols-5 gap-6">
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={() =>
                    profileLink &&
                    openShareUrl(
                      `https://wa.me/?text=${encodeURIComponent(profileLink)}`,
                    )
                  }
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaWhatsapp className="w-5 h-5 text-green-600" />
                  </div>

                  <span className="text-xs font-medium text-gray-600 dark:text-[#F5EEE4]/70">
                    WhatsApp
                  </span>
                </button>

                {/* X */}
                <button
                  type="button"
                  onClick={() =>
                    profileLink &&
                    openShareUrl(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        profileLink,
                      )}`,
                    )
                  }
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 bg-gray-100 dark:bg-[#F5EEE4]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaXTwitter className="w-5 h-5 text-black dark:text-[#F5EEE4]" />
                  </div>

                  <span className="text-xs font-medium text-gray-600 dark:text-[#F5EEE4]/70">
                    X
                  </span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() =>
                    profileLink &&
                    openShareUrl(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        profileLink,
                      )}`,
                    )
                  }
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaFacebook className="w-5 h-5 text-blue-600" />
                  </div>

                  <span className="text-xs font-medium text-gray-600 dark:text-[#F5EEE4]/70">
                    Facebook
                  </span>
                </button>
                {/* instagram */}
                <button
                  type="button"
                  onClick={() =>
                    profileLink &&
                    openShareUrl(
                      `https://www.instagram.com/sharer.php?u=${encodeURIComponent(
                        profileLink,
                      )}`,
                    )
                  }
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 bg-pink-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaInstagram className="w-5 h-5 text-pink-600" />
                  </div>

                  <span className="text-xs font-medium text-gray-600 dark:text-[#F5EEE4]/70">
                    Instagram
                  </span>
                </button>
                {/* pinterest */}
                <button
                  type="button"
                  onClick={() =>
                    profileLink &&
                    openShareUrl(
                      `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
                        profileLink,
                      )}`,
                    )
                  }
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaPinterest className="w-5 h-5 text-red-600" />
                  </div>

                  <span className="text-xs font-medium text-gray-600 dark:text-[#F5EEE4]/70">
                    Pinterest
                  </span>
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}