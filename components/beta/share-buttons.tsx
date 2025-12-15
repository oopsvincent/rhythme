"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Twitter, 
  Linkedin, 
  Link2, 
  Check,
  Share2,
  MessageCircle
} from "lucide-react";

// Static URL for SSR - this ensures consistent hydration
const BETA_URL = "https://rhythme-gamma.vercel.app/beta";

interface ShareButtonsProps {
  title?: string;
  description?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ 
  title = "Join the Rhythmé Beta",
  description = "Finally know where to start. Rhythmé is your personal direction system."
}) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(BETA_URL);
  const [canShare, setCanShare] = useState(false);

  // Update URL on client side after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
      setCanShare('share' in navigator);
    }
  }, []);

  const shareText = `${title} - ${description}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled or failed:', err);
      }
    }
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(BETA_URL)}`,
      color: "hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/30 hover:text-[#1DA1F2]"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(BETA_URL)}`,
      color: "hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 hover:text-[#0A66C2]"
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + BETA_URL)}`,
      color: "hover:bg-[#25D366]/10 hover:border-[#25D366]/30 hover:text-[#25D366]"
    }
  ];

  return (
    <section className="py-12 sm:py-16 px-4 relative z-10">
      <div className="max-w-xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 font-primary">
            Help us grow
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Share Rhythmé with others who need direction
          </p>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {/* Native Share (Mobile) */}
          {canShare && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleNativeShare}
              className="sm:hidden backdrop-blur-xl bg-background/40 border border-border hover:border-primary/50 transition-all duration-300"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}

          {/* Social Share Links */}
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block"
            >
              <Button
                variant="outline"
                size="lg"
                className={`backdrop-blur-xl bg-background/40 border border-border transition-all duration-300 ${link.color}`}
              >
                {link.icon}
                <span className="ml-2">{link.name}</span>
              </Button>
            </a>
          ))}

          {/* Copy Link Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleCopyLink}
            className={`backdrop-blur-xl bg-background/40 border transition-all duration-300 ${
              copied 
                ? "border-green-500/50 text-green-500" 
                : "border-border hover:border-primary/50"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="ml-2">Copied!</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="ml-2">Copy Link</span>
              </>
            )}
          </Button>
        </div>

        {/* Mobile Social Icons */}
        <div className="flex justify-center gap-3 mt-4 sm:hidden">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="icon"
                className={`backdrop-blur-xl bg-background/40 border border-border transition-all duration-300 h-12 w-12 ${link.color}`}
              >
                {link.icon}
              </Button>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShareButtons;
