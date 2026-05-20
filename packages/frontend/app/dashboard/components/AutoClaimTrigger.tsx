"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoClaimTrigger({ claimed }: { claimed: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (claimed) router.refresh();
  }, [claimed]);

  return null;
}
