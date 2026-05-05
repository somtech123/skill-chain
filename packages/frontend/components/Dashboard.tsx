import NavigationBar from "@/components/Navigation";

import HeroSection from "@/components/HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorkSection";
import AchievementsSection from "./AchievementSection";
import CTASection from "./CTAsection";
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <NavigationBar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AchievementsSection />
      <CTASection />
    </div>
  );
}
