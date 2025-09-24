"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, LineChart, Clock, Trophy, ChevronsRight } from "lucide-react";

export default function IntroPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-white">
      {/* Header */}
      <div className="flex flex-col items-center mt-12 text-center px-6">
        <div className="w-24 h-24 rounded-full bg-gray-200" /> {/* Placeholder avatar */}
        <h1 className="mt-6 font-primary font-bold text-4xl">
          Welcome to <span className="text-orange-500">Rhythmé</span>
        </h1>
      </div>

      {/* Features */}
      <div className="flex flex-col justify-center items-center gap-5 w-full fixed bottom-0 right-0 bg-accent rounded-t-[4rem]">

      <Card className="w-[80%] rounded-2xl mt-10 shadow-lg">
        <CardContent className="space-y-6">
          <Feature
            icon={<LineChart size={28} className="text-primary mt-2.5" />}
            title="Your Personal Growth Space"
            text="Create routines that stick, stay focused, and reflect on your progress."
          />
          <Feature
            icon={<CheckCircle size={28} className="text-primary mt-2.5" />}
            title="Build Better Days"
            text="Track habits, journal your thoughts, and manage tasks — all in one place."
          />
          <Feature
            icon={<Clock size={28} className="text-primary mt-2.5" />}
            title="Stay Focused, Stay Balanced"
            text="Boost productivity with Focus Mode, Pomodoro, and a smart task scheduler."
          />
          <Feature
            icon={<Trophy size={28} className="text-primary mt-2.5" />}
            title="Achieve Through Play"
            text="Stay motivated with gamified challenges, rewards, and streaks."
          />
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="w-full px-6 mb-5">
        <Button
          className="w-full py-6 my-5 text-lg font-semibold rounded-full bg-primary hover:bg-primary"
          onClick={() => router.push("/login")}
        >
          CONTINUE <ChevronsRight size={8} />
        </Button>
      </div> 
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div>{icon}</div>
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-gray-600">{text}</p>
      </div>
    </div>
  );
}
