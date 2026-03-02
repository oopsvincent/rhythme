"use client"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
} from "recharts"

interface MoodSparklineProps {
  data: { day: string; value: number }[]
  className?: string
}

export function MoodSparkline({ data, className }: MoodSparklineProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <YAxis domain={[0, 5]} hide />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#moodGradient)"
            dot={false}
            animationDuration={1200}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
