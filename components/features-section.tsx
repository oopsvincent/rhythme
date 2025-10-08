"use client"
import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Checkbox } from "./ui/checkbox"

const FeaturesSectionLanding = () => {
  const [timeLeft, setTimeLeft] = React.useState(45 * 60) // 45 minutes in seconds
  const [isRunning, setIsRunning] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval!)
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  const handleStart = () => {
    if (timeLeft === 0) setTimeLeft(45 * 60)
    setIsRunning(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleResume = () => {
    setIsPaused(false)
  }

  const handleStop = () => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeLeft(45 * 60)
  }

  return (
    <section id="features" className="py-20 px-6 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Habit Builder */}
          <Card className="bg-gradient-to-br from-accent/30 to-secondary/20 border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-primary">Habit Builder</CardTitle>
              <CardDescription>
                Build habits that stick with streaks & reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Your habits (0/5)</span>
                    <Button variant="link" className="text-primary">
                      view all
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Reading",
                    "Morning exercise",
                    "Journal",
                    "Plan your week",
                    "Reflect & reset",
                  ].map((habit, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-accent/10 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox />
                        <span>{habit}</span>
                      </div>
                      <Badge variant="secondary">
                        {i < 2
                          ? "Daily"
                          : i === 2
                          ? "Daily"
                          : i === 3
                          ? "Weekly"
                          : "Monthly"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Focus & Pomodoro */}
          <Card className="bg-gradient-to-br from-accent/30 to-secondary/20 border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-primary">Focus & Pomodoro</CardTitle>
              <CardDescription>
                Stay distraction-free and get more done
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="relative w-48 h-48 mb-6">
                <div className="absolute inset-0 border-8 border-accent rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold font-primary">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              <p className="text-center mb-4 font-semibold">
                Stay focused with deep sessions or boost productivity with timed intervals
              </p>

              {/* Dynamic Button Logic */}
              {!isRunning ? (
                <Button onClick={handleStart}>Start Focus</Button>
              ) : isPaused ? (
                <div className="flex gap-3">
                  <Button onClick={handleResume}>Resume</Button>
                  <Button variant="destructive" onClick={handleStop}>
                    Stop
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button onClick={handlePause}>Pause</Button>
                  <Button variant="destructive" onClick={handleStop}>
                    Stop
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Journaling */}
          <Card className="bg-gradient-to-br from-accent/30 to-secondary/20 border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-primary">Journaling</CardTitle>
              <CardDescription>
                Reflect daily and track your growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-2">Self journal</p>
                  <p className="text-6xl font-bold font-primary mb-2">78</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Total journal entries this year
                  </p>
                  <div className="flex justify-center gap-8">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-accent/30 mx-auto mb-1 flex items-center justify-center">
                        <span className="text-primary font-bold">13</span>
                      </div>
                      <p className="text-xs text-muted-foreground">This week</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-accent/30 mx-auto mb-1 flex items-center justify-center">
                        <span className="text-primary font-bold">9</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Negative</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Smart Task Scheduler */}
          <Card className="bg-gradient-to-br from-accent/30 to-secondary/20 border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-primary">Smart Task Scheduler</CardTitle>
              <CardDescription>
                Plan your day with ease and balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Your habits (0/5)</span>
                    <Button variant="link" className="text-primary">
                      view all
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Code your project",
                    "Take out the trash",
                    "Morning exercise",
                    "Journal",
                    "Go for a trip",
                  ].map((habit, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-accent/10 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox defaultChecked={i === 2} />
                        <span>{habit}</span>
                      </div>
                      <Badge variant="secondary">
                        {i < 2
                          ? "Daily"
                          : i === 2
                          ? "Daily"
                          : i === 3
                          ? "Weekly"
                          : "Monthly"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSectionLanding
