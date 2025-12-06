import { SiteHeader } from "@/components/site-header";
import FocusTimer from "@/components/focus-timer";

export default function FocusPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <SiteHeader />
      <FocusTimer />
    </div>
  );
}
