// ============================================================================
// FILE: components/providers/settings-provider.tsx
// ============================================================================
"use client";

import * as React from "react";
import { SettingsDialog } from "@/components/settings-dialog";
import { ModeToggle } from "@/components/theme-button";

interface SettingsData {
  account: {
    name: string;
    email: string;
    bio: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  appearance: {
    theme?: "light" | "dark" | "system";
    fontSize?: "small" | "medium" | "large";
  };
  language: {
    language: string;
    timezone: string;
  };
  privacy: {
    profileVisible: boolean;
    showActivityStatus: boolean;
  };
}

interface SettingsProviderProps {
  initialData?: Partial<SettingsData>;
  children?: React.ReactNode;
}

// Create a context to share the settings dialog state across your app
interface SettingsContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  openSettings: () => void;
  closeSettings: () => void;
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(
  undefined
);

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}

export function SettingsProvider({
  initialData,
  children,
}: SettingsProviderProps) {
  const [open, setOpen] = React.useState(false);

  const openSettings = React.useCallback(() => setOpen(true), []);
  const closeSettings = React.useCallback(() => setOpen(false), []);

  // Save handler for API calls
  const handleSave = async (data: Partial<SettingsData>) => {
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const result = await response.json();
      
      // TODO: Show success toast
      console.log("Settings saved successfully:", result);
      
      return result;
    } catch (error) {
      // TODO: Show error toast
      console.error("Error saving settings:", error);
      throw error;
    }
  };

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen,
      openSettings,
      closeSettings,
    }),
    [open, openSettings, closeSettings]
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
      <SettingsDialog
        open={open}
        onOpenChange={setOpen}
        initialData={initialData}
        onSave={handleSave}
        ThemeToggle={ModeToggle}
      />
    </SettingsContext.Provider>
  );
}