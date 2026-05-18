// app/(dashboard)/settings/connections/_components/connections-section.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  linkProvider,
  unlinkProvider,
  type LinkedIdentity,
  type OAuthProvider,
} from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Check, Unlink, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import clsx from "clsx";

// Provider configuration
const PROVIDERS: Record<
  OAuthProvider,
  { name: string; icon: string; color: string }
> = {
  google: { name: "Google", icon: "G.svg", color: "bg-red-500" },
  github: { name: "GitHub", icon: "GitHub_Lockup_Black.svg", color: "bg-gray-800" },
  discord: { name: "Discord", icon: "Discord-Logo-Blurple.svg", color: "bg-indigo-500" },
  apple: { name: "Apple", icon: "Apple.svg", color: "bg-gray-900" },
  facebook: { name: "Facebook", icon: "Facebook_Logo_Primary.png", color: "bg-blue-600" },
};

const ALL_PROVIDERS: OAuthProvider[] = ["google", "github", "discord", "apple", "facebook"];

interface ConnectionsSectionProps {
  identities: LinkedIdentity[];
  linkedProvider?: string | null;
}

export function ConnectionsSection({
  identities,
  linkedProvider,
}: ConnectionsSectionProps) {
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);
  const [linkingProvider, setLinkingProvider] = useState<OAuthProvider | null>(null);
  const router = useRouter();

  const connectedProviders = identities.map((i) => i.provider);
  const availableProviders = ALL_PROVIDERS.filter(
    (p) => !connectedProviders.includes(p),
  );

  useEffect(() => {
    if (linkedProvider) {
      const providerName = PROVIDERS[linkedProvider as OAuthProvider]?.name || linkedProvider;
      toast.success(`Successfully connected ${providerName}!`, {
        description: `Your ${providerName} account is now linked.`,
      });
      router.replace("/settings/connections", { scroll: false });
    }
  }, [linkedProvider, router]);

  const handleUnlink = async (identityId: string) => {
    setUnlinkingId(identityId);
    try {
      const result = await unlinkProvider(identityId);
      if (!result.success) {
        toast.error(result.error || "Failed to disconnect account");
      } else {
        toast.success("Account disconnected successfully");
        router.refresh();
      }
    } catch (error) {
      console.error("Unlink error:", error);
      toast.error("An unexpected error occurred");
    }
    setUnlinkingId(null);
  };

  const handleLink = async (provider: OAuthProvider) => {
    setLinkingProvider(provider);
    toast.info(`Connecting ${PROVIDERS[provider].name}...`, {
      description: "You'll be redirected to authorize the connection.",
    });

    try {
      await linkProvider(provider);
      // redirect is expected — catch block handles non-redirect errors
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to link account";
      if (!message.includes("NEXT_REDIRECT")) {
        toast.error(message);
        setLinkingProvider(null);
      }
    }
  };

return (
    <div className="space-y-10">
      {/* Connected Accounts */}
      <section className="space-y-5">
        <h3 className="text-lg font-medium">Connected Accounts</h3>

        {identities.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground border border-dashed rounded-xl bg-muted/30">
            No social accounts connected yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {identities.map((identity) => {
              const provider =
                PROVIDERS[identity.provider as OAuthProvider] || {
                  name: identity.provider,
                  icon: identity.provider[0].toUpperCase(),
                  color: "bg-gray-500",
                };

              return (
                <div
                  key={identity.id}
                  className={clsx(
                    "h-56 shadow-sm bg-muted/30 rounded-xl border border-border/60",
                    "grid grid-rows-[1fr_auto] place-items-center gap-5 p-6 relative overflow-hidden"
                  )}
                >
                  {/* Icon + avatar area */}
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-xl bg-background dark:bg-foreground border border-border/70 grid place-items-center overflow-hidden shadow-sm">
                        <Image
                          width={64}
                          height={64}
                          src={`/${provider.icon}`}
                          alt={`${provider.name} icon`}
                          className="w-4/5 h-4/5 object-contain"
                        />
                      </div>

                      {identity.avatar && (
                        <Avatar className="absolute -bottom-2 -right-2 h-8 w-8 ring-2 ring-background">
                          <AvatarImage src={identity.avatar} alt={identity.name || provider.name} />
                          <AvatarFallback className="text-xs bg-muted">
                            {identity.name?.[0] || "?"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    <div className="text-center space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-medium">{provider.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mx-auto">
                        {identity.email || identity.name || "Connected"}
                      </p>
                    </div>
                  </div>

                  {/* Action button - bottom */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={unlinkingId === identity.id || identities.length <= 1}
                        className="w-[85%] gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                      >
                        {unlinkingId === identity.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Unlink className="h-4 w-4" />
                            Disconnect
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    {/* ... AlertDialogContent unchanged ... */}
                  </AlertDialog>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Add More Accounts */}
      {availableProviders.length > 0 && (
        <section className="space-y-5">
          <h3 className="text-lg font-medium">Add Another Account</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableProviders.map((providerId) => {
              const provider = PROVIDERS[providerId];

              return (
                <div
                  key={providerId}
                  className={clsx(
                    "h-56 shadow-sm bg-muted/20 rounded-xl border border-border/60",
                    "grid grid-rows-[1fr_auto] place-items-center gap-5 p-6"
                  )}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <div className="w-[90%] h-20 rounded-xl bg-background dark:bg-foreground border border-border/70 grid place-items-center overflow-hidden shadow-sm">
                      <Image
                        className={clsx(
                          "object-contain",
                          {
                            "w-12": provider.name === "Apple",
                            "w-42 ": provider.name === "Github",
                            "w-42": provider.name !== "Apple",
                            "p-3": provider.name === "Discord",
                            "w-[25%]": provider.name === "Facebook",
                          }
                        )}
                        width={64}
                        height={64}
                        src={`/${provider.icon}`}
                        alt={`${provider.name} icon`}
                      />
                    </div>

                    <div className="text-center">
                      <p className="font-medium">{provider.name}</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLink(providerId)}
                    disabled={linkingProvider === providerId}
                    className="w-[85%] gap-2 justify-center"
                  >
                    {linkingProvider === providerId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Connect
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {identities.length <= 1 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            Connect multiple accounts so you always have a backup way to sign in — even if one
            service is down.
          </p>
        </div>
      )}
    </div>
  );
}
