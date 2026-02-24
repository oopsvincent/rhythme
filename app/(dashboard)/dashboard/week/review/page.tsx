import { WeeklyReviewCarousel } from "@/components/dashboard/weekly-review-carousel"

export default function WeeklyReviewPage() {
  return (
    <div className="flex flex-col gap-6 px-4 sm:px-6 py-4 sm:py-6 h-full min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="flex flex-col gap-1 max-w-6xl mx-auto w-full px-2">
        <h1 className="text-2xl font-primary font-bold tracking-tight text-muted-foreground/50">
          Weekly <span className="text-foreground/80">Review</span>
        </h1>
      </header>

      {/* Carousel */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <WeeklyReviewCarousel />
      </div>
    </div>
  )
}