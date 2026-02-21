"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

// Password strength calculation
function getPasswordStrength(password: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // Clamp to 1-4
  const clampedScore = Math.min(4, Math.max(1, score)) as 1 | 2 | 3 | 4;

  const config = {
    1: { label: "Weak", color: "bg-red-500" },
    2: { label: "Fair", color: "bg-orange-500" },
    3: { label: "Strong", color: "bg-yellow-500" },
    4: { label: "Very Strong", color: "bg-green-500" },
  };

  return { score: clampedScore, ...config[clampedScore] };
}

interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  showStrength?: boolean;
}

function PasswordInput({
  className,
  showStrength = false,
  value,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);
  const strength = showStrength
    ? getPasswordStrength((value as string) || "")
    : null;

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        value={value}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>

      {/* Strength meter */}
      {showStrength && strength && strength.score > 0 && (
        <div className="mt-2 space-y-1">
          <div className="flex gap-1 h-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn(
                  "flex-1 rounded-full transition-all duration-300",
                  level <= strength.score
                    ? strength.color
                    : "bg-muted"
                )}
              />
            ))}
          </div>
          <p
            className={cn(
              "text-xs transition-colors",
              strength.score <= 1
                ? "text-red-500"
                : strength.score === 2
                  ? "text-orange-500"
                  : strength.score === 3
                    ? "text-yellow-500"
                    : "text-green-500"
            )}
          >
            {strength.label}
          </p>
        </div>
      )}
    </div>
  );
}

export { PasswordInput, getPasswordStrength };
