// app/(dashboard)/settings/billing-history/_components/billing-history-section.tsx
// Billing history with flat design

"use client"

import { Receipt, Download, ExternalLink, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data - in real app this would come from server
const invoices = [
  { id: "INV-001", date: "Jan 1, 2026", amount: "$79.99", status: "paid", plan: "Premium Yearly" },
  { id: "INV-002", date: "Jan 1, 2025", amount: "$79.99", status: "paid", plan: "Premium Yearly" },
]

export function BillingHistorySection() {
  const hasInvoices = invoices.length > 0

  return (
    <div className="space-y-6">
      {!hasInvoices ? (
        <div className="py-12 text-center">
          <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No billing history yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your invoices will appear here after you subscribe.
          </p>
        </div>
      ) : (
        <>
          {/* Invoice List */}
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{invoice.id}</span>
                      <Badge variant="secondary" className="text-xs">
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {invoice.date} • {invoice.plan}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="font-medium">{invoice.amount}</span>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Invoices are generated automatically after each billing cycle. Need help with billing? 
              <a href="/support" className="text-primary hover:underline ml-1">Contact support</a>
            </p>
          </div>
        </>
      )}
    </div>
  )
}
