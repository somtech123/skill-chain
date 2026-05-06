"use client";

import { useAccount } from "wagmi";
import { useEffect, useRef } from "react";

export function WalletCookieSync() {
  const { isConnected } = useAccount();
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isConnected) {
      // wallet is connected — set cookie immediately
      if (clearTimer.current) clearTimeout(clearTimer.current);
      document.cookie = "wallet_connected=true; path=/; max-age=86400";
    } else {
      // wait 2s before clearing — gives wagmi time to rehydrate on page load
      clearTimer.current = setTimeout(() => {
        document.cookie = "wallet_connected=; path=/; max-age=0";
      }, 2000);
    }

    return () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, [isConnected]);

  return null;
}
