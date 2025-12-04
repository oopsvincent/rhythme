"use client";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc"; // Google official colored icon
import { FaGithub, FaDiscord, FaSpotify, FaApple, FaFacebook } from "react-icons/fa";
import { signInWithProviderAction } from "@/app/actions/auth";

// 2. Define provider configs
const providers = [
  {
    id: "google" as const,
    name: "Continue with Google",
    shortName: "Google",
    color: "bg-background hover:bg-accent text-foreground border border-border",
    icon: <FcGoogle size={20} />,
  },
  {
    id: "github" as const,
    name: "Continue with GitHub",
    shortName: "GitHub",
    color: "bg-background hover:bg-secondary/80 text-foreground",
    icon: <FaGithub size={20} />,
  },
  {
    id: "apple" as const,
    name: "Continue with Apple (Coming Soon)",
    shortName: "Apple (NA)",
    color: "bg-black text-foreground hover:bg-gray-800",
    icon: <FaApple size={20} />,
    disabled: true, // Apple OAuth not in your supabase config yet
  },
  {
    id: "discord" as const,
    name: "Continue with Discord",
    shortName: "Discord",
    color: "bg-indigo-600 text-foreground hover:bg-indigo-500",
    icon: <FaDiscord size={20} />,
  },
//   {
//     id: "spotify" as const,
//     name: "Continue with Spotify",
//     shortName: "Spotify",
//     color: "bg-green-500 text-foreground hover:bg-green-400",
//     icon: <FaSpotify size={20} />,
//   },
  {
    id: "facebook" as const,
    name: "Continue with Facebook",
    shortName: "Facebook",
    color: "bg-blue-600 text-foreground hover:bg-blue-500",
    icon: <FaFacebook size={20} />,
  },
];

export default function OAuthButtons() {
  return (
    <div className="space-y-3 md:flex md:gap-2 md:justify-center md:h-auto md:flex-wrap w-full">
      {providers.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          onClick={() =>
            !provider.disabled && signInWithProviderAction(provider.id)
          }
          variant="outline"
          className={`w-full md:w-[40%] flex items-center justify-center space-x-2 ${provider.color} cursor-pointer`}
          disabled={provider.disabled}
        >
          {provider.icon}
          {/* Show full text on mobile, short name on desktop */}
          <span className="md:hidden">{provider.name}</span>
          <span className="hidden md:inline">{provider.shortName}</span>
        </Button>
      ))}
    </div>
  );
}