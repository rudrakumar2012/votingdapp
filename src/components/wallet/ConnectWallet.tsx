"use client";

import { useDisconnect } from "wagmi";

export default function ConnectWallet() {
  const { disconnect } = useDisconnect();

  return (
    <div className="flex items-center gap-3">
      {/* Wagmi connect button is rendered below via useWeb3Modal */}
      <button
        className="text-sm text-light-pink hover:text-white px-3 py-1.5 rounded-lg border border-soft-purple/50 transition"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
}
