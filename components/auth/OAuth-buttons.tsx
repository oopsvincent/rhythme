"use client";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaDiscord, FaFacebook, FaTwitch } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { signInWithProviderAction } from "@/app/actions/auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const providers = [
  {
    id: "google" as const,
    label: "Google",
    icon: <FcGoogle size={20} />,
    disabled: false,
  },
  {
    id: "github" as const,
    label: "GitHub",
    icon: <FaGithub size={20} className="text-foreground" />,
    disabled: false,
  },
  {
    id: "discord" as const,
    label: "Discord",
    icon: <FaDiscord size={20} className="text-[#5865F2]" />,
    disabled: false,
  },
  {
    id: "x" as const,
    label: "X",
    icon: <FaXTwitter size={18} className="text-foreground" />,
    disabled: false,
  },
  {
    id: "facebook" as const,
    label: "Facebook",
    icon: <FaFacebook size={20} className="text-[#1877F2]" />,
    disabled: false,
  },
  {
    id: "twitch" as const,
    label: "Twitch",
    icon: <FaTwitch size={20} className="text-[#9146FF]" />,
    disabled: false,
  },
];

export default function OAuthButtons({ redirectTo }: { redirectTo?: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleClick(providerId: typeof providers[number]["id"]) {
    setLoadingId(providerId);
    try {
      await signInWithProviderAction(providerId, redirectTo);
    } catch {
      setLoadingId(null);
    }
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 w-full max-w-sm sm:max-w-none mx-auto justify-center">
      {providers.map((provider) => (
        <motion.div
          key={provider.id}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-full h-12"
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => !provider.disabled && handleClick(provider.id)}
            disabled={provider.disabled || loadingId !== null}
            title={provider.disabled ? `${provider.label} (coming soon)` : `Continue with ${provider.label}`}
            className="
              relative h-full w-full rounded-2xl border border-border/40
              bg-muted/10 dark:bg-card/20 backdrop-blur-xs
              hover:bg-muted/20 dark:hover:bg-card/40 hover:border-primary/40
              transition-all duration-300 ease-out
              disabled:opacity-40 disabled:hover:scale-100
              cursor-pointer shadow-xs shadow-primary/2
              flex items-center justify-center
            "
          >
            {loadingId === provider.id ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              provider.icon
            )}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
