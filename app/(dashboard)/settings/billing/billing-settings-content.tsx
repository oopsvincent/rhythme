// app/(dashboard)/settings/billing/billing-settings-content.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  CreditCard, 
  Sparkles, 
  Check,
  Zap,
  Brain,
  Cloud,
  Shield,
  TrendingUp,
  Award,
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Updated pricing
const pricing = {
  monthly: { starter: 0, premium: 12.99 },
  yearly: { starter: 0, premium: 79.99 }
}

const starterPlanFeatures = [
  "1 Goal workspace",
  "Track up to 3 habits",
  "10 tasks per day",
  "10 journal entries/month",
  "Basic focus timer",
]

// Feature type definition
interface PremiumFeature {
  text: string;
  icon: React.ElementType;
  inDevelopment?: boolean;
}

const premiumPlanFeatures: { core: PremiumFeature[]; ai: PremiumFeature[]; extras: PremiumFeature[] } = {
  core: [
    { text: "Unlimited workspaces", icon: Target },
    { text: "Unlimited habits & tasks", icon: Zap },
    { text: "Unlimited journaling", icon: Sparkles },
  ],
  ai: [
    { text: "Rhythmé AI Agent", icon: Brain, inDevelopment: true },
    { text: "NBA Engine (Full Access)", icon: Rocket, inDevelopment: true },
    { text: "Journal Sentiment Analysis", icon: Heart, inDevelopment: true },
    { text: "AI Goal Roadmaps", icon: Compass, inDevelopment: true },
    { text: "Smart Task Generation", icon: Sparkles, inDevelopment: true },
    { text: "Habit Suggestions", icon: Flame, inDevelopment: true },
  ],
  extras: [
    { text: "Weekly & monthly insights", icon: TrendingUp },
    { text: "Advanced analytics", icon: BarChart3 },
    { text: "Cloud backup & sync", icon: Cloud },
    { text: "Priority support", icon: Shield },
    { text: "Custom themes", icon: Palette },
    { text: "Early access to features", icon: Crown },
  ],
}

interface BillingSettingsContentProps {
  currentPlan: "starter" | "premium"
}

export default function BillingSettingsContent({ currentPlan }: BillingSettingsContentProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")
  const [showAllFeatures, setShowAllFeatures] = useState(false)
  
  const isPremium = currentPlan === "premium"
  const yearlyPrice = pricing.yearly.premium
  const monthlyPrice = pricing.monthly.premium
  const monthlySavings = (monthlyPrice * 12) - yearlyPrice
  const savingsPercentage = Math.round((monthlySavings / (monthlyPrice * 12)) * 100)

  const allFeatures = [
    ...premiumPlanFeatures.core,
    ...premiumPlanFeatures.ai,
    ...premiumPlanFeatures.extras,
  ]
  
  const visibleFeatures = showAllFeatures ? allFeatures : allFeatures.slice(0, 6)

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-1"
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Billing & Subscription
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </motion.div>

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className={cn(
          "relative overflow-hidden transition-all duration-500 ease-out",
          isPremium && "border-primary/50"
        )}>
          {isPremium && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl" />
          )}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                {isPremium ? (
                  <>
                    <Crown className="h-5 w-5 text-primary" />
                    Premium Plan
                  </>
                ) : (
                  <>
                    <Target className="h-5 w-5 text-muted-foreground" />
                    Starter Plan
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {isPremium 
                  ? "You have access to all premium features" 
                  : "Upgrade to unlock AI-powered features"
                }
              </CardDescription>
            </div>
            <Badge 
              variant={isPremium ? "default" : "secondary"}
              className={cn(
                "text-sm transition-all duration-300",
                isPremium && "bg-primary"
              )}
            >
              {isPremium ? "Active" : "Current Plan"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Current features */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {(isPremium ? allFeatures.slice(0, 4) : starterPlanFeatures).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      {typeof feature === "string" ? feature : feature.text}
                    </span>
                  </div>
                ))}
              </div>
              
              {isPremium && (
                <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Renews on Jan 1, 2027</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    <span>${yearlyPrice}/year</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upgrade Section - Only show for starter users */}
      {!isPremium && (
        <>
          <Separator />
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Upgrade to Premium
                </h4>
                <p className="text-sm text-muted-foreground">
                  Unlock unlimited features and AI-powered insights
                </p>
              </div>
              
              {/* Billing Toggle - Fixed width container */}
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-sm font-medium transition-all duration-500 ease-out",
                  billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"
                )}>
                  Monthly
                </span>
                <Switch
                  checked={billingCycle === "yearly"}
                  onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
                  className="transition-all duration-500 ease-out"
                />
                <span className={cn(
                  "text-sm font-medium transition-all duration-500 ease-out",
                  billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"
                )}>
                  Yearly
                </span>
                {/* Fixed width container for badge */}
                <div className="w-20">
                  <AnimatePresence mode="wait">
                    {billingCycle === "yearly" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                          Save {savingsPercentage}%
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Premium Plan Card */}
            <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5 transition-all duration-500 ease-out hover:shadow-lg hover:shadow-primary/10">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="space-y-4 flex-1">
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
                            <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{feature.text}</span>
                            {'inDevelopment' in feature && feature.inDevelopment && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                Dev
                              </span>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Show More/Less */}
                    {allFeatures.length > 6 && (
                      <button
                        onClick={() => setShowAllFeatures(!showAllFeatures)}
                        className="text-sm text-primary font-medium flex items-center gap-1 hover:underline transition-all duration-300"
                      >
                        {showAllFeatures ? (
                          <>Show Less <ChevronUp className="w-3 h-3" /></>
                        ) : (
                          <>Show All {allFeatures.length} Features <ChevronDown className="w-3 h-3" /></>
                        )}
                      </button>
                    )}

                    {/* Early Access Notice */}
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted-foreground">
                        <Crown className="w-3 h-3 inline mr-1 text-primary" />
                        <span className="text-primary font-medium">Premium members</span> get early access to AI features in development.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 md:min-w-[200px]">
                    <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25 transition-all duration-500 ease-out">
                      <Sparkles className="h-4 w-4" />
                      Upgrade Now
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      30-day money-back guarantee
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      {/* Manage Subscription - Only show for Premium users */}
      {isPremium && (
        <>
          <Separator />
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="font-semibold">Manage Subscription</h4>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-muted transition-all duration-500 ease-out hover:border-primary/30">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Billing History</p>
                      <p className="text-xs text-muted-foreground">View past invoices</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </CardContent>
              </Card>
              
              <Card className="border-muted transition-all duration-500 ease-out hover:border-primary/30">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Payment Method</p>
                      <p className="text-xs text-muted-foreground">•••• •••• •••• 4242</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Update</Button>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-destructive/30 bg-destructive/5 transition-all duration-500 ease-out">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-destructive/10 flex items-center justify-center">
                    <span className="text-destructive text-xs font-bold">!</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-destructive">Cancel Subscription</p>
                    <p className="text-xs text-muted-foreground">
                      Your plan will remain active until the end of the billing period
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  )
}
