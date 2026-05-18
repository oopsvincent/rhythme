"use client"

import { Receipt, Download, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BillingHistorySectionProps {
  invoices: {
    id: string
    provider_payment_id?: string | null
    plan_key?: string | null
    amount?: number | string | null
    currency?: string | null
    status: string
    paid_at?: string | null
    receipt_url?: string | null
  }[]
}

export function BillingHistorySection({ invoices }: BillingHistorySectionProps) {
  const hasInvoices = invoices && invoices.length > 0

  const formatMoney = (amount?: number | string | null, currency = "USD") => {
    if (amount == null) return "Managed by Dodo"
    const parsedAmount = typeof amount === "string" ? Number(amount) : amount
    if (!Number.isFinite(parsedAmount)) return "Managed by Dodo"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(parsedAmount)
  }

  return (
    <div className="space-y-6">
      {!hasInvoices ? (
        <div className="py-12 text-center rounded-xl bg-muted/10 border border-border/50">
          <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No billing history yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your invoices will appear here after you subscribe.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Receipt className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        INV-{invoice.provider_payment_id ? invoice.provider_payment_id.slice(-8).toUpperCase() : invoice.id.slice(0, 6).toUpperCase()}
                      </span>
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-200">
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">
                      {invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Processing"} - {invoice.plan_key || "Premium"} Plan
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-medium">{formatMoney(invoice.amount, invoice.currency || "USD")}</span>
                  {invoice.receipt_url ? (
                    <Button variant="ghost" size="sm" className="gap-1 shadow-sm" asChild>
                      <a href={invoice.receipt_url} target="_blank" rel="noreferrer">
                        <Download className="h-4 w-4" />
                        Receipt
                      </a>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="gap-1 shadow-sm" disabled>
                      <Download className="h-4 w-4" />
                      Receipt
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/30 border border-border/50">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Invoices are generated automatically after each billing cycle. Need help with billing?
              <a href="mailto:support@rhythme.io" className="text-primary font-medium hover:underline ml-1">Contact support</a>
            </p>
          </div>
        </>
      )}
    </div>
  )
}
