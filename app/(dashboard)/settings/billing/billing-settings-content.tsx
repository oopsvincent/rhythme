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
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

// Pricing data from landing page
const pricing = {
  monthly: { free: 0, plus: 9.99 },
  yearly: { free: 0, plus: 59.99 }
}

const freePlanFeatures = [
  "Track up to 3 habits",
  "10 tasks per day",
  "10 journal entries/month",
  "Basic focus timer",
  "Weekly progress overview",
]

const plusPlanFeatures = [
  { text: "Unlimited habits tracking", icon: Zap },
  { text: "Unlimited tasks & to-dos", icon: Zap },
  { text: "Unlimited journal entries", icon: Zap },
  { text: "AI-powered insights", icon: Brain },
  { text: "AI habit suggestions", icon: Brain },
  { text: "Advanced analytics", icon: TrendingUp },
  { text: "Advanced goal management", icon: Award },
  { text: "Cloud backup & sync", icon: Cloud },
  { text: "Priority support", icon: Shield },
  { text: "Custom themes", icon: Sparkles },
]

interface BillingSettingsContentProps {
  currentPlan: "free" | "plus"
}

export default function BillingSettingsContent({ currentPlan }: BillingSettingsContentProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")
  
  const isPlus = currentPlan === "plus"
  const yearlyPrice = pricing.yearly.plus
  const monthlyPrice = pricing.monthly.plus
  const monthlySavings = (monthlyPrice * 12) - yearlyPrice
  const savingsPercentage = Math.round((monthlySavings / (monthlyPrice * 12)) * 100)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Billing & Subscription
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>

      {/* Current Plan Card */}
      <Card className={cn(
        "relative overflow-hidden",
        isPlus && "border-primary/50"
      )}>
        {isPlus && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl" />
        )}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {isPlus ? (
                <>
                  <Crown className="h-5 w-5 text-primary" />
                  Plus Plan
                </>
              ) : (
                <>
                  Free Plan
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isPlus 
                ? "You have access to all premium features" 
                : "Upgrade to unlock all features"
              }
            </CardDescription>
          </div>
          <Badge 
            variant={isPlus ? "default" : "secondary"}
            className={cn(
              "text-sm",
              isPlus && "bg-primary"
            )}
          >
            {isPlus ? "Active" : "Current Plan"}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current features */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {(isPlus ? plusPlanFeatures.slice(0, 4) : freePlanFeatures).map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    {typeof feature === "string" ? feature : feature.text}
                  </span>
                </div>
              ))}
            </div>
            
            {isPlus && (
              <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Renews on Jan 1, 2025</span>
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

      {/* Upgrade Section - Only show for free users */}
      {!isPlus && (
        <>
          <Separator />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Upgrade to Plus</h4>
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
                {billingCycle === "yearly" && (
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                    Save {savingsPercentage}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Plus Plan Card */}
            <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">Plus</h4>
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
                      {plusPlanFeatures.map((feature, i) => {
                        const Icon = feature.icon
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">{feature.text}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 md:min-w-[200px]">
                    <Button size="lg" className="gap-2">
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
          </div>
        </>
      )}

      {/* Manage Subscription - Only show for Plus users */}
      {isPlus && (
        <>
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-semibold">Manage Subscription</h4>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-muted">
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
              
              <Card className="border-muted">
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
            
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
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
          </div>
        </>
      )}

      {/* Coming Soon Notice */}
      <Card className="border-muted bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-sm">Billing Coming Soon</p>
              <p className="text-xs text-muted-foreground">
                Payment processing is not yet available. This is a preview of the billing interface.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
