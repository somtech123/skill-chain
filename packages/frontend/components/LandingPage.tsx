"use client";

import NavigationBar from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorkSection";
import AchievementsSection from "@/components/AchievementSection";
import CTASection from "@/components/CTAsection";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OnboardingModal } from "./OnboardingModal";
import { useLogin } from "./hooks/useLogin";
export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  const { status: sessionStatus, data: session } = useSession();
  const router = useRouter();

  const { allDone, isConnected, githubConnected, status } = useLogin();

  useEffect(() => {
    if (sessionStatus === "loading") return;
    const sessionExists = !!session?.user?.id;

    // done — clear flag, close modal, redirect
    if (
      sessionExists &&
      (status === "success" || status === "already_claimed")
    ) {
      localStorage.removeItem("skillchain_onboarding");

      setShowModal(false);
      router.push("/dashboard");
      return;
    }

    // Only reopen modal if user intentionally started the flow but hasn't finished
    const started = localStorage.getItem("skillchain_onboarding");
    if (started) {
      if (!isConnected || !githubConnected) {
        // Keep modal open while waiting for either step
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    }
  }, [allDone, isConnected, githubConnected, sessionStatus, status, router]);

  const handleClick = () => {
    const sessionExists = !!session?.user?.id;
    if (
      sessionExists &&
      (status === "success" || status === "already_claimed")
    ) {
      router.push("/dashboard");
    } else {
      localStorage.setItem("skillchain_onboarding", "true");
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

      {showModal && (
        <OnboardingModal onClose={() => setShowModal(false)} status={status} />
      )}
    </div>
  );
}
