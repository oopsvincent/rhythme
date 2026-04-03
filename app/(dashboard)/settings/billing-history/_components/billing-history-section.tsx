// app/(dashboard)/settings/billing-history/_components/billing-history-section.tsx
// Billing history with flat design

"use client"

import { Receipt, Download, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BillingHistorySectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoices: any[]
}

export function BillingHistorySection({ invoices }: BillingHistorySectionProps) {
  const hasInvoices = invoices && invoices.length > 0

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
          {/* Invoice List */}
          <div className="space-y-3">
            {invoices.map((invoice, idx) => (
              <div
                key={invoice.id || idx}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Receipt className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">INV-{invoice.id ? invoice.id.slice(0, 6).toUpperCase() : (idx + 1000)}</span>
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-200">
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">
                      {new Date(invoice.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric'})} • {invoice.plan_type} Plan
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="font-medium">${invoice.amount}</span>
                  <Button variant="ghost" size="sm" className="gap-1 shadow-sm">
                    <Download className="h-4 w-4" />
                    Receipt
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Info */}
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
