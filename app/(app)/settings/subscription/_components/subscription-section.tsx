"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Crown,
  Sparkles,
  Calendar,
  Receipt,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Loader2,
  Check,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

const pricing = {
  monthly: 9.99,
  yearly: 99.99,
}

const starterPlanFeatures = [
  "1 Goal workspace",
  "Track up to 5 habits",
  "10 tasks per day",
  "10 journal entries/month",
  "Basic focus timer",
]

const benefits = [
  {
    heading: "No more choosing what to track",
    description: "Unlimited habits, tasks, journals, and mood logs. Your full picture — always complete, never capped.",
  },
  {
    heading: "Patterns you'd never catch alone",
    description: "Weekly behavioral reviews and analytics that reveal when you do your best work — and what quietly derails you.",
  },
  {
    heading: "Intelligence that adapts to your rhythm",
    description: "Predictive habit insights, smart suggestions, and sentiment analysis that sharpen with every day you show up.",
  },
  {
    heading: "A workspace that feels like yours",
    description: "Premium themes, multiple goal workspaces, and early access to everything we build next.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
}

interface SubscriptionSectionProps {
  currentPlan: "starter" | "premium"
  details?: {
    plan?: string;
    status?: string;
    amount?: number | string;
    currency?: string;
    billingInterval?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    subscriptionId?: string;
    billingHistory?: BillingHistoryItem[];
  }
}

interface BillingHistoryItem {
  id: string
  provider_payment_id?: string | null
  plan_key?: string | null
  amount?: number | string | null
  currency?: string | null
  status: string
  paid_at?: string | null
  receipt_url?: string | null
}

function formatMoney(amount?: number | string | null, currency = "USD") {
  if (amount == null) return "Managed by Dodo"
  const parsedAmount = typeof amount === "string" ? Number(amount) : amount
  if (!Number.isFinite(parsedAmount)) return "Managed by Dodo"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(parsedAmount)
}

export function SubscriptionSection({ currentPlan, details }: SubscriptionSectionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const justUpgraded = searchParams.get("upgraded") === "true"

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  // Custom paywall UI states
  const [showPaywall, setShowPaywall] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1)

  const isPremium = currentPlan === "premium"
  const renewalDate = details?.currentPeriodEnd ? new Date(details.currentPeriodEnd) : null
  const daysUntilRenewal = renewalDate
    ? Math.max(0, Math.ceil((renewalDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
    : null

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

  const handleUpdatePaymentMethod = async () => {
    setIsUpdatingPayment(true)

    try {
      const res = await fetch("/api/payments/update-payment-method", { method: "POST" })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to create payment update link")
      }

      const { url } = await res.json()
      if (url) {
        window.location.href = url
      } else {
        toast.error("Dodo did not return a payment update link")
      }
    } catch (error) {
      toast.error("Could not update payment method", {
        description: error instanceof Error ? error.message : "Something went wrong",
      })
    } finally {
      setIsUpdatingPayment(false)
    }
  }

  const handleCancelSubscription = async () => {
    const confirmed = window.confirm("Cancel your subscription at the end of the current billing period?")
    if (!confirmed) return

    setIsCancelling(true)

    try {
      const res = await fetch("/api/payments/cancel-subscription", { method: "POST" })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to cancel subscription")
      }

      toast.success("Subscription cancellation scheduled")
      window.location.reload()
    } catch (error) {
      toast.error("Could not cancel subscription", {
        description: error instanceof Error ? error.message : "Something went wrong",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="space-y-8 relative">
      {/* Search param upgrade success banner */}
      {justUpgraded && isPremium && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-primary/30 bg-primary/5 text-center space-y-2 mb-6"
        >
          <h3 className="text-xl font-primary font-semibold">You&apos;re in.</h3>
          <p className="text-sm text-muted-foreground">
            Rhythmé Premium is active. Every tool, every insight, every capability — unlocked.
          </p>
        </motion.div>
      )}

      {/* For Free/Starter Users: Normal Settings layout showing Current Plan & Get Premium Card */}
      {!isPremium && (
        <div className="space-y-8">
          {/* Upgrade Promo Section */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/[0.03] to-primary/[0.01] p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Unlock Rhythmé Premium</span>
              </div>
              <h3 className="font-primary text-xl md:text-2xl font-semibold text-foreground">
                Ready for the next level?
              </h3>
              <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                Get unlimited habits, tasks, journals, weekly reviews, AI-powered behavioral insights, identity reinforcement, and custom appearance settings.
              </p>
            </div>
            
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10 px-8 py-6 rounded-xl font-medium"
              onClick={() => {
                setShowPaywall(true)
                setCheckoutStep(1)
              }}
            >
              Get Rhythmé Premium
            </Button>
          </div>

          <div className="border-b border-border/50" />

          {/* Current Starter Plan Info */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current Plan</p>
                <h4 className="text-lg font-semibold text-foreground mt-1">Starter (Free)</h4>
              </div>
              <Badge variant="outline" className="px-2.5 py-0.5 text-xs bg-muted/30">
                Active
              </Badge>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Included in your Starter plan:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {starterPlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Animated Full Screen Paywall overlay */}
          <AnimatePresence>
            {showPaywall && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-start overflow-y-auto px-6 py-12 md:py-20"
              >
                <div className="w-full max-w-5xl relative flex-1 flex flex-col justify-center">
                  
                  {/* Close button */}
                  <button
                    onClick={() => setShowPaywall(false)}
                    className="absolute top-0 right-0 p-2.5 rounded-full hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground z-10"
                    aria-label="Close paywall"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  <AnimatePresence mode="wait">
                    {checkoutStep === 1 ? (
                      <motion.div
                        key="paywall-step1"
                        initial={{ opacity: 0, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.99 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full"
                      >
                        {/* Left side: Hero & Features */}
                        <div className="lg:col-span-7 space-y-8 text-left">
                          <div className="space-y-3">
                            <h2 className="font-primary text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-foreground">
                              Go deeper into how you work.
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-base max-w-lg leading-relaxed">
                              Rhythmé Premium is the complete behavioral system for builders who take consistency seriously.
                            </p>
                          </div>

                          {/* Drop-in animations for features one-by-one */}
                          <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="space-y-3"
                          >
                            {benefits.map((benefit, index) => (
                              <motion.div
                                key={index}
                                variants={itemVariants}
                                className="p-5 rounded-xl border border-border/40 bg-muted/20 backdrop-blur-sm"
                              >
                                <h3 className="text-sm font-semibold text-foreground">{benefit.heading}</h3>
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                  {benefit.description}
                                </p>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>

                        {/* Right side: Pricing card */}
                        <div className="lg:col-span-5">
                          <div className="p-6 md:p-8 rounded-2xl border border-primary/25 space-y-6 bg-muted/10 backdrop-blur-sm relative overflow-hidden shadow-xl text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Select Cycle</span>
                              <div className="flex items-center gap-3">
                                <span className={cn(
                                  "text-xs font-medium transition-colors",
                                  billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"
                                  )}>
                                  Monthly
                                </span>
                                <Switch
                                  checked={billingCycle === "yearly"}
                                  onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
                                />
                                <span className={cn(
                                  "text-xs font-medium transition-colors",
                                  billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"
                                )}>
                                  Yearly
                                </span>
                              </div>
                            </div>

                            {billingCycle === "yearly" && (
                              <p className="text-xs text-primary font-medium">Most builders choose annual</p>
                            )}

                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl md:text-5xl font-bold text-foreground">
                                ${billingCycle === "yearly" ? pricing.yearly : pricing.monthly}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                /{billingCycle === "yearly" ? "year" : "month"}
                              </span>
                            </div>

                            {billingCycle === "yearly" && (
                              <p className="text-xs text-muted-foreground">
                                ${(pricing.yearly / 12).toFixed(2)}/month, billed annually
                              </p>
                            )}

                            <Button
                              size="lg"
                              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 mt-2 py-6 rounded-xl text-base"
                              onClick={() => setCheckoutStep(2)}
                            >
                              <Sparkles className="h-4 w-4" />
                              Go Premium
                            </Button>
                            <p className="text-[11px] text-center text-muted-foreground/80">
                              Cancel anytime · Your data stays yours
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="paywall-step2"
                        initial={{ opacity: 0, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.99 }}
                        className="w-full max-w-md mx-auto space-y-6 text-left"
                      >
                        {/* Header */}
                        <div className="text-center space-y-2">
                          <h2 className="font-primary text-2xl font-semibold tracking-tight text-foreground">Confirm Subscription</h2>
                          <p className="text-muted-foreground text-sm">Review your selected subscription cycle</p>
                        </div>

                        {/* Summary Card */}
                        <div className="p-6 rounded-xl border border-primary/20 space-y-4 bg-muted/10">
                          <div className="flex justify-between items-center pb-3 border-b border-border/40">
                            <span className="font-semibold text-foreground">Rhythmé Premium</span>
                            <Badge variant="outline" className="capitalize">
                              {billingCycle === "yearly" ? "Annual" : "Monthly"}
                            </Badge>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                              <span>Billing Interval</span>
                              <span>{billingCycle === "yearly" ? "Every 12 months" : "Every month"}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>Price</span>
                              <span>${billingCycle === "yearly" ? pricing.yearly : pricing.monthly}</span>
                            </div>
                            <div className="flex justify-between font-medium text-foreground pt-2 border-t border-border/40 text-base">
                              <span>Total due today</span>
                              <span>${billingCycle === "yearly" ? pricing.yearly : pricing.monthly}</span>
                            </div>
                          </div>

                          <Button
                            size="lg"
                            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 mt-4 py-6 rounded-xl text-base"
                            onClick={handleUpgrade}
                            disabled={isUpgrading}
                          >
                            {isUpgrading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Redirecting to Checkout...
                              </>
                            ) : (
                              <>
                                Continue to Checkout
                              </>
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            type="button"
                            className="w-full text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => setCheckoutStep(1)}
                            disabled={isUpgrading}
                          >
                            Back to pricing
                          </Button>
                        </div>

                        <p className="text-xs text-muted-foreground/60 text-center">
                          Payments secured by Dodo
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* For Premium Users: Normal Subscription Management layout */}
      {isPremium && (
        <>
          {/* Current Plan info */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Current Plan: Premium</h3>
              </div>
              <Badge variant="default">
                {details?.cancelAtPeriodEnd ? "Cancels soon" : "Active"}
              </Badge>
            </div>

            <div className="p-4 rounded-lg border bg-primary/5 border-primary/30">
              <p className="text-sm text-muted-foreground mb-3">
                You have access to all premium features
              </p>

              <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-border/50 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="capitalize">
                      {details?.status || "active"} subscription {details?.plan ? `(${details.plan})` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    <span>{formatMoney(details?.amount, details?.currency || "USD")}/{details?.billingInterval || details?.plan || "period"}</span>
                  </div>
                </div>
                {renewalDate && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>
                      <strong className="text-foreground">{daysUntilRenewal} days left</strong>
                      {details?.cancelAtPeriodEnd ? " until access ends" : " until renewal"}
                    </span>
                  </div>
                )}
                {details?.cancelAtPeriodEnd && (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Your subscription is scheduled to cancel at period end.</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="border-b border-border/50" />

          {/* Manage Subscription */}
          <section className="space-y-3">
            <h3 className="font-medium">Manage Subscription</h3>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
              <div>
                <p className="font-medium text-sm">Update Payment Method</p>
                <p className="text-xs text-muted-foreground">Managed by Dodo Payments</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleUpdatePaymentMethod} disabled={isUpdatingPayment}>
                {isUpdatingPayment ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                <span className="ml-2">Update</span>
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <div>
                <p className="font-medium text-sm text-destructive">Cancel Subscription</p>
                <p className="text-xs text-muted-foreground">
                  Your plan remains active until the billing period ends
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={handleCancelSubscription}
                disabled={isCancelling || details?.cancelAtPeriodEnd}
              >
                {isCancelling && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {details?.cancelAtPeriodEnd ? "Scheduled" : "Cancel"}
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
                      {details.billingHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-4 py-3">{item.paid_at ? new Date(item.paid_at).toLocaleDateString() : "Pending"}</td>
                          <td className="px-4 py-3 capitalize">{item.plan_key || "Premium"}</td>
                          <td className="px-4 py-3 text-right">{formatMoney(item.amount, item.currency || "USD")}</td>
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
