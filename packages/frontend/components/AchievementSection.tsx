const achievements = [
  {
    id: "#1245",
    title: "GitHub Verified Developer",
    color: "#7c3aed",
    icon: "✓",
  },
  {
    id: "#0987",
    title: "Open Source Contributor",
    color: "#059669",
    icon: "◆",
  },
  { id: "#0510", title: "Solidity Builder", color: "#d97706", icon: "⬡" },
  { id: "#0543", title: "Smart Contract Auditor", color: "#dc2626", icon: "◉" },
  { id: "#0231", title: "Polygon Builder", color: "#7c3aed", icon: "△" },
];

export default function AchievementsSection() {
  return (
    <section id="achievements" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-base bg-base text-xs text-secondary mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              NFT Achievements
            </div>
            <h2 className="text-4xl font-bold text-primary mb-4">
              Your skills, minted forever
            </h2>
            <p className="text-secondary mb-8 leading-relaxed">
              Each achievement is a unique NFT stored in your wallet —
              verifiable by anyone, owned by you, forever on-chain.
            </p>

            {/* Profile preview */}
            <div className="bg-base rounded-xl border border-base p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                  AD
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">
                      Alex Developer
                    </span>
                    <span className="text-accent text-xs">✓</span>
                  </div>
                  <p className="text-xs text-secondary">
                    Full Stack Developer · Web3 Builder
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-center border-t border-base pt-4">
                {[
                  { label: "Achievements", value: "5" },
                  { label: "NFTs Minted", value: "5" },
                  { label: "Skill Score", value: "875" },
                  { label: "Reputation", value: "Top 12%" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="font-bold text-lg"
                      style={{
                        color:
                          stat.label === "Reputation"
                            ? "var(--accent)"
                            : "var(--text-primary)",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-secondary">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — NFT Grid */}
          <div>
            <div className="grid grid-cols-3 gap-4">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className="nft-card rounded-xl p-4 border border-base bg-base hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  <div
                    className="w-full aspect-square rounded-lg flex items-center justify-center text-2xl text-white mb-3"
                    style={{
                      background: `linear-gradient(135deg, ${a.color}cc, ${a.color})`,
                    }}
                  >
                    {a.icon}
                  </div>
                  <div className="text-xs font-medium text-primary leading-tight mb-1">
                    {a.title}
                  </div>
                  <div className="text-xs text-secondary">{a.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
