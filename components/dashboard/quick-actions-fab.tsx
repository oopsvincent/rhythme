"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, CheckSquare, NotebookPen, Activity, Timer, CalendarRange } from "lucide-react"
import { Button } from "@/components/ui/button"
import TaskForm from "@/components/task-form"
import HabitForm from "@/components/habit-form"
import { cn } from "@/lib/utils"

export function QuickActionsFab() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const actions = [
    {
      id: "task",
      content: (
        <TaskForm>
          <Button variant="outline" className="justify-end gap-3 rounded-full transition-all duration-200 shadow-xl bg-background/80 backdrop-blur-3xl border-border/50 hover:bg-accent hover:text-accent-foreground cursor-pointer h-12 px-5">
            <span className="font-medium text-sm">Create Task</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
              <CheckSquare className="h-3.5 w-3.5 text-primary" />
            </div>
          </Button>
        </TaskForm>
      )
    },
    {
      id: "create-habit",
      content: (
        <HabitForm>
          <Button variant="outline" className="justify-end gap-3 rounded-full transition-all duration-200 shadow-xl bg-background/80 backdrop-blur-3xl border-border/50 hover:bg-accent hover:text-accent-foreground cursor-pointer h-12 px-5">
            <span className="font-medium text-sm">Create Habit</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/10">
              <Activity className="h-3.5 w-3.5 text-orange-500" />
            </div>
          </Button>
        </HabitForm>
      )
    },
    {
      id: "start-focus",
      content: (
        <Button 
          variant="outline" 
          className="justify-end gap-3 rounded-full transition-all duration-200 shadow-xl bg-background/80 backdrop-blur-3xl border-border/50 hover:bg-accent hover:text-accent-foreground h-12 px-5 cursor-pointer"
          onClick={() => {
            setIsOpen(false)
            router.push("/dashboard/focus")
          }}
        >
          <span className="font-medium text-sm">Start Focus</span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
            <Timer className="h-3.5 w-3.5 text-green-500" />
          </div>
        </Button>
      )
    },
    {
      id: "journal",
      content: (
        <Button 
          variant="outline" 
          className="justify-end gap-3 rounded-full transition-all duration-200 shadow-xl bg-background/80 backdrop-blur-3xl border-border/50 hover:bg-accent hover:text-accent-foreground h-12 px-5 cursor-pointer"
          onClick={() => {
            setIsOpen(false)
            router.push("/dashboard/journal/new")
          }}
        >
          <span className="font-medium text-sm">Create Journal</span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10">
            <NotebookPen className="h-3.5 w-3.5 text-blue-500" />
          </div>
        </Button>
      )
    },
    {
      id: "current-week",
      content: (
        <Button 
          variant="outline" 
          className="justify-end gap-3 rounded-full transition-all duration-200 shadow-xl bg-background/80 backdrop-blur-3xl border-border/50 hover:bg-accent hover:text-accent-foreground h-12 px-5 cursor-pointer"
          onClick={() => {
            setIsOpen(false)
            router.push("/dashboard/week")
          }}
        >
          <span className="font-medium text-sm">Current Week</span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/10">
            <CalendarRange className="h-3.5 w-3.5 text-violet-500" />
          </div>
        </Button>
      )
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end gap-3">
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 15, scale: 0.9, x: 5 }}
                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                exit={{ opacity: 0, y: 10, scale: 0.9, x: 5 }}
                transition={{ 
                  duration: 0.2, 
                  delay: (actions.length - 1 - index) * 0.04,
                  ease: "easeOut"
                }}
              >
                {action.content}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
      <Button 
        size="icon" 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300",
          isOpen && "rotate-45 shadow-primary/20 scale-105"
        )}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
