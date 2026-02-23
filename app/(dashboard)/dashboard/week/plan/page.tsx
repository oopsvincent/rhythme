"use client"

import { useState } from "react"
import { motion, Variants } from "framer-motion"
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
} from "lucide-react"
import { toast } from "sonner"

// ── Template section data ──────────────────────────────────

interface TemplateSection {
  id: string
  icon: React.ElementType
  title: string
  subtitle: string
  placeholder: string
  defaultValue: string
}

const TEMPLATE_SECTIONS: TemplateSection[] = [
  {
    id: "wins",
    icon: Trophy,
    title: "Wins to build on",
    subtitle: "What went well last week that you want to carry forward?",
    placeholder: "e.g. Stayed consistent with exercise, finished the design spec on time...",
    defaultValue:
      "- Completed all high-priority tasks by Wednesday\n- Maintained 5-day meditation streak\n- Had a great brainstorm session with the team",
  },
  {
    id: "challenges",
    icon: AlertTriangle,
    title: "Challenges to handle better",
    subtitle: "What tripped you up, and what could you do differently?",
    placeholder: "e.g. Got distracted by Slack, skipped lunch too often...",
    defaultValue:
      "- Afternoon focus dips on Mon/Wed — try blocking 2-4pm\n- Said yes to too many meetings",
  },
  {
    id: "focus",
    icon: Target,
    title: "3–5 focus areas this week",
    subtitle: "What deserves your best attention this week?",
    placeholder: "1. \n2. \n3. ",
    defaultValue:
      "1. Ship the weekly system UI\n2. Review pull requests backlog\n3. Prepare Thursday presentation\n4. Exercise at least 4 days",
  },
  {
    id: "habits",
    icon: Flame,
    title: "Habits to protect",
    subtitle: "Which habits are non-negotiable this week?",
    placeholder: "e.g. Morning journaling, 8h sleep, daily walk...",
    defaultValue:
      "- Morning meditation (10 min)\n- Daily reading (20 min)\n- No phone after 10pm",
  },
  {
    id: "mood",
    icon: Heart,
    title: "Mood intention",
    subtitle: "How do you want to feel this week?",
    placeholder: "I want to feel more...",
    defaultValue: "I want to feel more grounded and less reactive to distractions.",
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

// ── Component ──────────────────────────────────────────────

export default function WeeklyPlanPage() {
  const weekRange = getWeekRange()

  // State for each section
  const [sections, setSections] = useState<Record<string, string>>(
    Object.fromEntries(TEMPLATE_SECTIONS.map((s) => [s.id, s.defaultValue]))
  )

  const updateSection = (id: string, value: string) => {
    setSections((prev) => ({ ...prev, [id]: value }))
  }

  const handleSave = () => {
    toast.success("Plan saved!", {
      description: "Your weekly plan has been saved.",
    })
  }

  const handleClear = () => {
    setSections(
      Object.fromEntries(TEMPLATE_SECTIONS.map((s) => [s.id, ""]))
    )
    toast("Plan cleared", {
      description: "All sections have been reset.",
    })
  }

  const handleCopyLastWeek = () => {
    toast.info("Copied from last week", {
      description: "Template loaded from your previous week's plan.",
    })
  }

  return (
    <motion.div
      className="flex flex-col gap-6 px-4 sm:px-6 py-6 sm:py-8 max-w-3xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.header variants={fadeUp} className="flex flex-col gap-1">
        <h1 className="text-3xl sm:text-4xl font-primary font-black tracking-tight">
          Plan Your{" "}
          <span className="text-gradient-primary">Week</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          {weekRange}
        </p>
      </motion.header>

      <motion.div variants={fadeUp}>
        <Separator />
      </motion.div>

      {/* Template sections */}
      {TEMPLATE_SECTIONS.map((section) => {
        const Icon = section.icon
        return (
          <motion.section
            key={section.id}
            variants={fadeUp}
            className="flex flex-col gap-3"
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

            <Textarea
              value={sections[section.id]}
              onChange={(e) => updateSection(section.id, e.target.value)}
              placeholder={section.placeholder}
              className="min-h-24 resize-none bg-transparent text-sm leading-relaxed"
            />

            <Separator className="mt-2" />
          </motion.section>
        )
      })}

      {/* Bottom action bar */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center gap-3 pt-2 pb-8 sticky bottom-0 bg-background/80 backdrop-blur-md -mx-4 px-4 sm:-mx-6 sm:px-6 border-t border-border/50"
      >
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save Plan
        </Button>
        <Button variant="outline" onClick={handleCopyLastWeek} className="gap-2">
          <Copy className="w-4 h-4" />
          Copy from last week
        </Button>
        <Button variant="ghost" onClick={handleClear} className="gap-2 text-muted-foreground">
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
      </motion.div>
    </motion.div>
  )
}