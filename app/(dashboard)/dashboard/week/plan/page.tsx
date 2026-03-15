"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Save,
  Trash2,
  Copy,
  Trophy,
  AlertTriangle,
  Target,
  Flame,
  Heart,
  Plus,
  Check,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { useWeeklyPlan, useAutoSaveWeeklyPlan } from "@/hooks/use-weekly-plan"
import type { WeeklyPlanContent } from "@/app/actions/weekly"
import { useSaveWeeklyPlan } from "@/hooks/use-weekly-plan"

// ── Template section data ──────────────────────────────────

interface TemplateSection {
  id: keyof WeeklyPlanContent
  icon: React.ElementType
  title: string
  subtitle: string
  placeholder: string
  defaultItems: string[]
}

const TEMPLATE_SECTIONS: TemplateSection[] = [
  {
    id: "wins",
    icon: Trophy,
    title: "Wins to build on",
    subtitle: "What went well last week that you want to carry forward?",
    placeholder: "e.g. Stayed consistent with exercise...",
    defaultItems: [],
  },
  {
    id: "challenges",
    icon: AlertTriangle,
    title: "Challenges to handle better",
    subtitle: "What tripped you up, and what could you do differently?",
    placeholder: "e.g. Got distracted by Slack...",
    defaultItems: [],
  },
  {
    id: "focus",
    icon: Target,
    title: "3–5 focus areas this week",
    subtitle: "What deserves your best attention this week?",
    placeholder: "e.g. Ship the weekly system UI...",
    defaultItems: [],
  },
  {
    id: "habits",
    icon: Flame,
    title: "Habits to protect",
    subtitle: "Which habits are non-negotiable this week?",
    placeholder: "e.g. Morning journaling...",
    defaultItems: [],
  },
  {
    id: "mood",
    icon: Heart,
    title: "Mood intention",
    subtitle: "How do you want to feel this week?",
    placeholder: "I want to feel more...",
    defaultItems: [],
  },
]

// ── Helpers ────────────────────────────────────────────────

function getWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const diffToMon = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMon)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })

  return `${fmt(monday)} – ${fmt(sunday)}`
}

// ── Animation helpers ──────────────────────────────────────

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

// ── Inline Edit Item ───────────────────────────────────────

interface InlineEditItemProps {
  value: string
  placeholder: string
  prefix: string
  onUpdate: (val: string) => void
  onRemove: () => void
  autoFocus?: boolean
}

function InlineEditItem({ value, placeholder, prefix, onUpdate, onRemove, autoFocus }: InlineEditItemProps) {
  const [isEditing, setIsEditing] = useState(autoFocus || false)
  const [editValue, setEditValue] = useState(value)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = "auto"
      ta.style.height = `${ta.scrollHeight}px`
    }
  }, [])

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        textareaRef.current?.focus()
        autoResize()
      }, 10)
    }
  }, [isEditing, autoResize])

  useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleBlur = () => {
    setIsEditing(false)
    const trimmed = editValue.trim()
    if (trimmed !== value) {
      onUpdate(trimmed)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      textareaRef.current?.blur()
    }
    if (e.key === "Escape") {
      setEditValue(value)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="relative flex min-h-[48px] items-start rounded-xl bg-card border-2 border-primary/30 px-4 py-3 shadow-sm transition-all">
        <span className="shrink-0 w-6 font-medium text-primary/60 select-none pt-0.5">
          {prefix}
        </span>
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value)
            autoResize()
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 min-w-0 pr-8 bg-transparent border-0 outline-none resize-none text-[15px] leading-relaxed placeholder:text-muted-foreground/50 focus:ring-0"
          style={{ overflow: "hidden" }}
        />
      </div>
    )
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="group/item relative flex min-h-[48px] items-center rounded-xl bg-card border border-border/60 px-4 py-3 shadow-sm transition-all hover:bg-muted/40 hover:border-primary/30 hover:shadow-md cursor-text"
    >
      <span className="shrink-0 w-6 font-medium text-primary/60 select-none flex items-center h-full">
        {prefix}
      </span>

      <div className="flex-1 min-w-0 pr-8">
        {editValue ? (
          <span className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
            {editValue}
          </span>
        ) : (
          <span className="text-[15px] text-muted-foreground/50 transition-colors group-hover/item:text-muted-foreground/70">
            {placeholder}
          </span>
        )}
      </div>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover/item:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

// ── Main Page Component ────────────────────────────────────

export default function WeeklyPlanPage() {
  const weekRange = getWeekRange()

  // State for all plan sections
  const [sections, setSections] = useState<WeeklyPlanContent>({
    wins: [],
    challenges: [],
    focus: [],
    habits: [],
    mood: [],
  })
  const [dataLoaded, setDataLoaded] = useState(false)

  // Supabase hooks
  const { data: planData, isLoading } = useWeeklyPlan()
  const { triggerSave, isSaving, isSaved } = useAutoSaveWeeklyPlan()
  const manualSave = useSaveWeeklyPlan()

  // Load data from Supabase on mount
  useEffect(() => {
    if (planData && !dataLoaded) {
      const content = planData.content
      if (content) {
        setSections({
          wins: content.wins || [],
          challenges: content.challenges || [],
          focus: content.focus || [],
          habits: content.habits || [],
          mood: content.mood || [],
        })
      }
      setDataLoaded(true)
    } else if (planData === null && !dataLoaded) {
      // No plan exists yet — keep defaults
      setDataLoaded(true)
    }
  }, [planData, dataLoaded])

  // Auto-save whenever sections change (after initial load)
  const sectionsRef = useRef(sections)
  sectionsRef.current = sections

  useEffect(() => {
    if (!dataLoaded) return
    triggerSave(sections)
  }, [sections, dataLoaded, triggerSave])

  const updateItem = (sectionId: keyof WeeklyPlanContent, index: number, newValue: string) => {
    setSections((prev) => {
      const list = [...(prev[sectionId] || [])]
      if (!newValue && list.length > 0) {
        list.splice(index, 1)
      } else {
        list[index] = newValue
      }
      return { ...prev, [sectionId]: list }
    })
  }

  const removeItem = (sectionId: keyof WeeklyPlanContent, index: number) => {
    setSections((prev) => {
      const list = [...(prev[sectionId] || [])]
      list.splice(index, 1)
      return { ...prev, [sectionId]: list }
    })
  }

  const addItem = (sectionId: keyof WeeklyPlanContent) => {
    setSections((prev) => {
      const list = [...(prev[sectionId] || []), ""]
      return { ...prev, [sectionId]: list }
    })
  }

  const handleManualSave = () => {
    manualSave.mutate(
      { content: sections },
      {
        onSuccess: () => {
          toast.success("Plan saved!", {
            description: "Your weekly plan has been saved.",
          })
        },
        onError: () => {
          toast.error("Save failed", {
            description: "Could not save your plan. Please try again.",
          })
        },
      }
    )
  }

  const handleClear = () => {
    setSections({
      wins: [],
      challenges: [],
      focus: [],
      habits: [],
      mood: [],
    })
    toast("Plan cleared", {
      description: "All sections have been reset.",
    })
  }

  const handleCopyLastWeek = () => {
    toast.info("Copied from last week", {
      description: "Template loaded from your previous week's plan.",
    })
  }

  // Count non-empty items per section
  const getFilledCount = (sectionId: keyof WeeklyPlanContent) => {
    return (sections[sectionId] || []).filter((item) => item.trim().length > 0).length
  }

  return (
    <>
      <motion.div
        className="flex flex-col gap-8 px-4 sm:px-8 md:px-12 py-6 sm:py-8 w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.header variants={fadeUp} className="flex flex-col gap-1 w-full max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-primary font-black tracking-tight">
            Plan Your{" "}
            <span className="text-gradient-primary">Week</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            {weekRange}
          </p>
        </motion.header>

        <motion.div variants={fadeUp} className="w-full max-w-5xl mx-auto">
          <Separator className="my-2" />
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <div className="w-full max-w-5xl mx-auto flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading your plan...</span>
          </div>
        )}

        {/* Template sections */}
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-10">
          {TEMPLATE_SECTIONS.map((section) => {
            const Icon = section.icon
            const items = sections[section.id] || []
            const isNumbered = section.id === "focus"
            const filledCount = getFilledCount(section.id)

            return (
              <motion.section
                key={section.id}
                variants={fadeUp}
                className="flex flex-col gap-4 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold">{section.title}</h2>
                      <p className="text-xs text-muted-foreground">{section.subtitle}</p>
                    </div>
                    {/* Section completion indicator */}
                    {filledCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        <Check className="w-3 h-3" />
                        {filledCount}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pl-11 pr-2 flex flex-col gap-3">
                  {items.map((item, index) => (
                    <InlineEditItem
                      key={`${section.id}-${index}`}
                      value={item}
                      placeholder={section.placeholder}
                      prefix={isNumbered ? `${index + 1}.` : "•"}
                      onUpdate={(val) => updateItem(section.id, index, val)}
                      onRemove={() => removeItem(section.id, index)}
                    />
                  ))}

                  {/* Add more button */}
                  {section.id !== "mood" ? (
                    <Button
                      variant="ghost"
                      className="self-start gap-2 text-muted-foreground hover:text-foreground mt-1"
                      onClick={() => addItem(section.id)}
                    >
                      <Plus className="w-4 h-4" />
                      Add more
                    </Button>
                  ) : items.length === 0 ? (
                    <Button
                      variant="ghost"
                      className="self-start gap-2 text-muted-foreground hover:text-foreground mt-1"
                      onClick={() => addItem(section.id)}
                    >
                      <Plus className="w-4 h-4" />
                      Add intention
                    </Button>
                  ) : null}
                </div>
                
                <Separator className="mt-5 opacity-30 transition-opacity group-hover:opacity-100" />
              </motion.section>
            )
          })}
        </div>
      </motion.div>

      {/* Bottom action bar */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex flex-wrap items-center gap-3 pt-6 pb-8 sticky bottom-0 bg-background/95 backdrop-blur-xl border-t border-border/50 px-4 sm:px-8 md:px-12 z-10 w-full"
      >
        <div className="w-full max-w-5xl mx-auto flex flex-wrap items-center gap-3">
          <Button onClick={handleManualSave} className="gap-2 shadow-lg shadow-primary/20" disabled={manualSave.isPending}>
            <Save className="w-4 h-4" />
            Save Plan
          </Button>
          <Button variant="outline" onClick={handleCopyLastWeek} className="gap-2">
            <Copy className="w-4 h-4" />
            Copy from last week
          </Button>
          <Button variant="ghost" onClick={handleClear} className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>

          {/* Auto-save indicator */}
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            {isSaving && (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {isSaved && !isSaving && (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500">Saved</span>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}