"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import {
  Brain,
  BarChart3,
  LineChartIcon,
  AreaChartIcon,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Journal } from "@/types/database";

type ChartType = "area" | "line" | "bar";

const chartTypeIcons: Record<ChartType, React.ElementType> = {
  area: AreaChartIcon,
  line: LineChartIcon,
  bar: BarChart3,
};

const chartConfig = {
  score: {
    label: "Confidence",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

// Sentiment → color for dots
const sentimentDotColors: Record<string, string> = {
  positive: "#22c55e",
  negative: "#ef4444",
  neutral: "#3b82f6",
};

interface DayScore {
  day: string;
  date: string;
  score: number | null;
  sentiment: string | null;
}

function getLast7DaysScores(journals: Journal[]): DayScore[] {
  const days: DayScore[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // Find journals for this day that have sentiment scores
    const dayJournals = journals.filter((j) => {
      const journalDate = new Date(j.created_at).toISOString().split("T")[0];
      return journalDate === dateStr && j.sentiment_score != null;
    });

    let score: number | null = null;
    let sentiment: string | null = null;

    if (dayJournals.length > 0) {
      // Average the scores for that day
      const totalScore = dayJournals.reduce(
        (sum, j) => sum + (j.sentiment_score || 0),
        0
      );
      score = Math.round(totalScore / dayJournals.length);

      // Use the most recent journal's sentiment
      const latest = dayJournals.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      sentiment = latest.mood_tags?.sentiment || null;
    }

    const isToday = i === 0;

    days.push({
      day: isToday
        ? "Today"
        : date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score,
      sentiment,
    });
  }

  return days;
}

// Storage key for persisting layout preference
const CHART_LAYOUT_KEY = "rhythme_sentiment_chart_layout";

interface SentimentChartProps {
  journals: Journal[];
}

export function SentimentChart({ journals }: SentimentChartProps) {
  const [chartType, setChartType] = React.useState<ChartType>("area");

  // Load persisted preference
  React.useEffect(() => {
    const stored = localStorage.getItem(CHART_LAYOUT_KEY);
    if (stored && (stored === "area" || stored === "line" || stored === "bar")) {
      setChartType(stored as ChartType);
    }
  }, []);

  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
    localStorage.setItem(CHART_LAYOUT_KEY, type);
  };

  const days = getLast7DaysScores(journals);
  const hasData = days.some((d) => d.score !== null);

  // For recharts, null values cause gaps — replace with 0 for display
  const chartData = days.map((d) => ({
    ...d,
    score: d.score ?? 0,
    hasData: d.score !== null,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold font-primary">
            Sentiment Confidence
          </h3>
        </div>

        {/* Chart Type Switcher */}
        <div className="flex items-center gap-0.5 rounded-lg bg-muted/50 p-0.5">
          {(["area", "line", "bar"] as ChartType[]).map((type) => {
            const Icon = chartTypeIcons[type];
            return (
              <button
                key={type}
                onClick={() => handleChartTypeChange(type)}
                className={cn(
                  "p-1.5 rounded-md transition-all duration-200",
                  chartType === type
                    ? "bg-background shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={`${type.charAt(0).toUpperCase() + type.slice(1)} chart`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
      </div>

      {!hasData ? (
        /* Empty state */
        <div className="flex flex-col items-center py-6 text-center">
          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mb-2">
            <Brain className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            No sentiment data yet. Analyze a journal to see trends!
          </p>
        </div>
      ) : (
        /* Chart */
        <ChartContainer config={chartConfig} className="h-[140px] w-full">
          {chartType === "area" ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-score)"
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-score)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                width={30}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => {
                      const sentiment = item.payload?.sentiment;
                      return (
                        <span>
                          {value}%
                          {sentiment && (
                            <span className="ml-1 text-muted-foreground capitalize">
                              ({sentiment})
                            </span>
                          )}
                        </span>
                      );
                    }}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="var(--color-score)"
                fill="url(#fillScore)"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload, index } = props;
                  if (!payload.hasData) return <g key={`area-dot-${index}`} />;
                  const color =
                    sentimentDotColors[payload.sentiment] || "var(--primary)";
                  return (
                    <circle
                      key={`area-dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={color}
                      stroke="var(--background)"
                      strokeWidth={2}
                    />
                  );
                }}
              />
            </AreaChart>
          ) : chartType === "line" ? (
            <LineChart data={chartData}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                width={30}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => {
                      const sentiment = item.payload?.sentiment;
                      return (
                        <span>
                          {value}%
                          {sentiment && (
                            <span className="ml-1 text-muted-foreground capitalize">
                              ({sentiment})
                            </span>
                          )}
                        </span>
                      );
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--color-score)"
                strokeWidth={2.5}
                dot={(props) => {
                  const { cx, cy, payload, index } = props;
                  if (!payload.hasData) return <g key={`line-dot-${index}`} />;
                  const color =
                    sentimentDotColors[payload.sentiment] || "var(--primary)";
                  return (
                    <circle
                      key={`line-dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={color}
                      stroke="var(--background)"
                      strokeWidth={2}
                    />
                  );
                }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                width={30}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => {
                      const sentiment = item.payload?.sentiment;
                      return (
                        <span>
                          {value}%
                          {sentiment && (
                            <span className="ml-1 text-muted-foreground capitalize">
                              ({sentiment})
                            </span>
                          )}
                        </span>
                      );
                    }}
                  />
                }
              />
              <Bar
                dataKey="score"
                fill="var(--color-score)"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          )}
        </ChartContainer>
      )}
    </motion.div>
  );
}
