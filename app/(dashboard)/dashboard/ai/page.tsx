"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { TextGradient } from "@/components/text-gradient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Crown, 
  Brain, 
  Heart, 
  Zap,
  ArrowRight,
  Target,
  Map,
  CheckCircle2,
  ListTodo,
  Timer,
  AlertTriangle,
  BookOpen,
  ChevronRight,
  Flame,
  Clock,
  Play,
  TrendingUp,
  Rocket,
  Loader2,
  BarChart3,
  CalendarDays,
  Lightbulb,
  ArrowUpRight,
  Layers,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Mock user goal from onboarding
const userGoal = {
  title: "Become a Senior Software Engineer",
  description: "Advance my career to a senior engineering role within 2 years",
  deadline: "December 2027",
  progress: 35,
};

// Roadmap with visual subgoals
const roadmapNodes = [
  { id: 1, title: "Foundation", subtitle: "Core Skills", progress: 100, status: "completed", months: "M1-M3" },
  { id: 2, title: "System Design", subtitle: "Architecture", progress: 65, status: "current", months: "M4-M6" },
  { id: 3, title: "Leadership", subtitle: "Lead Projects", progress: 0, status: "upcoming", months: "M7-M12" },
  { id: 4, title: "Mentorship", subtitle: "Guide Others", progress: 0, status: "upcoming", months: "M13-M18" },
  { id: 5, title: "Senior Role", subtitle: "Promotion", progress: 0, status: "upcoming", months: "M19-M24" },
];

// Next Best Actions from NBA Engine
const nextBestActions = [
  {
    id: 1,
    type: "task",
    priority: "high",
    title: "Complete Load Balancer Chapter",
    reason: "Critical for System Design milestone",
    estimatedTime: "45 min",
    impact: 15,
    source: "NBAEngine",
  },
  {
    id: 2,
    type: "habit",
    priority: "medium",
    title: "Technical Reading Session",
    reason: "Maintain your 5-day streak",
    estimatedTime: "30 min",
    impact: 10,
    source: "StreakProtector",
  },
  {
    id: 3,
    type: "focus",
    priority: "medium",
    title: "Deep Work: AWS Architecture",
    reason: "Best time for complex learning",
    estimatedTime: "90 min",
    impact: 20,
    source: "OptimalTiming",
  },
];

// AI-generated insights
const aiInsights = [
  { type: "positive", message: "You're 12% ahead of schedule on System Design" },
  { type: "suggestion", message: "Consider adding a mock interview practice habit" },
  { type: "warning", message: "3 tasks overdue from last week" },
];

// Quick actions the AI can take
const agentActions = [
  { icon: ListTodo, label: "Generate Tasks", description: "For this week" },
  { icon: Flame, label: "Suggest Habits", description: "Based on goals" },
  { icon: Timer, label: "Plan Focus", description: "Block deep work" },
  { icon: BarChart3, label: "Analyze", description: "Your patterns" },
];

export default function AIPage() {
  const [activeView, setActiveView] = useState<"roadmap" | "nba" | "agent">("roadmap");
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const [selectedAction, setSelectedAction] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleAgentAction = (index: number) => {
    setSelectedAction(index);
    setIsAgentThinking(true);
    setTimeout(() => setIsAgentThinking(false), 2000);
  };

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col overflow-hidden overflow-y-auto">
        <div 
          className="flex flex-1 flex-col items-center px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative"
          onMouseMove={handleMouseMove}
        >
          
          {/* Mouse-following Glow */}
          <div 
            className="pointer-events-none fixed w-[300px] h-[300px] rounded-full opacity-20 blur-[80px] transition-all duration-500 ease-out z-0"
            style={{ 
              background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
              left: mousePosition.x - 150,
              top: mousePosition.y - 150,
            }}
          />

          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] animate-pulse transition-all duration-700 ease-out"
              style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)", animationDuration: "4s" }}
            />
            <div 
              className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] animate-pulse transition-all duration-700 ease-out"
              style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)", animationDuration: "5s", animationDelay: "1s" }}
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center max-w-6xl w-full space-y-8 transition-all duration-500 ease-out">
            
            {/* Header */}
            <div className="text-center space-y-4 w-full">
              <div className="flex items-center justify-center gap-3">
                <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-primary/30 bg-primary/5 text-primary backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                  In Development
                </Badge>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-sm">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="font-mono text-primary font-bold">rvo1</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-primary tracking-tight">
                <TextGradient highlightColor="var(--primary)" baseColor="var(--foreground)" duration={3} spread={40}>
                  Rhythmé AI Agent
                </TextGradient>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Your intelligent planning partner, actively working towards <span className="text-primary font-semibold">{userGoal.title}</span>
              </p>
            </div>

            {/* View Switcher */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-card transition-all duration-500 ease-out">
              {[
                { id: "roadmap", icon: Map, label: "Roadmap" },
                { id: "nba", icon: Rocket, label: "Next Best Actions" },
                { id: "agent", icon: Brain, label: "AI Agent" },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveView(id as typeof activeView)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-500 ease-out",
                    activeView === id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4 transition-transform duration-500 ease-out" />
                  {label}
                </button>
              ))}
            </div>

            {/* Dynamic Content Area */}
            <AnimatePresence mode="wait">
              {activeView === "roadmap" && (
                <motion.div
                  key="roadmap"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full space-y-6"
                >
                  {/* Goal Progress Card */}
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold font-primary text-xl">{userGoal.title}</h3>
                        <p className="text-sm text-muted-foreground">{userGoal.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">{userGoal.progress}%</p>
                        <p className="text-xs text-muted-foreground">by {userGoal.deadline}</p>
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${userGoal.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      />
                    </div>
                  </div>

                  {/* Visual Roadmap */}
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Layers className="w-5 h-5 text-primary" />
                      <h3 className="font-bold font-primary text-lg">Your Roadmap</h3>
                      <Badge variant="secondary" className="text-xs ml-auto">AI Generated</Badge>
                    </div>

                    {/* Roadmap Timeline */}
                    <div className="relative">
                      {/* Connection Line */}
                      <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-primary to-muted rounded-full" />
                      
                      {/* Nodes */}
                      <div className="relative flex justify-between">
                        {roadmapNodes.map((node, index) => (
                          <motion.div
                            key={node.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center"
                          >
                            {/* Node Circle */}
                            <div className={cn(
                              "relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                              node.status === "completed" && "bg-green-500 text-white shadow-lg shadow-green-500/30",
                              node.status === "current" && "bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/20",
                              node.status === "upcoming" && "bg-muted text-muted-foreground"
                            )}>
                              {node.status === "completed" ? (
                                <CheckCircle2 className="w-6 h-6" />
                              ) : node.status === "current" ? (
                                <div className="text-center">
                                  <span className="text-lg font-bold">{node.progress}%</span>
                                </div>
                              ) : (
                                <Target className="w-6 h-6" />
                              )}
                              
                              {/* Pulse for current */}
                              {node.status === "current" && (
                                <div className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-20" />
                              )}
                            </div>

                            {/* Label */}
                            <div className="mt-3 text-center">
                              <p className="font-bold text-sm">{node.title}</p>
                              <p className="text-xs text-muted-foreground">{node.subtitle}</p>
                              <p className="text-xs text-primary font-mono mt-1">{node.months}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {aiInsights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className={cn(
                          "glass-card rounded-xl p-4 border-l-4",
                          insight.type === "positive" && "border-l-green-500",
                          insight.type === "suggestion" && "border-l-blue-500",
                          insight.type === "warning" && "border-l-amber-500"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            insight.type === "positive" && "bg-green-500/10",
                            insight.type === "suggestion" && "bg-blue-500/10",
                            insight.type === "warning" && "bg-amber-500/10"
                          )}>
                            {insight.type === "positive" && <TrendingUp className="w-4 h-4 text-green-500" />}
                            {insight.type === "suggestion" && <Lightbulb className="w-4 h-4 text-blue-500" />}
                            {insight.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{insight.message}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeView === "nba" && (
                <motion.div
                  key="nba"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full space-y-6"
                >
                  {/* NBA Engine Header */}
                  <div className="glass-card rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                      <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold font-primary text-xl mb-2">Next Best Action Engine</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      AI-powered recommendations based on your goals, progress, and optimal timing
                    </p>
                  </div>

                  {/* NBA Cards */}
                  <div className="space-y-4">
                    {nextBestActions.map((action, index) => (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                        className={cn(
                          "glass-card rounded-2xl p-6 group cursor-pointer transition-all duration-500 ease-out hover:scale-[1.01]",
                          action.priority === "high" && "ring-2 ring-primary/30"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          {/* Priority Indicator */}
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                            action.type === "task" && "bg-blue-500/10",
                            action.type === "habit" && "bg-orange-500/10",
                            action.type === "focus" && "bg-purple-500/10"
                          )}>
                            {action.type === "task" && <ListTodo className="w-6 h-6 text-blue-500" />}
                            {action.type === "habit" && <Flame className="w-6 h-6 text-orange-500" />}
                            {action.type === "focus" && <Timer className="w-6 h-6 text-purple-500" />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={cn(
                                "text-xs capitalize",
                                action.priority === "high" && "border-red-500/50 text-red-500"
                              )}>
                                {action.priority} priority
                              </Badge>
                              <span className="text-xs text-muted-foreground">via {action.source}</span>
                            </div>
                            <h4 className="font-bold font-primary text-lg mb-1">{action.title}</h4>
                            <p className="text-sm text-muted-foreground">{action.reason}</p>
                          </div>

                          {/* Stats & Action */}
                          <div className="text-right shrink-0">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                              <Clock className="w-4 h-4" />
                              {action.estimatedTime}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-green-500 font-medium mb-3">
                              <ArrowUpRight className="w-4 h-4" />
                              +{action.impact}% impact
                            </div>
                            <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                              <Play className="w-4 h-4 mr-1" />
                              Start
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Refresh Button */}
                  <div className="text-center">
                    <Button variant="outline" className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Recalculate Best Actions
                    </Button>
                  </div>
                </motion.div>
              )}

              {activeView === "agent" && (
                <motion.div
                  key="agent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full space-y-6"
                >
                  {/* Agent Status */}
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <Brain className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold font-primary text-xl">Rhythmé Agent</h3>
                        <p className="text-sm text-muted-foreground">
                          {isAgentThinking ? (
                            <span className="flex items-center gap-2 text-primary">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing your request...
                            </span>
                          ) : (
                            "Ready to help you achieve your goals"
                          )}
                        </p>
                      </div>
                      <Badge className="ml-auto bg-green-500/10 text-green-500 border-0">Online</Badge>
                    </div>
                  </div>

                  {/* Quick Agent Actions */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {agentActions.map((action, index) => {
                      const Icon = action.icon;
                      const isSelected = selectedAction === index;
                      return (
                        <motion.button
                          key={action.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
                          onClick={() => handleAgentAction(index)}
                          disabled={isAgentThinking}
                          className={cn(
                            "glass-card rounded-2xl p-5 text-left transition-all duration-500 ease-out",
                            "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10",
                            isSelected && isAgentThinking && "ring-2 ring-primary",
                            isAgentThinking && !isSelected && "opacity-50"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                            isSelected && isAgentThinking ? "bg-primary/20" : "bg-muted"
                          )}>
                            {isSelected && isAgentThinking ? (
                              <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            ) : (
                              <Icon className="w-6 h-6 text-primary" />
                            )}
                          </div>
                          <p className="font-bold font-primary">{action.label}</p>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Agent Output Preview */}
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-accent" />
                      <h4 className="font-bold font-primary">Agent Output</h4>
                    </div>
                    
                    {selectedAction !== null && !isAgentThinking ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                      >
                        {selectedAction === 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {["Read Load Balancer docs", "Practice LeetCode #215", "Review microservices patterns"].map((task, i) => (
                              <div key={i} className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <ListTodo className="w-4 h-4 text-blue-500" />
                                  <Badge variant="outline" className="text-xs">New Task</Badge>
                                </div>
                                <p className="text-sm font-medium">{task}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {selectedAction === 1 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {["Daily system design review", "Weekly mock interview"].map((habit, i) => (
                              <div key={i} className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <Flame className="w-4 h-4 text-orange-500" />
                                  <Badge variant="outline" className="text-xs">Suggested Habit</Badge>
                                </div>
                                <p className="text-sm font-medium">{habit}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {selectedAction === 2 && (
                          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                            <div className="flex items-center gap-2 mb-3">
                              <CalendarDays className="w-4 h-4 text-purple-500" />
                              <Badge variant="outline" className="text-xs">Scheduled Focus Blocks</Badge>
                            </div>
                            <div className="space-y-2">
                              {["9:00 AM - 10:30 AM: Deep Work (System Design)", "2:00 PM - 3:30 PM: Practice Session"].map((block, i) => (
                                <p key={i} className="text-sm font-medium flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  {block}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedAction === 3 && (
                          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                            <div className="flex items-center gap-2 mb-3">
                              <BarChart3 className="w-4 h-4 text-green-500" />
                              <Badge variant="outline" className="text-xs">Pattern Analysis</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              You're most productive between <span className="text-green-500 font-medium">9-11 AM</span>. 
                              Your habit completion rate increases on <span className="text-green-500 font-medium">Tuesdays and Thursdays</span>.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Select an action above to see what the agent can do</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Caution Notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 max-w-2xl mx-auto">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">AI Can Make Mistakes</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Always verify important decisions. Use your own judgment for critical choices.
                </p>
              </div>
            </div>

            {/* What's Coming + Hanging Premium */}
            <div className="w-full max-w-2xl">
              <div className="glass-card rounded-2xl p-8 space-y-6 text-center relative">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold font-primary">What&apos;s Coming</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Rhythmé AI Agent will <span className="text-accent font-medium">autonomously</span> analyze your progress, 
                    generate personalized recommendations, and help you stay on track—all working towards your long-term vision.
                  </p>
                </div>

                <div className="pt-4 border-t border-border/30">
                  <p className="text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 inline mr-2 text-primary" />
                    Premium members get <span className="text-primary font-semibold">exclusive early access</span>
                  </p>
                </div>

                {/* Hanging connectors */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-start gap-32">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-border to-primary/50 rounded-full" />
                  <div className="w-0.5 h-8 bg-gradient-to-b from-border to-primary/50 rounded-full" />
                </div>
              </div>

              {/* Hanging Premium CTA */}
              <div className="relative mt-8 flex justify-center">
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-36 h-0.5 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 rounded-full" />
                
                <div className="w-full max-w-md animate-swing origin-top">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-all duration-500 animate-gradient" />
                    <Link href="/settings/billing">
                      <div className="relative glass-card rounded-2xl p-6 space-y-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                          <div className="w-2 h-2 rounded-full bg-white/80" />
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <Crown className="w-6 h-6 text-primary" />
                          <h3 className="text-xl font-bold font-primary">Get Premium Access</h3>
                        </div>
                        <p className="text-muted-foreground text-center text-sm">
                          Be the <span className="text-accent font-semibold">first</span> to experience Rhythmé AI Agent.
                        </p>
                        <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary/25">
                          Upgrade to Premium
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes swing {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-swing {
          animation: swing 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
