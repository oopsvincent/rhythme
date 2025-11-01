import React from "react";
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
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Checkbox } from "./ui/checkbox";
import Navbar from "./navbar";
import FeaturesSectionLanding from "./features-section";

const RhythmeLanding = () => {

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-accent/5 to-background">

    <Navbar />

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

      {/* Features Section  */}

    <FeaturesSectionLanding />

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
