"use client";

import NavigationBar from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorkSection";
import AchievementsSection from "@/components/AchievementSection";
import CTASection from "@/components/CTAsection";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OnboardingModal } from "./OnboardingModal";
import { useLogin } from "./hooks/useLogin";
export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  const { status } = useSession();
  const router = useRouter();

  const { allDone, isConnected, githubConnected } = useLogin();

  useEffect(() => {
    if (status === "loading") return;

    if (allDone) {
      sessionStorage.removeItem("skillchain_onboarding");

      setShowModal(false);

      router.push("/dashboard");

      return;
    }

    // Only reopen modal if user intentionally started the flow
    const started = sessionStorage.getItem("skillchain_onboarding");

    if (started && isConnected && !githubConnected) {
      setShowModal(true);
    }
  }, [allDone, isConnected, githubConnected, status, router]);

  const handleClick = () => {
    if (allDone) {
      router.push("/dashboard");
    } else {
      sessionStorage.setItem("skillchain_onboarding", "true");
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <NavigationBar onLaunch={handleClick} />
      <HeroSection onLaunch={handleClick} />
      <FeaturesSection />
      <HowItWorksSection />
      <AchievementsSection />
      <CTASection />

      {showModal && <OnboardingModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
