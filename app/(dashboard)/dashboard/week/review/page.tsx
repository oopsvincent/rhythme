import { SiteHeader } from "@/components/site-header"
import { WeeklyReviewCarousel } from "@/components/dashboard/weekly-review-carousel"

export default function WeeklyReviewPage() {
  return (
    <div className="flex flex-col gap-6 px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <header className="flex flex-col gap-1 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-primary font-black tracking-tight">
          Review Your{" "}
          <span className="text-gradient-accent">Week</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          A guided reflection — 5 steps to close the loop.
        </p>
      </header>

      {/* Carousel */}
      <WeeklyReviewCarousel />
    </div>
  )
}