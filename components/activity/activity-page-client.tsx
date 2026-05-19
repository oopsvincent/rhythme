"use client"

import { useDeferredValue, useEffect, useMemo, useState, useCallback, startTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { format, parseISO, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import {
  CalendarDays,
  CheckCheck,
  Flame,
  Heart,
  Loader2,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Crown,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { usePremium } from "@/hooks/use-premium"
import { fetchInsightsAction } from "@/app/actions/ml"

import {
  ACTIVITY_TYPE_OPTIONS,
  type ActivityDaySummary,
  type ActivityRange,
  type ActivitySummaryStats,
  type ActivityType,
  filterActivityDays,
  getDateKey,
} from "@/lib/activity"
import { getMoodOption } from "@/lib/mood"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-mobile"

interface ActivityPageClientProps {
  days: ActivityDaySummary[]
  range: ActivityRange
  summary: ActivitySummaryStats
}

interface NormalizedInsight {
  id: string
  sentence: string
  strength?: "Strong" | "Moderate"
  explanation?: string
}

const ACTIVITY_CALENDAR_CLASS_NAMES = {
  root: "w-full",
  months: "relative w-full flex flex-col",
  month: "w-full gap-3 flex flex-col",
  nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
  month_caption: "relative flex h-10 w-full items-center justify-center px-10",
  button_previous: "size-8 p-0",
  button_next: "size-8 p-0",
  table: "w-full border-collapse",
  weekdays: "flex w-full",
  weekday: "w-[calc(100%/7)] flex h-8 items-center justify-center text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground/70",
  week: "flex w-full mt-2",
  day: "relative w-[calc(100%/7)] aspect-square p-0 text-center",
}

const RANGE_PRESETS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
] as const

export function ActivityPageClient({
  days,
  range,
  summary,
}: ActivityPageClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  const { isPremium } = usePremium()

  const [typeFilter, setTypeFilter] = useState<ActivityType>("all")
  const [search, setSearch] = useState("")
  const [selectedDate, setSelectedDate] = useState<string>(days.find((day) => day.totalEvents > 0)?.date ?? range.to)
  const [timelineDialogDate, setTimelineDialogDate] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("timeline")
  const [currentMonth, setCurrentMonth] = useState<Date>(range.toDate)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const deferredSearch = useDeferredValue(search)

  const filteredDays = useMemo(() => {
    return filterActivityDays(days, { type: typeFilter, search: deferredSearch })
  }, [days, deferredSearch, typeFilter])

  const filteredDayMap = useMemo(() => {
    return new Map(filteredDays.map((day) => [day.date, day]))
  }, [filteredDays])

  useEffect(() => {
    if (!filteredDayMap.size) {
      setSelectedDate(range.to)
      return
    }

    if (!filteredDayMap.has(selectedDate)) {
      setSelectedDate(filteredDays[0].date)
    }
  }, [filteredDayMap, filteredDays, range.to, selectedDate])

  const selectedDay = filteredDayMap.get(selectedDate) ?? filteredDays[0] ?? days.find((day) => day.date === selectedDate) ?? null
  const timelineDialogDay = timelineDialogDate ? days.find((day) => day.date === timelineDialogDate) ?? null : null

  const heatmapLevels = useMemo(() => {
    const activeDays = filteredDays.filter((day) => day.totalEvents > 0)
    const maxEvents = Math.max(...activeDays.map((day) => day.totalEvents), 0)

    return activeDays.reduce(
      (acc, day) => {
        if (maxEvents === 0) return acc
        const ratio = day.totalEvents / maxEvents
        const bucket =
          ratio >= 0.75 ? "high" :
          ratio >= 0.45 ? "medium" :
          ratio >= 0.2 ? "low" :
          "soft"
        acc[bucket].push(parseISO(`${day.date}T12:00:00`))
        return acc
      },
      {
        soft: [] as Date[],
        low: [] as Date[],
        medium: [] as Date[],
        high: [] as Date[],
      }
    )
  }, [filteredDays])

  const applyRange = (nextRange: DateRange | undefined) => {
    if (!nextRange?.from || !nextRange.to) return

    const params = new URLSearchParams(searchParams.toString())
    params.set("from", format(nextRange.from, "yyyy-MM-dd"))
    params.set("to", format(nextRange.to, "yyyy-MM-dd"))

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-3 py-4 sm:px-4 md:py-6 lg:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold tracking-tight">Activity</h1>
          <p className="text-sm text-muted-foreground">
            A single, calm place to revisit how your days have been unfolding.
          </p>
        </div>

        <div className="hidden flex-wrap items-center gap-3 md:flex">
          <ActivityDateRangePicker range={range} onApply={applyRange} />
          <ActivityTypeSelect value={typeFilter} onChange={setTypeFilter} />
          <div className="relative min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notes, tasks, or entries"
              className="h-10 rounded-xl border-border/60 bg-background/70 pl-9 shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ActivityDateRangePicker range={range} onApply={applyRange} compact />
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-10 rounded-xl border-border/60 px-4">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] rounded-t-[28px] border-border/60">
              <SheetHeader>
                <SheetTitle>Refine activity</SheetTitle>
                <SheetDescription>
                  Adjust the range, type, and search terms without leaving this page.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Type</div>
                  <ActivityTypeSelect value={typeFilter} onChange={setTypeFilter} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Search</div>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search your activity"
                      className="h-11 rounded-xl border-border/60 bg-background/70 pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Date range</div>
                  <ActivityDateRangePanel range={range} onApply={(nextRange) => {
                    applyRange(nextRange)
                    setMobileFiltersOpen(false)
                  }} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
        <ActivitySummaryRail summary={summary} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-4">
          <TabsList className="h-11 w-full justify-start rounded-2xl bg-muted/60 p-1 md:w-auto">
            <TabsTrigger value="timeline" className="rounded-xl px-4">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="calendar" className="rounded-xl px-4">
              Calendar
            </TabsTrigger>
            <TabsTrigger value="insights" className="rounded-xl px-4 flex items-center gap-1.5">
              Insights
              {!isPremium && (
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase tracking-wider text-primary border-primary/20 bg-primary/10">
                  Premium
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <TimelineTab
              days={filteredDays}
              onOpenDay={(date) => setTimelineDialogDate(date)}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarTab
              filteredDays={filteredDays}
              range={range}
              selectedDate={selectedDate}
              selectedDay={selectedDay}
              currentMonth={currentMonth}
              onDateSelect={(date) => {
                const key = getDateKey(date)
                if (filteredDayMap.has(key)) setSelectedDate(key)
              }}
              onMonthChange={setCurrentMonth}
              heatmapLevels={heatmapLevels}
              isMobile={isMobile}
            />
          </TabsContent>

          <TabsContent value="insights">
            <InsightsTab loggedDays={summary.loggedDays} range={range} isPremium={isPremium} />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={Boolean(timelineDialogDay)} onOpenChange={(open) => !open && setTimelineDialogDate(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-[28px] border-border/60 p-0 sm:max-w-2xl">
          {timelineDialogDay ? <DayDetail day={timelineDialogDay} /> : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ActivitySummaryRail({ summary }: { summary: ActivitySummaryStats }) {
  const stats = [
    {
      label: "Completion rate",
      value: summary.completionRate !== null ? `${summary.completionRate}%` : "—",
      icon: CheckCheck,
    },
    {
      label: "Avg mood",
      value: summary.averageMood !== null ? summary.averageMood.toFixed(1) : "—",
      icon: Heart,
    },
    {
      label: "Logged days",
      value: String(summary.loggedDays),
      icon: CalendarDays,
    },
    {
      label: "Current streak",
      value: `${summary.currentStreak} day${summary.currentStreak === 1 ? "" : "s"}`,
      icon: Flame,
    },
  ]

  return (
    <aside className="hidden xl:block">
      <Card className="sticky top-6 gap-0 rounded-[28px] border-border/60 bg-card/70 py-0 shadow-sm backdrop-blur-sm">
        <CardHeader className="gap-1 border-b border-border/50 py-6">
          <CardTitle className="text-base">Period summary</CardTitle>
          <CardDescription>Quiet signals from this range.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 py-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/50 bg-background/60 p-4"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/8 text-primary">
                <stat.icon className="h-4 w-4" />
              </div>
              <div className="text-xl font-semibold tracking-tight">{stat.value}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  )
}

function ActivityTypeSelect({
  value,
  onChange,
  className,
}: {
  value: ActivityType
  onChange: (value: ActivityType) => void
  className?: string
}) {
  return (
    <Select value={value} onValueChange={(nextValue) => onChange(nextValue as ActivityType)}>
      <SelectTrigger className={cn("h-10 min-w-[168px] rounded-xl border-border/60 bg-background/70 shadow-sm", className)}>
        <SelectValue placeholder="Filter by type" />
      </SelectTrigger>
      <SelectContent>
        {ACTIVITY_TYPE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ActivityDateRangePicker({
  range,
  onApply,
  compact = false,
}: {
  range: ActivityRange
  onApply: (range: DateRange | undefined) => void
  compact?: boolean
}) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  const trigger = (
    <Button
      variant="outline"
      className={cn(
        "h-10 rounded-xl border-border/60 bg-background/70 shadow-sm",
        compact ? "px-4" : "min-w-[220px] justify-between px-4"
      )}
    >
      <span className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4" />
        {compact ? "Range" : formatRangeLabel(range)}
      </span>
    </Button>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-[28px] border-border/60">
          <SheetHeader>
            <SheetTitle>Date range</SheetTitle>
            <SheetDescription>
              Choose the window you want to explore.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">
            <ActivityDateRangePanel
              range={range}
              onApply={(nextRange) => {
                onApply(nextRange)
                setOpen(false)
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(100vw-1rem,22rem)] rounded-[24px] border-border/60 p-0 sm:w-auto"
      >
        <ActivityDateRangePanel
          range={range}
          onApply={(nextRange) => {
            onApply(nextRange)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

function ActivityDateRangePanel({
  range,
  onApply,
}: {
  range: ActivityRange
  onApply: (range: DateRange | undefined) => void
}) {
  const [draftRange, setDraftRange] = useState<DateRange | undefined>({
    from: range.fromDate,
    to: range.toDate,
  })

  useEffect(() => {
    setDraftRange({ from: range.fromDate, to: range.toDate })
  }, [range.fromDate, range.toDate])

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap gap-2">
        {RANGE_PRESETS.map((preset) => (
          <Button
            key={preset.days}
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full border-border/60"
            onClick={() => {
              const to = new Date()
              const from = subDays(to, preset.days - 1)
              setDraftRange({ from, to })
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <Calendar
        mode="range"
        required={false}
        selected={draftRange}
        onSelect={setDraftRange}
        defaultMonth={range.toDate}
        numberOfMonths={1}
        className="[--cell-size:2rem] w-full max-w-full overflow-hidden rounded-2xl border border-border/50 bg-background/60 p-1.5 sm:[--cell-size:2.25rem] sm:p-3"
        classNames={ACTIVITY_CALENDAR_CLASS_NAMES}
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {draftRange?.from && draftRange.to ? formatRangeLabel({
            ...range,
            fromDate: draftRange.from,
            toDate: draftRange.to,
            from: format(draftRange.from, "yyyy-MM-dd"),
            to: format(draftRange.to, "yyyy-MM-dd"),
            dayCount: Math.floor((draftRange.to.getTime() - draftRange.from.getTime()) / 86_400_000) + 1,
          }) : "Choose a start and end date"}
        </div>
        <Button
          className="w-full rounded-xl sm:w-auto"
          disabled={!draftRange?.from || !draftRange.to}
          onClick={() => onApply(draftRange)}
        >
          Apply
        </Button>
      </div>
    </div>
  )
}

function TimelineTab({
  days,
  onOpenDay,
}: {
  days: ActivityDaySummary[]
  onOpenDay: (date: string) => void
}) {
  if (days.length === 0) {
    return (
      <Empty className="rounded-[28px] border-border/60 bg-card/60 py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Search className="h-5 w-5" />
          </EmptyMedia>
          <EmptyTitle>No matching activity</EmptyTitle>
          <EmptyDescription>
            Try widening your date range or removing a filter to bring more history back into view.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      {days.map((day) => {
        const mood = day.moodLog ? getMoodOption(Number(day.moodLog.mood_score)) : null
        const journalPreview = day.journalEntries[0]?.preview ?? null

        return (
          <button
            key={day.date}
            type="button"
            onClick={() => onOpenDay(day.date)}
            className="w-full rounded-[28px] border border-border/60 bg-card/70 p-5 text-left shadow-sm transition-colors hover:border-border hover:bg-card"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div>
                  <div className="text-lg font-semibold tracking-tight">
                    {format(parseISO(`${day.date}T12:00:00`), "EEEE, MMMM d")}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {day.totalEvents} signal{day.totalEvents === 1 ? "" : "s"} captured
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <SummaryPill icon={CheckCheck} label={`${day.completedTasks.length} tasks`} />
                  <SummaryPill
                    icon={Flame}
                    label={`${day.habitsChecked.reduce((sum, habit) => sum + habit.count, 0)} habits`}
                  />
                  <SummaryPill icon={Timer} label={`${day.focusMinutes} focus min`} />
                  {mood ? (
                    <Badge
                      variant="outline"
                      className={cn("rounded-full border px-3 py-1", mood.border, mood.softAccent, mood.text)}
                    >
                      <mood.icon className="h-3.5 w-3.5" />
                      {mood.label}
                    </Badge>
                  ) : null}
                </div>
              </div>

              {journalPreview ? (
                <div className="max-w-xl text-sm leading-6 text-muted-foreground">
                  {journalPreview}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No journal note saved for this day.</div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function CalendarTab({
  filteredDays,
  range,
  selectedDate,
  selectedDay,
  currentMonth,
  onDateSelect,
  onMonthChange,
  heatmapLevels,
  isMobile,
}: {
  filteredDays: ActivityDaySummary[]
  range: ActivityRange
  selectedDate: string
  selectedDay: ActivityDaySummary | null
  currentMonth: Date
  onDateSelect: (date: Date) => void
  onMonthChange: (date: Date) => void
  heatmapLevels: { soft: Date[]; low: Date[]; medium: Date[]; high: Date[] }
  isMobile: boolean
}) {
  const activeDates = useMemo(() => {
    return new Set(filteredDays.map((day) => day.date))
  }, [filteredDays])

  return (
    <div className="flex flex-col gap-6 xl:grid xl:grid-cols-[minmax(0,1fr)_320px]">
      {isMobile && (
        <div className="space-y-4">
          <DayPanel day={selectedDay} compact />
        </div>
      )}

      <Card className="rounded-[28px] border-border/60 bg-card/70 py-0 shadow-sm">
        <CardHeader className="border-b border-border/50 py-6">
          <CardTitle className="text-lg">Calendar</CardTitle>
          <CardDescription>Tap a day to open its full summary.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden px-2 py-4 sm:px-6 sm:py-6">
          <Calendar
            mode="single"
            month={currentMonth}
            onMonthChange={onMonthChange}
            selected={selectedDate ? parseISO(`${selectedDate}T12:00:00`) : undefined}
            onSelect={(date) => date && onDateSelect(date)}
            defaultMonth={range.toDate}
            startMonth={range.fromDate}
            endMonth={range.toDate}
            disabled={(date) => !activeDates.has(getDateKey(date))}
            modifiers={{
              soft: heatmapLevels.soft,
              low: heatmapLevels.low,
              medium: heatmapLevels.medium,
              high: heatmapLevels.high,
            }}
            modifiersClassNames={{
              soft: "bg-primary/8 text-foreground hover:bg-primary/10",
              low: "bg-primary/15 text-foreground hover:bg-primary/20",
              medium: "bg-primary/30 text-foreground hover:bg-primary/35",
              high: "bg-primary text-primary-foreground hover:bg-primary/90",
            }}
            className="[--cell-size:2rem] w-full max-w-full overflow-hidden rounded-2xl border border-border/50 bg-background/60 p-1.5 sm:[--cell-size:2.5rem] sm:p-4"
            classNames={ACTIVITY_CALENDAR_CLASS_NAMES}
          />

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:mt-5">
            <span>Less</span>
            <div className="h-3 w-3 rounded-sm bg-primary/8" />
            <div className="h-3 w-3 rounded-sm bg-primary/15" />
            <div className="h-3 w-3 rounded-sm bg-primary/30" />
            <div className="h-3 w-3 rounded-sm bg-primary" />
            <span>More</span>
          </div>
        </CardContent>
      </Card>

      {!isMobile && (
        <div className="space-y-4">
          <DayPanel day={selectedDay} compact />
        </div>
      )}
    </div>
  )
}

function InsightsTab({
  loggedDays,
  range,
  isPremium,
}: {
  loggedDays: number
  range: ActivityRange
  isPremium: boolean
}) {
  const [insights, setInsights] = useState<NormalizedInsight[]>([])
  const [isLoading, setIsLoading] = useState(loggedDays >= 14)
  const [error, setError] = useState<string | null>(null)

  const loadInsights = useCallback(async () => {
    if (!isPremium) {
      setInsights([])
      setError(null)
      setIsLoading(false)
      return
    }

    if (loggedDays < 14) {
      setInsights([])
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchInsightsAction({
        from: range.from,
        to: range.to,
      })

      if (result.message && (!result.insights || result.insights.length === 0)) {
        setError(result.message)
        setInsights([])
      } else {
        setInsights(normalizeInsights(result))
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "We couldn't refresh your insights.")
      setInsights([])
    } finally {
      setIsLoading(false)
    }
  }, [loggedDays, range.from, range.to])

  useEffect(() => {
    void loadInsights()
  }, [loadInsights])

  if (!isPremium) {
    return (
      <Empty className="rounded-[28px] border-border/60 bg-card/60 py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-primary/10 border-primary/20 text-primary mb-4">
            <Sparkles className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>Unlock Behavioral Patterns</EmptyTitle>
          <EmptyDescription className="max-w-md mx-auto mb-4">
            Understand your personal productivity rhythm.
            <ul className="mt-4 space-y-2 text-left">
              <li className="flex items-center gap-2 text-foreground"><CheckCheck className="w-4 h-4 text-primary" /> Discover which habits improve your mood</li>
              <li className="flex items-center gap-2 text-foreground"><CheckCheck className="w-4 h-4 text-primary" /> See when you focus best</li>
              <li className="flex items-center gap-2 text-foreground"><CheckCheck className="w-4 h-4 text-primary" /> Know what affects your task completion</li>
              <li className="flex items-center gap-2 text-foreground"><CheckCheck className="w-4 h-4 text-primary" /> Get actionable statistical insights</li>
            </ul>
          </EmptyDescription>
          <Button asChild className="mt-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Link href="/settings/subscription">
              <Crown className="w-4 h-4 mr-2" /> Upgrade to Premium
            </Link>
          </Button>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-[28px] border border-border/60 bg-card/70 p-5 shadow-sm sm:p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Behavioral Patterns</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Statistical correlations from your logs
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl border-border/60"
          onClick={() => void loadInsights()}
          disabled={isLoading || loggedDays < 14}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh Insights
        </Button>
      </div>

      {loggedDays < 14 ? (
        <Empty className="rounded-[28px] border-border/60 bg-card/60 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Sparkles className="h-5 w-5" />
            </EmptyMedia>
            <EmptyTitle>More consistency unlocks stronger patterns.</EmptyTitle>
            <EmptyDescription>
              Keep logging for at least 14 active days and this space will start surfacing stable correlations.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-[28px]" />
          ))}
        </div>
      ) : error ? (
        <Card className="rounded-[28px] border-border/60 bg-card/70 shadow-sm">
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      ) : insights.length === 0 ? (
        <Empty className="rounded-[28px] border-border/60 bg-card/60 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Sparkles className="h-5 w-5" />
            </EmptyMedia>
            <EmptyTitle>No clear pattern surfaced yet</EmptyTitle>
            <EmptyDescription>
              Your recent data is valid, but nothing strong enough stood out in this window.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="group overflow-hidden rounded-[24px] border-border/40 bg-gradient-to-br from-card/80 to-card/40 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start md:justify-between">
                  <div className="flex gap-4 items-start flex-1">
                    <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10 text-primary mt-0.5 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[15px] font-medium leading-relaxed text-foreground/90">{insight.sentence}</p>
                      {insight.explanation && (
                        <p className="text-sm leading-relaxed text-muted-foreground">{insight.explanation}</p>
                      )}
                    </div>
                  </div>
                  {insight.strength && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 sm:mt-1",
                        insight.strength === "Strong"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                      )}
                    >
                      {insight.strength}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function DayPanel({
  day,
  compact = false,
}: {
  day: ActivityDaySummary | null
  compact?: boolean
}) {
  if (!day) {
    return (
      <Card className="rounded-[28px] border-border/60 bg-card/70 shadow-sm">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Select an active day to inspect its details.
        </CardContent>
      </Card>
    )
  }

  const mood = day.moodLog ? getMoodOption(Number(day.moodLog.mood_score)) : null

  return (
    <Card className="rounded-[28px] border-border/60 bg-card/70 py-0 shadow-sm">
      <CardHeader className="border-b border-border/50 py-6">
        <CardTitle className="text-lg">{format(parseISO(`${day.date}T12:00:00`), "EEEE, MMM d")}</CardTitle>
        <CardDescription>{day.totalEvents} signals recorded</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 py-6">
        {mood ? (
          <div className={cn("rounded-2xl border p-4", mood.border, mood.softAccent)}>
            <div className="flex items-center gap-2 text-sm font-medium">
              <mood.icon className={cn("h-4 w-4", mood.text)} />
              <span className={mood.text}>{mood.label}</span>
            </div>
            {day.moodLog?.note ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{day.moodLog.note}</p>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <MetricCard label="Tasks completed" value={String(day.completedTasks.length)} icon={CheckCheck} />
          <MetricCard label="Habits checked" value={String(day.habitsChecked.reduce((sum, habit) => sum + habit.count, 0))} icon={Flame} />
          <MetricCard label="Journal entries" value={String(day.journalEntries.length)} icon={Sparkles} />
          <MetricCard label="Focus minutes" value={String(day.focusMinutes)} icon={Timer} />
        </div>

        <div className={cn("space-y-4", compact ? "" : "pt-2")}>
          {day.completedTasks.length > 0 ? (
            <DetailSection
              title="Completed tasks"
              items={day.completedTasks.map((task) => task.title)}
            />
          ) : null}
          {day.habitsChecked.length > 0 ? (
            <DetailSection
              title="Habits"
              items={day.habitsChecked.map((habit) => `${habit.name} · ${habit.count}/${habit.targetCount}`)}
            />
          ) : null}
          {day.journalEntries.length > 0 ? (
            <DetailSection
              title="Journal"
              items={day.journalEntries.map((entry) => entry.preview)}
            />
          ) : null}
          {day.focusSessions.length > 0 ? (
            <DetailSection
              title="Focus sessions"
              items={day.focusSessions.map((session) => {
                const label = session.taskTitle ?? session.customTaskText ?? "Focus session"
                return `${label} · ${session.minutes} min`
              })}
            />
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function DayDetail({ day }: { day: ActivityDaySummary }) {
  return (
    <div className="p-6">
      <DialogHeader className="mb-6 text-left">
        <DialogTitle className="text-2xl font-semibold tracking-tight">
          {format(parseISO(`${day.date}T12:00:00`), "EEEE, MMMM d")}
        </DialogTitle>
        <DialogDescription>
          A complete look at everything you logged that day.
        </DialogDescription>
      </DialogHeader>
      <DayPanel day={day} />
    </div>
  )
}

function SummaryPill({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-sm text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  )
}

function DetailSection({
  title,
  items,
}: {
  title: string
  items: string[]
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{title}</div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={`${title}-${index}`}
            className="rounded-2xl border border-border/50 bg-background/50 px-4 py-3 text-sm leading-6 text-foreground/90"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

function normalizeInsights(payload: unknown): NormalizedInsight[] {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { insights?: unknown[] } | null)?.insights)
      ? (payload as { insights: unknown[] }).insights
      : Array.isArray((payload as { data?: { insights?: unknown[] } } | null)?.data?.insights)
        ? (payload as { data: { insights: unknown[] } }).data.insights
        : Array.isArray((payload as { data?: unknown[] } | null)?.data)
          ? (payload as { data: unknown[] }).data
          : []

  return source
    .map((item, index) => normalizeInsightItem(item, index))
    .filter((item): item is NormalizedInsight => Boolean(item))
}

function normalizeInsightItem(item: unknown, index: number): NormalizedInsight | null {
  if (!item) return null

  if (typeof item === "string") {
    return {
      id: `insight-${index}-${item.substring(0, 10)}`,
      sentence: item,
    }
  }

  if (typeof item !== "object") return null

  const record = item as Record<string, unknown>
  const sentence = getString(record.sentence) ?? getString(record.insight) ?? getString(record.headline) ?? getString(record.title)
  const explanation = getString(record.explanation) ?? getString(record.detail) ?? getString(record.reasoning) ?? getString(record.description)

  if (!sentence || !explanation) return null

  const rawStrength = getString(record.strength) ?? getString(record.correlation_strength)
  const strengthValue = typeof record.score === "number" ? record.score : typeof record.strength_score === "number" ? record.strength_score : null
  const strength =
    rawStrength?.toLowerCase().includes("strong") || (strengthValue !== null && strengthValue >= 0.65)
      ? "Strong"
      : "Moderate"

  return {
    id: `insight-${index}-${sentence}`,
    sentence,
    strength,
    explanation,
  }
}

function getString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function formatRangeLabel(range: ActivityRange) {
  return `${format(range.fromDate, "MMM d")} – ${format(range.toDate, "MMM d")}`
}
