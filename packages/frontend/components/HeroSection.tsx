import Link from "next/link";
import Button from "./ui/Buttons";

type Props = {
  onLaunch: () => void;
};

import CodeHexagon from "./ui/HeroBadge";

export default function HeroSection({ onLaunch }: Props) {
  return (
    <section className="relative min-h-screen flex items-center pt-5 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 hero-grid opacity-40" />

      {/* Purple glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full blur-3xl opacity-20 bg-accent" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left */}

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-base bg-surface text-xs text-secondary mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            On-chain · Verifiable · Forever
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-primary mb-4">
            Prove Your Skills. <br />
            Own Your{" "}
            <span style={{ color: "var(--accent)" }}>Achievements.</span>
          </h1>

          <p className="text-lg text-secondary mb-8 max-w-md leading-relaxed">
            Connect your GitHub, showcase your work and mint verifiable NFTs
            that represent your skills on-chain.
          </p>

          <p className="text-sm text-secondary mb-8">
            Trusted by thousands of developers
          </p>

          <div className="flex flex-wrap gap-4">
            {/* <Link href="/dashboard"> */}
            <Button variant="primary" size="lg" onClick={onLaunch}>
              Connect Wallet
            </Button>
            {/* </Link> */}

            <Link href="#features">
              <Button variant="secondary" size="lg">
                Explore Achievements
              </Button>
            </Link>
          </div>
        </div>

        {/* Right — NFT Card */}
        <div className="flex flex-col items-center lg:items-end gap-2">
          <div className=" transform perspective-[1000px]">
            <div className="relative transform-[rotateY(25deg)] transform-3d">
              {/* Glow behind card */}
              <div
                className="absolute inset-0 rounded-2xl blur-2xl opacity-30 scale-95"
                style={{ background: "var(--accent)" }}
              />
              <div className="relative nft-card rounded-2xl p-6 w-72">
                <div className="text-xs text-secondary mb-4 font-medium tracking-widest uppercase">
                  NFT
                </div>
                <div
                  className="w-full aspect-square rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg, #6d28d9, #4c1d95)",
                  }}
                >
                  <CodeHexagon />
                  {/* <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <path
                      d="M20 60V30l20-10 20 10v30L40 70 20 60z"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                      opacity=".5"
                    />
                    <path
                      d="M34 38h12M34 44h8M34 50h10"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="40" cy="32" r="4" fill="white" opacity=".8" />
                  </svg> */}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-primary font-semibold text-lg mb-1 ">
              GitHub Verified Developer
            </div>
            <div className="text-secondary text-xs mb-4">
              Minted to 0xA3...F89c
            </div>
            <Button variant="primary" size="lg">
              View on Chain →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
