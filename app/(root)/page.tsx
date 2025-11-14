import Footer from "@/components/footer";
import RhythmeLanding from "@/components/landing-page";
import LandingPageWrapper from "@/components/landing-provider";
import PricingComponent from "@/components/pricing";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center bg-background overflow-hidden">
      <LandingPageWrapper/>
      <div id="pricing" className="mb-10">
    <PricingComponent/>
      </div>

      {/* Decorative graphics */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>
    </div>
  );
}
