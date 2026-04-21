// app/(dashboard)/settings/subscription/_components/subscription-section.tsx
// Subscription management with Razorpay checkout integration

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Sparkles, 
  Check,
  Zap,
  Brain,
  Cloud,
  Shield,
  TrendingUp,
  Crown,
  Calendar,
  Receipt,
  Target,
  Rocket,
  Flame,
  Heart,
  Compass,
  BarChart3,
  Palette,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { usePremium } from "@/hooks/use-premium"

// Display pricing (actual charge is from Razorpay plan config in INR)
const pricing = {
  monthly: { starter: 0, premium: 9.99 },
  yearly: { starter: 0, premium: 99.99 }
}

const starterPlanFeatures = [
  "1 Goal workspace",
  "Track up to 3 habits",
  "10 tasks per day",
  "10 journal entries/month",
  "Basic focus timer",
]

interface PremiumFeature {
  text: string
  icon: React.ElementType
  inDevelopment?: boolean
}

const premiumFeatures: PremiumFeature[] = [
  { text: "Unlimited workspaces", icon: Target },
  { text: "Unlimited habits & tasks", icon: Zap },
  { text: "Unlimited journaling", icon: Sparkles },
  { text: "Rhythmé AI Agent", icon: Brain, inDevelopment: true },
  { text: "NBA Engine (Full Access)", icon: Rocket, inDevelopment: true },
  { text: "Journal Sentiment Analysis", icon: Heart, inDevelopment: true },
  { text: "AI Goal Roadmaps", icon: Compass, inDevelopment: true },
  { text: "Smart Task Generation", icon: Sparkles, inDevelopment: true },
  { text: "Habit Suggestions", icon: Flame, inDevelopment: true },
  { text: "Weekly & monthly insights", icon: TrendingUp },
  { text: "Advanced analytics", icon: BarChart3 },
  { text: "Cloud backup & sync", icon: Cloud },
  { text: "Priority support", icon: Shield },
  { text: "Custom themes", icon: Palette },
  { text: "Early access to features", icon: Crown },
]

interface SubscriptionSectionProps {
  currentPlan: "starter" | "premium"
  details?: {
    plan?: string;
    amountPaid?: number;
    endDate?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    billingHistory?: any[];
  }
}

export function SubscriptionSection({ currentPlan, details }: SubscriptionSectionProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")
  const [showAllFeatures, setShowAllFeatures] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const { refetch } = usePremium()
  
  const isPremium = currentPlan === "premium"
  const yearlyPrice = pricing.yearly.premium
  const monthlyPrice = pricing.monthly.premium
  const monthlySavings = (monthlyPrice * 12) - yearlyPrice
  const savingsPercentage = Math.round((monthlySavings / (monthlyPrice * 12)) * 100)
  
  const visibleFeatures = showAllFeatures ? premiumFeatures : premiumFeatures.slice(0, 6)

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    
    try {
      const res = await fetch("/api/payments/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: billingCycle }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to create subscription checkout")
      }

      const { checkout_url } = await res.json()

      if (checkout_url) {
        window.location.href = checkout_url;
      } else {
        toast.error("Failed to get checkout link")
        setIsUpgrading(false)
      }
    } catch (error) {
      console.error("Upgrade error:", error)
      toast.error("Upgrade failed", {
        description: error instanceof Error ? error.message : "Something went wrong",
      })
      setIsUpgrading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPremium ? (
              <Crown className="h-5 w-5 text-primary" />
            ) : (
              <Target className="h-5 w-5 text-muted-foreground" />
            )}
            <h3 className="font-medium">
              {isPremium ? "Premium Plan" : "Starter Plan"}
            </h3>
          </div>
          <Badge variant={isPremium ? "default" : "secondary"}>
            {isPremium ? "Active" : "Current"}
          </Badge>
        </div>
        
        <div className={cn(
          "p-4 rounded-lg border",
          isPremium 
            ? "bg-primary/5 border-primary/30" 
            : "bg-muted/30 border-border/50"
        )}>
          <p className="text-sm text-muted-foreground mb-3">
            {isPremium 
              ? "You have access to all premium features" 
              : "Upgrade to unlock AI-powered features"
            }
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            {(isPremium ? premiumFeatures.slice(0, 4) : starterPlanFeatures).map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  {typeof feature === "string" ? feature : feature.text}
                </span>
              </div>
            ))}
          </div>
          
          {isPremium && (
            <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-border/50 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="capitalize">Active subscription {details?.plan ? `(${details.plan})` : ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  <span>${details?.amountPaid || yearlyPrice}/{details?.plan === 'monthly' ? 'month' : 'year'}</span>
                </div>
              </div>
              {details?.endDate && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span><strong className="text-foreground">{Math.max(0, Math.ceil((new Date(details.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))} days left</strong> until renewal</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Upgrade Section - Only for starter */}
      {!isPremium && (
        <>
          <div className="border-b border-border/50" />
          
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Upgrade to Premium
                </h3>
                <p className="text-sm text-muted-foreground">
                  Unlock unlimited features and AI-powered insights
                </p>
              </div>
              
              {/* Billing Toggle */}
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"
                )}>
                  Monthly
                </span>
                <Switch
                  checked={billingCycle === "yearly"}
                  onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
                />
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"
                )}>
                  Yearly
                </span>
                <AnimatePresence mode="wait">
                  {billingCycle === "yearly" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-500 hover:bg-green-500/20">
                        Save {savingsPercentage}%
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Premium Card */}
            <div className="p-6 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="space-y-4 flex-1">
                  {/* Price */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold flex items-center gap-2">
                        Premium
                        <Crown className="h-4 w-4 text-accent" />
                      </h4>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          ${billingCycle === "yearly" ? yearlyPrice : monthlyPrice}
                        </span>
                        <span className="text-muted-foreground">
                          /{billingCycle === "yearly" ? "year" : "month"}
                        </span>
                      </div>
                      {billingCycle === "yearly" && (
                        <p className="text-sm text-primary">
                          ${(yearlyPrice / 12).toFixed(2)}/month billed yearly
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {visibleFeatures.map((feature, i) => {
                      const Icon = feature.icon
                      return (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-muted-foreground">{feature.text}</span>
                          {feature.inDevelopment && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              Dev
                            </span>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>

                  {premiumFeatures.length > 6 && (
                    <button
                      onClick={() => setShowAllFeatures(!showAllFeatures)}
                      className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                    >
                      {showAllFeatures ? (
                        <>Show Less <ChevronUp className="w-3 h-3" /></>
                      ) : (
                        <>Show All {premiumFeatures.length} Features <ChevronDown className="w-3 h-3" /></>
                      )}
                    </button>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 md:min-w-[200px]">
                  <Button 
                    size="lg" 
                    className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25"
                    onClick={handleUpgrade}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Upgrade Now
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    30-day money-back guarantee
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Premium Actions */}
      {isPremium && (
        <>
          <div className="border-b border-border/50" />
          
          <section className="space-y-3">
            <h3 className="font-medium">Manage Subscription</h3>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
              <div>
                <p className="font-medium text-sm">Update Payment Method</p>
                <p className="text-xs text-muted-foreground">Managed by Dodo Payments</p>
              </div>
              <Button variant="ghost" size="sm">Update</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <div>
                <p className="font-medium text-sm text-destructive">Cancel Subscription</p>
                <p className="text-xs text-muted-foreground">
                  Your plan remains active until the billing period ends
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                Cancel
              </Button>
            </div>
          </section>

          {/* Billing History */}
          {details?.billingHistory && details.billingHistory.length > 0 && (
            <>
              <div className="border-b border-border/50" />
              <section className="space-y-4">
                <h3 className="font-medium">Billing History</h3>
                <div className="rounded-md border border-border/50 overflow-hidden bg-background">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30 border-b border-border/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Plan</th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Amount</th>
                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {details.billingHistory.map((item: any, i: number) => (
                        <tr key={i} className="hover:bg-muted/10 transition-colors">
                          <td className="px-4 py-3">{new Date(item.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 capitalize">{item.plan_type}</td>
                          <td className="px-4 py-3 text-right">${item.amount}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  )
}
