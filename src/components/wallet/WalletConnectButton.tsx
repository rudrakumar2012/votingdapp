"use client";

import { useEffect, useState } from "react";

export default function WalletConnectButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  // @ts-ignore — w3m-button is a custom element from @web3modal/wagmi
  return <w3m-button />;
}
