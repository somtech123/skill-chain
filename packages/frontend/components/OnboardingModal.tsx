"use client";

import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSession, signIn } from "next-auth/react";
import { Status } from "@my-app/shared";

type Props = {
  onClose: () => void;
  status: Status;
};

export function OnboardingModal({ onClose, status }: Props) {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { data: session, status: sessionStatus } = useSession();

  const githubConnected = !!session?.user?.githubConnected;
  const isPending = status === "pending";

  if (sessionStatus === "loading") {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-base rounded-2xl p-8 w-full max-w-md text-center">
          <p className="text-secondary text-sm">Checking your session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-base rounded-2xl p-8 w-full max-w-md border border-base relative">
        {/* Close button */}
        {!isPending && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors"
          >
            ✕
          </button>
        )}

        {/* Step indicators */}
        <div className="flex items-center gap-3 mb-8">
          <Step
            number={1}
            done={isConnected}
            active={!isConnected}
            label="Wallet"
          />
          <div className="flex-1 h-px bg-nav-border" />
          <Step
            number={2}
            done={githubConnected}
            active={isConnected && !githubConnected}
            label="GitHub"
          />
          <div className="flex-1 h-px bg-nav-border" />
          <Step
            number={3}
            done={isConnected && githubConnected}
            active={isConnected && githubConnected}
            label="Dashboard"
          />
        </div>

        {/* Step 1: Connect wallet */}
        {!isConnected && (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <WalletIcon />
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">
              Connect your wallet
            </h2>
            <p className="text-secondary text-sm mb-6">
              Your wallet is your identity on SkillChain. Connect to get
              started.
            </p>
            <button
              onClick={openConnectModal}
              className="btn-primary w-full py-3 rounded-xl font-semibold"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* Step 2: Connect GitHub */}
        {isConnected && !githubConnected && (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <GitHubIcon />
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">
              Connect GitHub
            </h2>
            <p className="text-secondary text-sm mb-2">
              Wallet connected{" "}
              <span className="text-accent font-mono text-xs">
                {address?.slice(0, 6)}…{address?.slice(-4)}
              </span>
            </p>
            <p className="text-secondary text-sm mb-6">
              Authorize GitHub so we can verify your repositories and
              contributions.
            </p>
            <button
              onClick={() => {
                localStorage.setItem("skillchain_onboarding", "true");
                signIn("github", { callbackUrl: window.location.origin });
              }}
              className="btn-primary w-full py-3 rounded-xl font-semibold"
            >
              Authorize with GitHub
            </button>
          </div>
        )}

        {isPending && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-blue-600 font-medium">
              Submitting proof on-chain...
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Please confirm the transaction in your wallet
            </p>
          </div>
        )}

        {/* error state */}
        {status === "error" && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
            <p className="text-sm text-red-600">
              Transaction failed. Please try again.
            </p>
          </div>
        )}

        {/* Step 3: Redirecting */}
        {isConnected && githubConnected && (
          <div className="text-center">
            <p className="text-secondary text-sm">
              Taking you to your dashboard…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Step({
  number,
  done,
  active,
  label,
}: {
  number: number;
  done: boolean;
  active: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
          ${
            done
              ? "bg-accent text-white"
              : active
                ? "border-2 border-accent text-accent"
                : "border-2 border-nav-border text-secondary"
          }`}
      >
        {done ? "✓" : number}
      </div>
      <span className="text-xs text-secondary">{label}</span>
    </div>
  );
}

function WalletIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 14a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
      <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  );
}
