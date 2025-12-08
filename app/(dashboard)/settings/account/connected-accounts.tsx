// app/(dashboard)/settings/account/connected-accounts.tsx
"use client"

import { useState } from "react"
import { linkProvider, unlinkProvider, type LinkedIdentity, type OAuthProvider } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Link2, 
  Unlink,
  Loader2,
  Plus,
  Check,
  AlertCircle
} from "lucide-react"
import { useRouter } from "next/navigation"

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

interface ConnectedAccountsProps {
  identities: LinkedIdentity[]
}

export default function ConnectedAccounts({ identities }: ConnectedAccountsProps) {
  const router = useRouter()
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null)
  const [linkingProvider, setLinkingProvider] = useState<OAuthProvider | null>(null)
  const [error, setError] = useState<string | null>(null)

  const connectedProviders = identities.map(i => i.provider)
  const availableProviders = ALL_PROVIDERS.filter(p => !connectedProviders.includes(p))

  const handleUnlink = async (identityId: string) => {
    setUnlinkingId(identityId)
    setError(null)
    
    const result = await unlinkProvider(identityId)
    
    if (!result.success) {
      setError(result.error || "Failed to unlink account")
    } else {
      router.refresh()
    }
    
    setUnlinkingId(null)
  }

  const handleLink = async (provider: OAuthProvider) => {
    setLinkingProvider(provider)
    setError(null)
    
    try {
      await linkProvider(provider)
    } catch (err: any) {
      setError(err.message || "Failed to link account")
      setLinkingProvider(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          Connected Accounts
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage your linked social accounts for easy sign-in.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Connected Accounts List */}
      <div className="space-y-3">
        {identities.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No social accounts connected yet.
          </p>
        ) : (
          identities.map((identity) => {
            const provider = PROVIDERS[identity.provider as OAuthProvider] || {
              name: identity.provider,
              icon: identity.provider[0].toUpperCase(),
              color: "bg-gray-500"
            }
            
            return (
              <div
                key={identity.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card/50"
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
          })
        )}
      </div>

      {/* Add More Accounts */}
      {availableProviders.length > 0 && (
        <>
          <Separator />
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
        <p className="text-xs text-muted-foreground">
          💡 Tip: Connect multiple accounts so you always have a backup way to sign in.
        </p>
      )}
    </div>
  )
}
