"use client";

import * as React from "react";
import {
  Bell,
  Globe,
  Keyboard,
  Lock,
  Paintbrush,
  Settings,
  User,
  Shield,
  Menu,
  ChevronRight,
  Settings2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "@/hooks/use-media-query";

// ============================================================================
// TYPES & CONFIGURATION
// ============================================================================

interface SettingsSection {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

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

// Settings sections configuration (removed default "settings" section)
const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: "account",
    name: "Account",
    icon: User,
    description: "Manage your account info",
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    description: "Control your alerts",
  },
  {
    id: "appearance",
    name: "Appearance",
    icon: Paintbrush,
    description: "Customize your theme",
  },
  {
    id: "language",
    name: "Language & Region",
    icon: Globe,
    description: "Set your preferences",
  },
  {
    id: "accessibility",
    name: "Accessibility",
    icon: Keyboard,
    description: "Improve usability",
  },
  {
    id: "privacy",
    name: "Privacy",
    icon: Lock,
    description: "Control your data",
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    description: "Protect your account",
  },
  {
    id: "advanced",
    name: "Advanced",
    icon: Settings,
    description: "Advanced options",
  },
];

// ============================================================================
// SETTINGS CONTENT SECTIONS
// ============================================================================

interface AccountSectionProps {
  data: SettingsData["account"];
  onChange: (field: keyof SettingsData["account"], value: string) => void;
}

function AccountSection({ data, onChange }: AccountSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              placeholder="Tell us about yourself"
              value={data.bio}
              onChange={(e) => onChange("bio", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface NotificationsSectionProps {
  data: SettingsData["notifications"];
  onChange: (field: keyof SettingsData["notifications"], value: boolean) => void;
}

function NotificationsSection({ data, onChange }: NotificationsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates via email
              </p>
            </div>
            <Switch
              checked={data.email}
              onCheckedChange={(checked) => onChange("email", checked)}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about important updates
              </p>
            </div>
            <Switch
              checked={data.push}
              onCheckedChange={(checked) => onChange("push", checked)}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-base">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive news and offers
              </p>
            </div>
            <Switch
              checked={data.marketing}
              onCheckedChange={(checked) => onChange("marketing", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface AppearanceSectionProps {
  data: SettingsData["appearance"];
  onChange: (field: keyof SettingsData["appearance"], value: string) => void;
  ThemeToggle?: React.ComponentType;
}

function AppearanceSection({ data, onChange, ThemeToggle }: AppearanceSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            {ThemeToggle ? (
              <ThemeToggle />
            ) : (
              <Select
                value={data.theme}
                onValueChange={(value) => onChange("theme", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select
              value={data.fontSize}
              onValueChange={(value) => onChange("fontSize", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LanguageSectionProps {
  data: SettingsData["language"];
  onChange: (field: keyof SettingsData["language"], value: string) => void;
}

function LanguageSection({ data, onChange }: LanguageSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Language & Region</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={data.language}
              onValueChange={(value) => onChange("language", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Time Zone</Label>
            <Select
              value={data.timezone}
              onValueChange={(value) => onChange("timezone", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="est">Eastern Time</SelectItem>
                <SelectItem value="pst">Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PrivacySectionProps {
  data: SettingsData["privacy"];
  onChange: (field: keyof SettingsData["privacy"], value: boolean) => void;
}

function PrivacySection({ data, onChange }: PrivacySectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-base">Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">
                Make your profile public
              </p>
            </div>
            <Switch
              checked={data.profileVisible}
              onCheckedChange={(checked) => onChange("profileVisible", checked)}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-base">Activity Status</Label>
              <p className="text-sm text-muted-foreground">
                Show when you&lsquo;re online
              </p>
            </div>
            <Switch
              checked={data.showActivityStatus}
              onCheckedChange={(checked) => onChange("showActivityStatus", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderSection({ sectionName }: { sectionName: string }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Coming Soon</h3>
      <p className="text-muted-foreground">
        Settings for &ldquo;{sectionName}&ldquo; will be available soon.
      </p>
    </div>
  );
}

// ============================================================================
// MOBILE MENU
// ============================================================================

interface MobileMenuProps {
  activeSection: string;
  onSectionSelect: (sectionId: string) => void;
}

function MobileMenu({ activeSection, onSectionSelect }: MobileMenuProps) {
  const [open, setOpen] = React.useState(false);

  const handleSectionSelect = (sectionId: string) => {
    onSectionSelect(sectionId);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Menu className="h-4 w-4" />
          Menu
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Settings Menu</DrawerTitle>
          <DrawerDescription>Choose a category</DrawerDescription>
        </DrawerHeader>

        <div className="max-h-[60vh] overflow-y-auto px-4 pb-4">
          <div className="space-y-1">
            {SETTINGS_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = section.id === activeSection;

              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionSelect(section.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg transition-all active:scale-[0.98] ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-muted active:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div
                      className={`p-2 rounded-lg ${
                        isActive ? "bg-primary-foreground/10" : "bg-muted"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{section.name}</div>
                      <div
                        className={`text-xs ${
                          isActive
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {section.description}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// ============================================================================
// MAIN SETTINGS DIALOG
// ============================================================================

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSection?: string;
  ThemeToggle?: React.ComponentType;
  onSave?: (data: Partial<SettingsData>) => Promise<void>;
  initialData?: Partial<SettingsData>;
}

export function SettingsDialog({
  open,
  onOpenChange,
  initialSection = "account",
  ThemeToggle,
  onSave,
  initialData,
}: SettingsDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  // State management for settings data
  const [settingsData, setSettingsData] = React.useState<SettingsData>({
    account: {
      name: initialData?.account?.name || "",
      email: initialData?.account?.email || "",
      bio: initialData?.account?.bio || "",
    },
    notifications: {
      email: initialData?.notifications?.email ?? true,
      push: initialData?.notifications?.push ?? false,
      marketing: initialData?.notifications?.marketing ?? false,
    },
    appearance: {
      theme: initialData?.appearance?.theme || "system",
      fontSize: initialData?.appearance?.fontSize || "medium",
    },
    language: {
      language: initialData?.language?.language || "en",
      timezone: initialData?.language?.timezone || "utc",
    },
    privacy: {
      profileVisible: initialData?.privacy?.profileVisible ?? true,
      showActivityStatus: initialData?.privacy?.showActivityStatus ?? true,
    },
  });

  const [activeSection, setActiveSection] = React.useState(initialSection);
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  // Track changes
  React.useEffect(() => {
    setHasChanges(true);
  }, [settingsData]);

  // Generic update handler
  const updateSettings = <T extends keyof SettingsData>(
    section: T,
    field: keyof SettingsData[T],
    value?: string | boolean
  ) => {
    setSettingsData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Save handler
  const handleSave = async () => {
    if (!hasChanges) {
      onOpenChange(false);
      return;
    }

    setIsSaving(true);
    try {
      // Call the backend save function if provided
      if (onSave) {
        await onSave(settingsData);
      }
      // TODO: Show success toast
      onOpenChange(false);
      setHasChanges(false);
    } catch (error) {
      // TODO: Show error toast
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const currentSection = SETTINGS_SECTIONS.find((s) => s.id === activeSection);

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return (
          <AccountSection
            data={settingsData.account}
            onChange={(field, value) => updateSettings("account", field, value)}
          />
        );
      case "notifications":
        return (
          <NotificationsSection
            data={settingsData.notifications}
            onChange={(field, value) => updateSettings("notifications", field, value)}
          />
        );
      case "appearance":
        return (
          <AppearanceSection
            data={settingsData.appearance}
            onChange={(field, value) => updateSettings("appearance", field, value)}
            ThemeToggle={ThemeToggle}
          />
        );
      case "language":
        return (
          <LanguageSection
            data={settingsData.language}
            onChange={(field, value) => updateSettings("language", field, value)}
          />
        );
      case "privacy":
        return (
          <PrivacySection
            data={settingsData.privacy}
            onChange={(field, value) => updateSettings("privacy", field, value)}
          />
        );
      default:
        return <PlaceholderSection sectionName={currentSection?.name || activeSection} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-full p-0 md:max-h-[600px] md:max-w-[900px] w-full min-w-full md:min-w-fit">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>

        <div className="flex flex-col md:flex-row md:h-[600px]">
          {/* Desktop Sidebar */}
          {isDesktop && (
            <div className="hidden md:flex md:w-64 border-r flex-col">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  Settings
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your preferences
                </p>
              </div>
              <nav className="flex-1 overflow-y-auto p-2">
                {SETTINGS_SECTIONS.map((section) => {
                  const Icon = section.icon;
                  const isActive = section.id === activeSection;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors mb-1 ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{section.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Mobile Menu */}
                {!isDesktop && (
                  <MobileMenu
                    activeSection={activeSection}
                    onSectionSelect={setActiveSection}
                  />
                )}

                {currentSection && (
                  <>
                    <currentSection.icon className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">{currentSection.name}</h3>
                  </>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {renderContent()}
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="w-full sm:w-auto"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}