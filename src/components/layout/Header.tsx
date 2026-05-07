"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import { useVoting } from "@/hooks/useVoting";
import { useAccount } from "wagmi";

const LINKS: { href: string; label: string; page: string }[] = [
  { href: "/voting", label: "Vote", page: "voting" },
  { href: "/results", label: "Results", page: "results" },
  { href: "/history", label: "History", page: "history" },
];

export default function Header({
  activePage,
}: {
  activePage: string;
}) {
  const { address } = useAccount();
  const { owner } = useVoting();
  const isOwner = address?.toLowerCase() === owner?.toLowerCase();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-muted-blue/10 border-b border-muted-blue/20 backdrop-blur-sm relative z-50">
      <Link href="/" className="text-xl font-bold text-soft-purple hover:text-soft-purple/80 transition">
        VoteChain
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-3 relative">
        {LINKS.map(({ href, label, page }) => (
          <Link
            key={page}
            href={href}
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
            {label}
          </Link>
        ))}
        {isOwner && (
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
        )}
        <WalletConnectButton />
      </nav>

      {/* Mobile hamburger */}
      <button
        className="md:hidden p-2 text-muted-blue hover:text-light-pink transition"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-deep-navy border-b border-muted-blue/20 overflow-hidden md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {LINKS.map(({ href, label, page }) => (
                <Link
                  key={page}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    activePage === page
                      ? "text-white bg-soft-purple/20"
                      : "text-muted-blue hover:text-light-pink hover:bg-muted-blue/10",
                  )}
                >
                  {label}
                </Link>
              ))}
              {isOwner && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    activePage === "admin"
                      ? "text-white bg-soft-purple/20"
                      : "text-muted-blue hover:text-light-pink hover:bg-muted-blue/10",
                  )}
                >
                  Admin
                </Link>
              )}
              <div className="pt-2 pb-1">
                <WalletConnectButton />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}