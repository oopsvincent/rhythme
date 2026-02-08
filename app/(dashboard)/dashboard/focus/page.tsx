import { SiteHeader } from "@/components/site-header";
import FocusTimer from "@/components/focus-timer";

export default function FocusPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col px-10">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <FocusTimer />
          </div>
        </div>
      </div>
    </>
  );
}
