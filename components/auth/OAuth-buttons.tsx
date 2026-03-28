"use client";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaDiscord, FaFacebook } from "react-icons/fa";
import { signInWithProviderAction } from "@/app/actions/auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const providers = [
  {
    id: "google" as const,
    label: "Google",
    icon: <FcGoogle size={18} />,
    disabled: false,
  },
  {
    id: "github" as const,
    label: "GitHub",
    icon: <FaGithub size={18} />,
    disabled: false,
  },
  {
    id: "discord" as const,
    label: "Discord",
    icon: <FaDiscord size={18} className="text-indigo-500" />,
    disabled: false,
  },
  {
    id: "facebook" as const,
    label: "Facebook",
    icon: <FaFacebook size={18} className="text-blue-500" />,
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
    <div className="flex items-center justify-center gap-2 w-full">
      {providers.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          variant="outline"
          size="icon"
          onClick={() => !provider.disabled && handleClick(provider.id)}
          disabled={provider.disabled || loadingId !== null}
          title={provider.disabled ? `${provider.label} (coming soon)` : `Continue with ${provider.label}`}
          className="
            relative h-11 w-11 rounded-xl border-border/60
            bg-card/50 backdrop-blur-sm
            hover:bg-accent/80 hover:border-primary/30 hover:scale-105
            active:scale-95
            transition-all duration-200 ease-out
            disabled:opacity-40 disabled:hover:scale-100
            cursor-pointer
          "
        >
          {loadingId === provider.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            provider.icon
          )}
        </Button>
      ))}
    </div>
  );
}