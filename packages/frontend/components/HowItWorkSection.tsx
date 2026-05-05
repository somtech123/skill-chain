const steps = [
  {
    number: "01",
    title: "Connect Wallet",
    description:
      "Link your Web3 wallet to create your SkillChain identity on-chain.",
  },
  {
    number: "02",
    title: "Connect GitHub",
    description:
      "Authorize SkillChain to read your public profile and repositories.",
  },
  {
    number: "03",
    title: "Fetch & Verify Data",
    description:
      "We analyze your contributions, stars, and open source activity.",
  },
  {
    number: "04",
    title: "Mint Your NFT",
    description:
      "Receive a verifiable NFT achievement that lives in your wallet forever.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-base">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-base bg-surface text-xs text-secondary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            Process
          </div>
          <h2 className="text-4xl font-bold text-primary mb-4">
            Four steps to ownership
          </h2>
          <p className="text-secondary max-w-xl mx-auto">
            Go from zero to verified developer in minutes.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div
            className="hidden lg:block absolute top-8 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--accent), transparent)",
            }}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 relative z-10"
                  style={{ background: "var(--accent)" }}
                >
                  {step.number}
                </div>
                <h3 className="font-semibold text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
