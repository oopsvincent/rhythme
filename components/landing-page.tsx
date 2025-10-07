"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Calendar, BookOpen, Timer, Trophy, Copyright } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Checkbox } from "./ui/checkbox";

const RhythmeLanding = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "features", "testimonials", "pricing"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            if (activeSection !== section) {
              setActiveSection(section);
              window.history.replaceState(null, "", `#${section}`);
            }
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-accent/5 to-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold font-primary">Rhythmé</h1>
            <div className="hidden md:flex gap-6">
              <button
                onClick={() => scrollToSection("features")}
                className="text-foreground hover:text-primary transition"
              >
                Explore
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-foreground hover:text-primary transition"
              >
                Pricing
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => router.push("/login")}>Log in</Button>
            <Link className="bg-primary rounded-md flex justify-center items-center p-2" href={"/signup/intro"}>Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center font-marketing">
          <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-8"></div>
          <h2 className="text-5xl md:text-6xl font-marketing font-bold mb-4">
            Find Your Flow with Rhythmé
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Build habits, stay focused, and unlock your best self — all in one
            app
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="border-2 hover:border-primary/50 transition">
              <CardHeader>
                <BookOpen className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">
                  Your Personal Growth Space
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track habits, journal daily, stay focused, and reflect on your
                  journey
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition">
              <CardHeader>
                <Check className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Build Better Days</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Organize tasks, capture thoughts, and manage life — all in one
                  place
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition">
              <CardHeader>
                <Timer className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">
                  Stay Focused, Stay Balanced
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Boost productivity with Focus Mode, Pomodoro, and a smart task
                  scheduler
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition">
              <CardHeader>
                <Trophy className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Achieve Through Play</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Hit milestones, complete gamified challenges, rewards, and
                  streaks
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 justify-center">
            <Button size="lg">Get started</Button>
            <Button size="lg" variant="outline">
              Try Rhythmé now
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Habit Builder */}
            <Card className="bg-gradient-to-br from-accent/30 to-secondary/20 border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-primary">
                  Habit Builder
                </CardTitle>
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
                <CardTitle className="text-2xl font-primary">
                  Focus & Pomodoro
                </CardTitle>
                <CardDescription>
                  Stay distraction-free and get more done
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 border-8 border-accent rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold font-primary">
                      45:00
                    </span>
                  </div>
                </div>
                <p className="text-center mb-4 font-semibold">
                  Stay focused with deep sessions or boost productivity with
                  timed intervals
                </p>
                <Button>Start focus</Button>
              </CardContent>
            </Card>

            {/* Journaling */}
            <Card className="bg-gradient-to-br from-accent/30 to-secondary/20 border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-primary">
                  Journaling
                </CardTitle>
                <CardDescription>
                  Reflect daily and track your growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-2">
                      Self journal
                    </p>
                    <p className="text-6xl font-bold font-primary mb-2">78</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Total journal entries this year
                    </p>
                    <div className="flex justify-center gap-8">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-accent/30 mx-auto mb-1 flex items-center justify-center">
                          <span className="text-primary font-bold">13</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          This week
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-accent/30 mx-auto mb-1 flex items-center justify-center">
                          <span className="text-primary font-bold">9</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Negative
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Smart Task Scheduler */}
            <Card className="bg-gradient-to-br from-accent/30 to-secondary/20 border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-primary">
                  Smart Task Scheduler
                </CardTitle>
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
                            <Checkbox
                              defaultChecked={i === 2}
                            />
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

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-marketing mb-4">
            The rhythm to
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold font-marketing mb-12">
            your productivity
          </h2>

          <p className="text-xl font-semibold mb-8">Loved by Early Users:</p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">user123</span>
                  <div className="flex">
                    {[...Array(4)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-chart-5 text-chart-5"
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Rhythmé helped me finally stick to my reading habit
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">user123</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-chart-5 text-chart-5"
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The focus timer keeps me from doom-scrolling. Total game
                  changer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">user123</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-chart-5 text-chart-5"
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  It feels less like work and more like a lifestyle
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto text-center font-marketing">
          <h2 className="text-4xl md:text-5xl font-bold font-primary mb-4">
            Choose Your Rhythm
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            One simple plan for everything you need
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-3xl font-primary">FREE</CardTitle>
                <p className="text-4xl font-bold font-primary">
                  $0
                  <span className="text-lg text-muted-foreground">/month</span>
                </p>
              </CardHeader>
              <CardContent className="text-left space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-chart-4 mt-0.5 flex-shrink-0" />
                  <span>Track up to 3 habits</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-chart-4 mt-0.5 flex-shrink-0" />
                  <span>Focus & Pomodoro timer (basic)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-chart-4 mt-0.5 flex-shrink-0" />
                  <span>Daily journaling (10 entries/month)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-chart-4 mt-0.5 flex-shrink-0" />
                  <span>10 tasks everyday</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary relative">
              <CardHeader>
                <CardTitle className="text-3xl font-primary">PLUS</CardTitle>
                <p className="text-4xl font-bold font-primary">
                  $5.99
                  <span className="text-lg text-muted-foreground">/month</span>
                </p>
              </CardHeader>
              <CardContent className="text-left space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-chart-4 mt-0.5 flex-shrink-0" />
                  <span>Unlimited habits & journal</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-chart-4 mt-0.5 flex-shrink-0" />
                  <span>Advanced focus & Pomodoro tools</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-chart-4 mt-0.5 flex-shrink-0" />
                  <span>Unlimited tasks</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-chart-4 mt-0.5 flex-shrink-0" />
                  <span>Advanced Goal Management</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-chart-4 mt-0.5 flex-shrink-0" />
                  <span>Smart analytics & insights</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-chart-4 mt-0.5 flex-shrink-0" />
                  <span>Cloud backup & multi-device sync</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-chart-4 mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </div>
                <Button className="w-full mt-4">Buy now</Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-2xl md:text-3xl font-bold font-marketing mt-16">
            Free to begin, limitless
          </p>
          <p className="text-2xl md:text-3xl font-bold font-marketing">
            when you&apos;re ready
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 pb-50 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold font-primary mb-2">Rhythmé</h3>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-3">
                <Copyright size={25}/>  <span>2025 Rhythmé</span>
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-foreground hover:text-primary transition"
              >
                About us
              </a>
              <a
                href="#"
                className="text-foreground hover:text-primary transition"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-foreground hover:text-primary transition"
              >
                Terms & privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RhythmeLanding;
