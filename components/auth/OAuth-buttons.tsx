"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { FcGoogle } from "react-icons/fc"; // Google official colored icon
import { FaGithub, FaDiscord, FaSpotify, FaApple, FaFacebook } from "react-icons/fa";

// 1. Function to handle login
async function signInWithProvider(
  provider: "google" | "github" | "discord" | "spotify"
) {

    const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.message);
    return;
  }

  if (data?.url) {
    window.location.href = data.url;
  }
}

// 2. Define provider configs
const providers = [
  {
    id: "google" as const,
    name: "Continue with Google",
    color: "bg-white border text-gray-800 hover:bg-blue-100",
    icon: <FcGoogle size={20} />,
  },
  {
    id: "github" as const,
    name: "Continue with GitHub",
    color: "bg-gray-900 text-white hover:bg-gray-400",
    icon: <FaGithub size={20} />,
  },
  {
    id: "apple" as const,
    name: "Continue with Apple",
    color: "bg-black text-white hover:bg-gray-800",
    icon: <FaApple size={20} />,
    disabled: true, // Apple OAuth not in your supabase config yet
  },
  {
    id: "discord" as const,
    name: "Continue with Discord",
    color: "bg-indigo-600 text-white hover:bg-indigo-500",
    icon: <FaDiscord size={20} />,
  },
  {
    id: "spotify" as const,
    name: "Continue with Spotify",
    color: "bg-green-500 text-white hover:bg-green-400",
    icon: <FaSpotify size={20} />,
  },
  {
    id: "meta" as const,
    name: "Continue with Meta",
    color: "bg-blue-600 text-white hover:bg-blue-500",
    icon: <FaFacebook size={20} />,
    disabled: true,
  },
];

export default function OAuthButtons() {
  return (
    <div className="space-y-3 md:flex md:gap-2 md:justify-center md:h-auto md:flex-wrap w-full">
      {providers.map((provider) => (
        <Button
          key={provider.id}
          onClick={() =>
            !provider.disabled && signInWithProvider(provider.id)
          }
          variant="outline"
          className={`w-full md:w-[40%] flex items-center justify-center space-x-2 ${provider.color}`}
          disabled={provider.disabled}
        >
          {provider.icon}
          <span>{provider.name}</span>
        </Button>
      ))}
    </div>
  );
}
