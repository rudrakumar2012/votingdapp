"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-soft-purple/20 via-deep-navy to-deep-navy" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-soft-purple/10 rounded-full blur-3xl" />
        <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
          {/* Nav */}
          <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5">
            <h1 className="text-2xl font-bold text-soft-purple">VoteChain</h1>
            <Link
              href="/voting"
              className="px-5 py-2.5 rounded-xl bg-soft-purple text-white font-semibold text-sm hover:bg-soft-purple/80 transition shadow-lg shadow-soft-purple/30"
            >
              Launch App
            </Link>
          </nav>

          {/* Content */}
          <div className="max-w-3xl space-y-6">
            <p className="text-sm uppercase tracking-[0.2em] text-soft-purple font-medium">
              Decentralized Voting on Blockchain
            </p>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
              Vote with
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-soft-purple to-light-pink">
                confidence
              </span>
            </h2>
            <p className="text-lg text-muted-blue max-w-xl mx-auto leading-relaxed">
              Transparent, tamper-proof voting recorded on the Sepolia blockchain. Every vote is
              public, verifiable, and immutable.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/voting"
                className="px-8 py-4 rounded-2xl bg-soft-purple text-white font-bold text-lg hover:bg-soft-purple/80 transition shadow-xl shadow-soft-purple/30"
              >
                Start Voting
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 rounded-2xl border-2 border-muted-blue/40 text-white font-semibold hover:border-soft-purple/60 transition"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 animate-bounce">
            <svg
              className="w-6 h-6 text-muted-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-3">Why VoteChain?</h3>
          <p className="text-muted-blue max-w-lg mx-auto">
            Built for transparency, security, and real-time visibility.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "\u{1F517}",
              title: "On-Chain Transparency",
              desc: "Every vote is permanently recorded on the Sepolia blockchain \u2014 publicly verifiable and tamper-proof.",
            },
            {
              icon: "\u{1F512}",
              title: "One Person, One Vote",
              desc: "Wallet-based identity prevents duplicate voting. Each connected wallet can cast exactly one vote.",
            },
            {
              icon: "\u{1F4CA}",
              title: "Live Results",
              desc: "Watch votes count in real-time as they're cast. Results update live \u2014 no waiting, no surprises.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-8 rounded-2xl border border-muted-blue/30 bg-muted-blue/5 hover:border-soft-purple/50 hover:bg-muted-blue/10 transition"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h4 className="text-xl font-bold text-white mb-2">{f.title}</h4>
              <p className="text-muted-blue leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-24 bg-muted-blue/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-3">How It Works</h3>
            <p className="text-muted-blue">
              Three simple steps. No registration, no signups.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "Connect Wallet",
                desc: "Connect MetaMask or any Ethereum wallet. We support Sepolia testnet.",
              },
              {
                step: "2",
                title: "Choose Candidate",
                desc: "Browse the candidate list, select your pick, and review your choice.",
              },
              {
                step: "3",
                title: "Vote & Verify",
                desc: "Submit your vote on-chain. Watch it confirm, then see live results.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-soft-purple/20 border-2 border-soft-purple flex items-center justify-center">
                  <span className="text-2xl font-bold text-soft-purple">{s.step}</span>
                </div>
                <h4 className="text-lg font-bold text-white">{s.title}</h4>
                <p className="text-muted-blue text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center pt-12">
            <Link
              href="/voting"
              className="px-8 py-4 rounded-2xl bg-soft-purple text-white font-bold text-lg hover:bg-soft-purple/80 transition shadow-xl shadow-soft-purple/30"
            >
              Go to Voting
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-3">Frequently Asked Questions</h3>
        </div>
        <div className="space-y-4">
          {[
            {
              q: "What is VoteChain?",
              a: "VoteChain is a decentralized voting application built on the Ethereum blockchain (Sepolia testnet). Every vote is recorded on-chain, making it transparent and verifiable by anyone.",
            },
            {
              q: "Which network do I need?",
              a: "Sepolia testnet. Make sure your wallet is connected to Sepolia. You'll need some test ETH for gas fees \u2014 you can get it free from Sepolia faucets.",
            },
            {
              q: "Can I vote twice?",
              a: "No. Each wallet address can cast exactly one vote. This is enforced by the smart contract \u2014 once you've voted, you cannot vote again in the same session.",
            },
            {
              q: "What happens when voting ends?",
              a: "The contract automatically calculates results. You can view the winner, vote breakdown, and full statistics on the Results page.",
            },
            {
              q: "Are my votes anonymous?",
              a: "Votes are recorded on-chain with your wallet address as a reference. Anyone can see which address voted for whom. It is designed for transparency, not anonymity.",
            },
          ].map((item) => (
            <FAQItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 bg-gradient-to-t from-soft-purple/10 to-deep-navy text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h3 className="text-4xl font-bold text-white">Ready to Cast Your Vote?</h3>
          <p className="text-muted-blue text-lg">
            Connect your wallet, choose your candidate, and make your voice heard on-chain.
          </p>
          <Link
            href="/voting"
            className="inline-block px-12 py-4 rounded-2xl bg-soft-purple text-white font-bold text-lg hover:bg-soft-purple/80 transition shadow-xl shadow-soft-purple/30"
          >
            Start Voting
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-muted-blue/20 text-center text-muted-blue text-sm">
        <p>Built on Sepolia testnet &middot; VoteChain &middot; 2026</p>
      </footer>
    </>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-muted-blue/30 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted-blue/5 transition"
      >
        <span className="font-semibold text-white">{question}</span>
        <svg
          className={`w-5 h-5 text-soft-purple transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-muted-blue leading-relaxed border-t border-muted-blue/10 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}
