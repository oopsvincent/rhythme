"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
  PenLine,
} from "lucide-react"
import { toast } from "sonner"
import { SiteHeader } from "@/components/site-header"

// ── Template section data ──────────────────────────────────

interface TemplateSection {
  id: string
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
    defaultItems: [
      "Completed all high-priority tasks by Wednesday",
      "Maintained 5-day meditation streak",
      "Had a great brainstorm session with the team",
    ],
  },
  {
    id: "challenges",
    icon: AlertTriangle,
    title: "Challenges to handle better",
    subtitle: "What tripped you up, and what could you do differently?",
    placeholder: "e.g. Got distracted by Slack...",
    defaultItems: [
      "Afternoon focus dips on Mon/Wed — try blocking 2-4pm",
      "Said yes to too many meetings",
      "", // Empty box
    ],
  },
  {
    id: "focus",
    icon: Target,
    title: "3–5 focus areas this week",
    subtitle: "What deserves your best attention this week?",
    placeholder: "e.g. Ship the weekly system UI...",
    defaultItems: [
      "Ship the weekly system UI",
      "Review pull requests backlog",
      "Prepare Thursday presentation",
    ],
  },
  {
    id: "habits",
    icon: Flame,
    title: "Habits to protect",
    subtitle: "Which habits are non-negotiable this week?",
    placeholder: "e.g. Morning journaling...",
    defaultItems: [
      "Morning meditation (10 min)",
      "Daily reading (20 min)",
      "No phone after 10pm",
    ],
  },
  {
    id: "mood",
    icon: Heart,
    title: "Mood intention",
    subtitle: "How do you want to feel this week?",
    placeholder: "I want to feel more...",
    defaultItems: [
      "I want to feel more grounded and less reactive to distractions.",
    ],
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

// ── Modal Component ────────────────────────────────────────

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (val: string) => void
  initialValue: string
  title: string
  placeholder: string
}

function EditItemModal({ isOpen, onClose, onSave, initialValue, title, placeholder }: EditModalProps) {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen, initialValue])

  if (!isOpen) return null

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSave(value)
    }
    if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="mx-4 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <PenLine className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-primary text-xl font-bold">{title}</h2>
            </div>
          </div>

          <Textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[120px] resize-none text-base bg-muted/30 focus-visible:ring-primary/20 border-border/50"
          />
          <p className="text-xs text-muted-foreground mt-2 text-right">Press Enter to save, Shift+Enter for new line</p>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={() => onSave(value)} className="flex-1">
              Save
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Main Page Component ────────────────────────────────────

export default function WeeklyPlanPage() {
  const weekRange = getWeekRange()

  // State maps sectionId -> string[]
  const [sections, setSections] = useState<Record<string, string[]>>(
    Object.fromEntries(TEMPLATE_SECTIONS.map((s) => [s.id, s.defaultItems]))
  )

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    sectionId: string
    itemIndex: number
    title: string
    placeholder: string
    value: string
  }>({
    isOpen: false,
    sectionId: "",
    itemIndex: -1,
    title: "",
    placeholder: "",
    value: "",
  })

  const openModal = (sectionId: string, itemIndex: number, title: string, placeholder: string) => {
    const list = sections[sectionId] || []
    setModalState({
      isOpen: true,
      sectionId,
      itemIndex,
      title,
      placeholder,
      value: itemIndex >= list.length ? "" : list[itemIndex],
    })
  }

  const handleModalSave = (newValue: string) => {
    const { sectionId, itemIndex } = modalState
    setSections((prev) => {
      const list = [...(prev[sectionId] || [])]
      
      if (itemIndex >= list.length) {
        // Adding new item
        if (newValue.trim()) {
          list.push(newValue.trim())
        }
      } else {
        // Updating existing item
        if (!newValue.trim()) {
          list[itemIndex] = ""
        } else {
          list[itemIndex] = newValue.trim()
        }
      }

      return { ...prev, [sectionId]: list }
    })
    setModalState((s) => ({ ...s, isOpen: false }))
  }

  const removeItem = (e: React.MouseEvent, sectionId: string, index: number) => {
    e.stopPropagation()
    setSections((prev) => {
      const list = [...(prev[sectionId] || [])]
      list.splice(index, 1)
      return { ...prev, [sectionId]: list }
    })
  }

  const handleSave = () => {
    toast.success("Plan saved!", {
      description: "Your weekly plan has been saved.",
    })
  }

  const handleClear = () => {
    setSections(
      Object.fromEntries(
        TEMPLATE_SECTIONS.map((s) => {
          const count = s.id === "mood" ? 1 : 3
          return [s.id, Array(count).fill("")]
        })
      )
    )
    toast("Plan cleared", {
      description: "All sections have been reset.",
    })
  }

  const handleCopyLastWeek = () => {
    toast.info("Copied from last week", {
      description: "Template loaded from your previous week's plan.",
    })
    setSections(
      Object.fromEntries(TEMPLATE_SECTIONS.map((s) => [s.id, s.defaultItems]))
    )
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

        {/* Template sections */}
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-10">
          {TEMPLATE_SECTIONS.map((section) => {
            const Icon = section.icon
            const items = sections[section.id] || []
            const isNumbered = section.id === "focus"

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
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">{section.title}</h2>
                    <p className="text-xs text-muted-foreground">{section.subtitle}</p>
                  </div>
                </div>

                <div className="pl-11 pr-2 flex flex-col gap-3">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => openModal(section.id, index, `Edit item`, section.placeholder)}
                      className="group/item relative flex min-h-[48px] items-center rounded-xl bg-card border border-border/60 px-4 py-3 shadow-sm transition-all hover:bg-muted/40 hover:border-primary/30 hover:shadow-md cursor-text"
                    >
                      {/* Prefix (bullet/number) */}
                      <span className="shrink-0 w-6 font-medium text-primary/60 select-none flex items-center h-full">
                        {isNumbered ? `${index + 1}.` : "•"}
                      </span>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-8">
                        {item ? (
                          <span className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                            {item}
                          </span>
                        ) : (
                          <span className="text-[15px] text-muted-foreground/50 transition-colors group-hover/item:text-muted-foreground/70">
                            {section.placeholder}
                          </span>
                        )}
                      </div>

                      {/* Delete button (only show on hover if not the very last empty item) */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover/item:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => removeItem(e, section.id, index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Add more button */}
                  {section.id !== "mood" && (
                    <Button
                      variant="ghost"
                      className="self-start gap-2 text-muted-foreground hover:text-foreground mt-1"
                      onClick={() => openModal(section.id, items.length, `Add to ${section.title}`, section.placeholder)}
                    >
                      <Plus className="w-4 h-4" />
                      Add more
                    </Button>
                  )}
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
          <Button onClick={handleSave} className="gap-2 shadow-lg shadow-primary/20">
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
        </div>
      </motion.div>

      {/* Edit Modal */}
      <EditItemModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((s) => ({ ...s, isOpen: false }))}
        onSave={handleModalSave}
        initialValue={modalState.value}
        title={modalState.title}
        placeholder={modalState.placeholder}
      />
    </>
  )
}