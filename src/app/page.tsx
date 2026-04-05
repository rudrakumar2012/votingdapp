import LandingPage from "@/components/layout/LandingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VoteChain — Decentralized Voting",
  description:
    "Transparent, tamper-proof voting recorded on the Sepolia blockchain. Connect your wallet, cast your vote, view live results.",
};

export default function Home() {
  return <LandingPage />;
}
