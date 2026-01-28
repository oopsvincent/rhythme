// app/(dashboard)/settings/connections/_components/connections-section.tsx
// Connected accounts management with flat design

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { linkProvider, unlinkProvider, type LinkedIdentity, type OAuthProvider } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
} from "@/components/ui/alert-dialog"
import { 
  Plus,
  Check,
  Unlink,
  Loader2,
  Info
} from "lucide-react"
import { toast } from "sonner"

// Provider configuration with icons and colors
const PROVIDERS: Record<OAuthProvider, { name: string; icon: string; color: string }> = {
  google: { name: "Google", icon: "G", color: "bg-red-500" },
  github: { name: "GitHub", icon: "GH", color: "bg-gray-800" },
  discord: { name: "Discord", icon: "D", color: "bg-indigo-500" },
  spotify: { name: "Spotify", icon: "S", color: "bg-green-500" },
  apple: { name: "Apple", icon: "A", color: "bg-gray-900" },
  facebook: { name: "Facebook", icon: "F", color: "bg-blue-600" },
}

const ALL_PROVIDERS: OAuthProvider[] = ["google", "github", "discord", "spotify"]

interface ConnectionsSectionProps {
  identities: LinkedIdentity[]
  linkedProvider?: string | null
}

export function ConnectionsSection({ identities, linkedProvider }: ConnectionsSectionProps) {
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null)
  const [linkingProvider, setLinkingProvider] = useState<OAuthProvider | null>(null)
  const router = useRouter()

  const connectedProviders = identities.map(i => i.provider)
  const availableProviders = ALL_PROVIDERS.filter(p => !connectedProviders.includes(p))

  // Show success toast when account is linked via OAuth callback
  useEffect(() => {
    if (linkedProvider) {
      const providerName = PROVIDERS[linkedProvider as OAuthProvider]?.name || linkedProvider
      toast.success(`Successfully connected ${providerName}!`, {
        description: `Your ${providerName} account is now linked.`,
      })
      // Clean up URL
      router.replace('/settings/connections', { scroll: false })
    }
  }, [linkedProvider, router])

  const handleUnlink = async (identityId: string) => {
    console.log("handleUnlink called with identityId:", identityId)
    setUnlinkingId(identityId)
    
    try {
      const result = await unlinkProvider(identityId)
      console.log("unlinkProvider result:", result)
      
      if (!result.success) {
        toast.error(result.error || "Failed to disconnect account")
      } else {
        toast.success("Account disconnected successfully")
        router.refresh()
      }
    } catch (error) {
      console.error("Unlink error:", error)
      toast.error("An unexpected error occurred")
    }
    
    setUnlinkingId(null)
  }

  const handleLink = async (provider: OAuthProvider) => {
    setLinkingProvider(provider)
    toast.info(`Connecting ${PROVIDERS[provider].name}...`, {
      description: "You'll be redirected to authorize the connection."
    })
    
    try {
      const result = await linkProvider(provider)
      if (result && !result.success) {
         toast.error(result.error || "Failed to initiate connection")
         setLinkingProvider(null)
      }
    } catch (err: unknown) {
      // linkProvider uses redirect, so this catch is expected
      // If we get here without redirect, it's an error
      const message = err instanceof Error ? err.message : "Failed to link account"
      if (!message.includes('NEXT_REDIRECT')) {
        toast.error(message)
        setLinkingProvider(null)
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Connected Accounts List */}
      <div className="space-y-4">
        {identities.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              No social accounts connected yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {identities.map((identity) => {
              const provider = PROVIDERS[identity.provider as OAuthProvider] || {
                name: identity.provider,
                icon: identity.provider[0].toUpperCase(),
                color: "bg-gray-500"
              }
              
              return (
                <div
                  key={identity.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {identity.avatar ? (
                        <AvatarImage src={identity.avatar} alt={identity.name || provider.name} />
                      ) : null}
                      <AvatarFallback className={`${provider.color} text-white text-sm font-bold`}>
                        {provider.icon}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{provider.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {identity.email || identity.name || "Connected account"}
                      </p>
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        disabled={unlinkingId === identity.id || identities.length <= 1}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        {unlinkingId === identity.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Unlink className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Disconnect {provider.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You won&apos;t be able to sign in with this {provider.name} account anymore. 
                          You can always reconnect it later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleUnlink(identity.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Disconnect
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add More Accounts */}
      {availableProviders.length > 0 && (
        <>
          <div className="border-b border-border/50" />
          
          <div className="space-y-3">
            <p className="text-sm font-medium">Add another account</p>
            <div className="flex flex-wrap gap-2">
              {availableProviders.map((providerId) => {
                const provider = PROVIDERS[providerId]
                return (
                  <Button
                    key={providerId}
                    variant="outline"
                    size="sm"
                    disabled={linkingProvider === providerId}
                    onClick={() => handleLink(providerId)}
                    className="gap-2"
                  >
                    {linkingProvider === providerId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {provider.name}
                  </Button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {identities.length <= 1 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Info className="h-4 w-4 text-primary mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Connect multiple accounts so you always have a backup way to sign in.
          </p>
        </div>
      )}
    </div>
  )
}
