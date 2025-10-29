"use client"
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Plus,
  Target,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Progress } from "../components/ui/progress";
// import { useNavigationStore } from "@/store/nav-store";
import { motion } from "framer-motion";

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  targetDate: string;
  milestones: Milestone[];
  priority: "low" | "medium" | "high";
}

const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Launch New Product Feature",
    description:
      "Design, develop, and launch the new analytics dashboard",
    category: "Work",
    status: "in-progress",
    progress: 65,
    targetDate: "2025-12-31",
    priority: "high",
    milestones: [
      {
        id: "m1",
        title: "Complete design mockups",
        completed: true,
      },
      {
        id: "m2",
        title: "Develop backend API",
        completed: true,
      },
      {
        id: "m3",
        title: "Build frontend interface",
        completed: false,
      },
      { id: "m4", title: "User testing", completed: false },
      { id: "m5", title: "Launch", completed: false },
    ],
  },
  {
    id: "2",
    title: "Learn React Advanced Patterns",
    description:
      "Master advanced React patterns and state management",
    category: "Learning",
    status: "in-progress",
    progress: 40,
    targetDate: "2025-11-30",
    priority: "medium",
    milestones: [
      {
        id: "m1",
        title: "Complete context patterns",
        completed: true,
      },
      {
        id: "m2",
        title: "Learn custom hooks",
        completed: true,
      },
      {
        id: "m3",
        title: "Study render props",
        completed: false,
      },
      {
        id: "m4",
        title: "Master compound components",
        completed: false,
      },
    ],
  },
  {
    id: "3",
    title: "Improve Team Collaboration",
    description:
      "Implement better processes and tools for team collaboration",
    category: "Management",
    status: "not-started",
    progress: 0,
    targetDate: "2026-01-15",
    priority: "medium",
    milestones: [
      {
        id: "m1",
        title: "Evaluate collaboration tools",
        completed: false,
      },
      {
        id: "m2",
        title: "Set up new workflows",
        completed: false,
      },
      {
        id: "m3",
        title: "Train team members",
        completed: false,
      },
    ],
  },
  {
    id: "4",
    title: "Fitness Milestone: Run 10K",
    description: "Train and complete a 10K run",
    category: "Health",
    status: "in-progress",
    progress: 75,
    targetDate: "2025-10-20",
    priority: "high",
    milestones: [
      {
        id: "m1",
        title: "Run 5K consistently",
        completed: true,
      },
      { id: "m2", title: "Increase to 7K", completed: true },
      {
        id: "m3",
        title: "Complete 10K practice run",
        completed: true,
      },
      {
        id: "m4",
        title: "Official 10K event",
        completed: false,
      },
    ],
  },
];

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: "",
    description: "",
    category: "",
    status: "not-started",
    progress: 0,
    targetDate: "",
    priority: "medium",
    milestones: [],
  });
//   const { setSearchData } = useNavigationStore();


  const addGoal = () => {
    if (!newGoal.title) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description || "",
      category: newGoal.category || "General",
      status: "not-started",
      progress: 0,
      targetDate: newGoal.targetDate || "",
      priority:
        (newGoal.priority as "low" | "medium" | "high") ||
        "medium",
      milestones: [],
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: "",
      description: "",
      category: "",
      status: "not-started",
      progress: 0,
      targetDate: "",
      priority: "medium",
      milestones: [],
    });
    setIsAddDialogOpen(false);
  };

  const toggleMilestone = (
    goalId: string,
    milestoneId: string,
  ) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map((m) =>
            m.id === milestoneId
              ? { ...m, completed: !m.completed }
              : m,
          );
          const completedCount = updatedMilestones.filter(
            (m) => m.completed,
          ).length;
          const progress =
            (completedCount / updatedMilestones.length) * 100;
          const status =
            progress === 100
              ? "completed"
              : progress > 0
                ? "in-progress"
                : "not-started";

          return {
            ...goal,
            milestones: updatedMilestones,
            progress,
            status: status as Goal["status"],
          };
        }
        return goal;
      }),
    );
  };

const getPriorityColor = (priority: string): "default" | "destructive" | "secondary" => {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
    default:
      return "default";
  }
};

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "not-started":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const notStartedGoals = goals.filter(
    (g) => g.status === "not-started",
  );
  const inProgressGoals = goals.filter(
    (g) => g.status === "in-progress",
  );
  const completedGoals = goals.filter(
    (g) => g.status === "completed",
  );

  const totalGoals = goals.length;
  const averageProgress =
    totalGoals > 0
      ? goals.reduce((sum, g) => sum + g.progress, 0) /
        totalGoals
      : 0;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl">Goals</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Set and track your long-term objectives
          </p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        >
          <DialogTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a new goal to work towards
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Goal Title</Label>
                <Input
                  placeholder="e.g., Launch new product"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your goal"
                  value={newGoal.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewGoal({
                      ...newGoal,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={newGoal.priority}
                    onValueChange={(value) =>
                      setNewGoal({
                        ...newGoal,
                        priority: value as Goal["priority"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">
                        Medium
                      </SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    placeholder="e.g., Work, Personal"
                    value={newGoal.category}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        category: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Target Date</Label>
                <Input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      targetDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <button
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors"
                onClick={addGoal}
              >
                Add Goal
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">
              Total Goals
            </CardDescription>
            <CardTitle className="text-2xl md:text-3xl">
              {totalGoals}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">
              In Progress
            </CardDescription>
            <CardTitle className="text-2xl md:text-3xl">
              {inProgressGoals.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">
              Completed
            </CardDescription>
            <CardTitle className="text-2xl md:text-3xl">
              {completedGoals.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs md:text-sm">
              Avg Progress
            </CardDescription>
            <CardTitle className="text-2xl md:text-3xl">
              {averageProgress.toFixed(0)}%
            </CardTitle>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Goals Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger
            value="all"
            className="text-xs md:text-sm"
          >
            <span className="hidden sm:inline">All Goals</span>
            <span className="sm:hidden">All</span> ({totalGoals}
            )
          </TabsTrigger>
          <TabsTrigger
            value="in-progress"
            className="text-xs md:text-sm"
          >
            <span className="hidden sm:inline">
              In Progress
            </span>
            <span className="sm:hidden">Active</span> (
            {inProgressGoals.length})
          </TabsTrigger>
          <TabsTrigger
            value="not-started"
            className="text-xs md:text-sm"
          >
            <span className="hidden sm:inline">
              Not Started
            </span>
            <span className="sm:hidden">New</span> (
            {notStartedGoals.length})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="text-xs md:text-sm"
          >
            Done ({completedGoals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggleMilestone={toggleMilestone}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
            />
          ))}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggleMilestone={toggleMilestone}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
            />
          ))}
        </TabsContent>

        <TabsContent value="not-started" className="space-y-4">
          {notStartedGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggleMilestone={toggleMilestone}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
            />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggleMilestone={toggleMilestone}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GoalCard({
  goal,
  onToggleMilestone,
  getPriorityColor,
  getStatusColor,
}: {
  goal: Goal;
  onToggleMilestone: (
    goalId: string,
    milestoneId: string,
  ) => void;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
}) {
  const daysUntilTarget = goal.targetDate
    ? Math.ceil(
        (new Date(goal.targetDate).getTime() -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {goal.title}
            </CardTitle>
            <CardDescription className="mt-2">
              {goal.description}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {/* <Badge
              variant={getPriorityColor(goal.priority) as any}
            >
              {goal.priority}
            </Badge> */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Progress
            </span>
            <span>{goal.progress.toFixed(0)}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <Badge className={getStatusColor(goal.status)}>
            {goal.status.replace("-", " ")}
          </Badge>
          <Badge variant="outline">{goal.category}</Badge>
          {goal.targetDate && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(goal.targetDate).toLocaleDateString()}
              {daysUntilTarget !== null && (
                <span className="ml-1">
                  (
                  {daysUntilTarget > 0
                    ? `${daysUntilTarget} days left`
                    : "overdue"}
                  )
                </span>
              )}
            </div>
          )}
        </div>

        {goal.milestones.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm">Milestones</h4>
            <div className="space-y-2">
              {goal.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                  onClick={() =>
                    onToggleMilestone(goal.id, milestone.id)
                  }
                >
                  <div
                    className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                      milestone.completed
                        ? "bg-primary border-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {milestone.completed && (
                      <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}