"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import { useVoting } from "@/hooks/useVoting";
import { useAccount } from "wagmi";

export default function Header({
  activePage,
  onNavigate,
}: {
  activePage: "voting" | "results" | "history" | "admin";
  onNavigate: (page: "voting" | "results") => void;
}) {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between bg-muted-blue/10 border-b border-muted-blue/20 backdrop-blur-sm">
      <Link href="/" className="text-xl font-bold text-soft-purple hover:text-soft-purple/80 transition">
        VoteChain
      </Link>
      <nav className="flex items-center gap-3 relative">
        {(["voting", "results"] as const).map((page) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium relative transition-colors",
              activePage === page
                ? "text-white"
                : "text-muted-blue hover:text-light-pink",
            )}
          >
            {activePage === page && (
              <motion.div
                layoutId="active-nav"
                className="absolute inset-0 bg-soft-purple rounded-lg -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {page === "voting" ? "Vote" : "Results"}
          </button>
        ))}
        <Link
          href="/history"
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium relative transition-colors",
            activePage === "history"
              ? "text-white"
              : "text-muted-blue hover:text-light-pink",
          )}
        >
          {activePage === "history" && (
            <motion.div
              layoutId="active-nav"
              className="absolute inset-0 bg-soft-purple rounded-lg -z-10"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          History
        </Link>
        {(() => {
          const { address } = useAccount();
          const { owner } = useVoting();
          const isOwner = address?.toLowerCase() === owner?.toLowerCase();
          if (!isOwner) return null;
          return (
            <Link
              href="/admin"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium relative transition-colors",
                activePage === "admin"
                  ? "text-white"
                  : "text-muted-blue hover:text-light-pink",
              )}
            >
              {activePage === "admin" && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-soft-purple rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              Admin
            </Link>
          );
        })()}
        <WalletConnectButton />
      </nav>
    </header>
  );
}
