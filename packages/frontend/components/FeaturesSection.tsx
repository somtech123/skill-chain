"use client";
import { useRef } from "react";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "On-Chain Verification",
    description:
      "Your achievements are permanently stored on the blockchain — immutable, tamper-proof, and universally verifiable.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "GitHub Integration",
    description:
      "Connect your GitHub to automatically verify your repositories, contributions, and open source impact.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Developer Profile",
    description:
      "Build a public profile showcasing your verified skills, NFT achievements, skill score, and reputation.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "NFT Achievements",
    description:
      "Earn unique NFTs for your skills — GitHub Verified Developer, Open Source Contributor, Solidity Builder, and more.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M22 12h-4l-3 9L9 3l-3 9H2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Skill Score",
    description:
      "Your contributions are analyzed to compute a transparent skill score that recruiters and DAOs can trust.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="11"
          width="18"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M7 11V7a5 5 0 0110 0v4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "You Own Your Data",
    description:
      "Stored on-chain and controlled by you. No middleman. Share your profile with anyone, anywhere.",
  },
];

function FeatureCard({ f }: { f: (typeof features)[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
    position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0; height: 0;
      background: var(--accent);
      opacity: 0.2;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: ripple 500ms ease-out forwards;
      pointer-events: none;
    `;
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="feature-card relative overflow-hidden rounded-xl p-6 border border-base bg-base
                 hover:border-accent cursor-pointer select-none
                 active:scale-95
                 transition-all duration-150"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-white"
        style={{ background: "var(--accent)" }}
      >
        {f.icon}
      </div>
      <h3 className="font-semibold text-primary mb-2">{f.title}</h3>
      <p className="text-sm text-secondary leading-relaxed">{f.description}</p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-base bg-base text-xs text-secondary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            Why SkillChain
          </div>
          <h2 className="text-4xl font-bold text-primary mb-4">
            Skills that speak for themselves
          </h2>
          <p className="text-secondary max-w-xl mx-auto">
            Everything you need to prove your expertise in the decentralized
            world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} f={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
