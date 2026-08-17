import { QRCodeCanvas } from 'qrcode.react'
import { Copy, QrCode, Share2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { FaFacebook, FaWhatsapp, FaXTwitter } from 'react-icons/fa6'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { toast } from '@/shared/lib/toast'

interface SharePanelProps {
  username: string | null
}

export function SharePanel({ username }: SharePanelProps) {
  const [isQrOpen, setIsQrOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const profileLink = username ? `${window.location.origin}/${username}` : null

  const handleCopy = async () => {
    if (!profileLink) return
    try {
      await navigator.clipboard.writeText(profileLink)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleShare = async () => {
    if (!profileLink) return
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Abio profile', url: profileLink })
      } catch {
        // user cancelled — no toast needed
      }
      return
    }
    setIsShareOpen(true)
  }

  const handleDownloadQr = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `abio-qr-${username}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const openShareUrl = (url: string) => window.open(url, '_blank', 'noopener,noreferrer')

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
        {profileLink && <span className="min-w-0 flex-1 truncate text-sm text-[#666464] dark:text-[#F5EEE4]/50">{profileLink}</span>}
      </div>

      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your QR code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            {profileLink && <QRCodeCanvas ref={canvasRef} value={profileLink} size={200} level="H" bgColor="#ffffff" fgColor="#000000" />}
            <Button onClick={handleDownloadQr} className="w-full bg-[#FED45C] text-[#331400] hover:bg-[#FED45C]/90">
              Download PNG
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share your profile</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 py-2">
            <button
              type="button"
              onClick={() => profileLink && openShareUrl(`https://wa.me/?text=${encodeURIComponent(profileLink)}`)}
              className="flex h-14 items-center justify-center border border-[#331400]/15 hover:bg-[#331400]/5 dark:border-[#F5EEE4]/15"
            >
              <FaWhatsapp className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                profileLink &&
                openShareUrl(`https://twitter.com/intent/tweet?url=${encodeURIComponent(profileLink)}`)
              }
              className="flex h-14 items-center justify-center border border-[#331400]/15 hover:bg-[#331400]/5 dark:border-[#F5EEE4]/15"
            >
              <FaXTwitter className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                profileLink &&
                openShareUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileLink)}`)
              }
              className="flex h-14 items-center justify-center border border-[#331400]/15 hover:bg-[#331400]/5 dark:border-[#F5EEE4]/15"
            >
              <FaFacebook className="h-5 w-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
