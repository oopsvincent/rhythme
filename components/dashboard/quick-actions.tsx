// components/dashboard/quick-actions.tsx
"use client"

import { useRouter } from "next/navigation"
import { 
  IconPlus, 
  IconPlayerPlay, 
  IconSparkles, 
  IconListCheck,
  IconBook,
  IconTarget
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  color: string
  gradient: string
}

const quickActions: QuickAction[] = [
  {
    id: "new-task",
    label: "New Task",
    icon: <IconPlus className="w-5 h-5 sm:w-6 sm:h-6" />,
    href: "/dashboard/tasks",
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5"
  },
  {
    id: "start-focus",
    label: "Start Focus",
    icon: <IconPlayerPlay className="w-5 h-5 sm:w-6 sm:h-6" />,
    href: "/dashboard/focus",
    color: "text-accent",
    gradient: "from-accent/20 to-accent/5"
  },
  {
    id: "habits",
    label: "Habits",
    icon: <IconSparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
    href: "/dashboard/habits",
    color: "text-green-500",
    gradient: "from-green-500/20 to-green-500/5"
  },
  {
    id: "journal",
    label: "Journal",
    icon: <IconBook className="w-5 h-5 sm:w-6 sm:h-6" />,
    href: "/dashboard/journal",
    color: "text-purple-500",
    gradient: "from-purple-500/20 to-purple-500/5"
  },
  {
    id: "view-tasks",
    label: "All Tasks",
    icon: <IconListCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
    href: "/dashboard/tasks",
    color: "text-yellow-500",
    gradient: "from-yellow-500/20 to-yellow-500/5"
  }
]

export function QuickActions() {
  const router = useRouter()

  return (
    <TooltipProvider delayDuration={200}>
      <div className="glass-card rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-border/50 overflow-hidden">
        {/* macOS-like dock */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 overflow-x-auto scrollbar-hide">
          {quickActions.map((action, index) => (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(action.href)}
                  className={`
                    relative flex items-center justify-center shrink-0
                    w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl
                    bg-gradient-to-br ${action.gradient}
                    border border-border/50
                    ${action.color}
                    transition-shadow duration-300
                    hover:shadow-lg
                    group
                  `}
                >
                  {action.icon}
                  
                  {/* Glow effect on hover */}
                  <div className={`
                    absolute inset-0 rounded-xl opacity-0 
                    group-hover:opacity-100 transition-opacity
                    bg-gradient-to-br ${action.gradient}
                    blur-xl -z-10
                  `} />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-popover/95 backdrop-blur-sm"
              >
                <p className="font-medium">{action.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Dock reflection effect */}
        <div className="
          mt-2 mx-auto w-3/4 h-px
          bg-gradient-to-r from-transparent via-border to-transparent
        " />
      </div>
    </TooltipProvider>
  )
}
