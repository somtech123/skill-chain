import Link from "next/link";
import Button from "./ui/Buttons";

export default function CTASection() {
  return (
    <>
      {/* CTA */}
      <section className="py-24 bg-base">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div
            className="rounded-2xl p-12 border border-base relative overflow-hidden"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div
              className="absolute inset-0 opacity-10 blur-3xl"
              style={{ background: "var(--accent)" }}
            />
            <div className="relative">
              <h2 className="text-4xl font-bold text-primary mb-4">
                Ready to own your skills?
              </h2>
              <p className="text-secondary mb-8">
                Join thousands of developers building their verifiable on-chain
                identity.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/dashboard">
                  {/* <button className="btn-primary px-8 py-3 rounded-lg font-medium">
                    Connect Wallet
                  </button> */}
                  <Button variant="primary" size="lg">
                    Connect Wallet
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="secondary" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-base bg-base py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-xs">
              SC
            </div>
            <span className="font-semibold text-primary">SkillChain</span>
          </div>
          <p className="text-sm text-secondary">
            © {new Date().getFullYear()} SkillChain. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Docs"].map((link) => (
              <Link
                key={link}
                href="#"
                className="text-sm text-secondary hover:text-primary transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
