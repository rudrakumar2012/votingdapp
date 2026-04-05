"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Shield, Vote, BarChart3, Link2, CheckCircle, Clock, ChevronDown } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Features */}
      <FeaturesSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-soft-purple/15 via-deep-navy to-deep-navy" />
      <FloatingOrbs />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-6">
        <h1 className="text-2xl font-bold text-soft-purple">VoteChain</h1>
        <Link
          href="/voting"
          className={cn(
            buttonVariants({ variant: "brand", size: "sm" }),
          )}
        >
          Launch App
        </Link>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 -mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full border border-soft-purple/40 bg-soft-purple/10"
          >
            <span className="text-sm uppercase tracking-widest text-soft-purple font-medium">
              Decentralized Voting
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
            Vote with
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-soft-purple via-light-pink to-soft-purple">
              confidence
            </span>
          </h2>

          <TextGenerateEffect
            words="Transparent, tamper-proof voting recorded on the Sepolia blockchain. Every vote is public, verifiable, and immutable."
            className="text-lg max-w-xl mx-auto"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/voting">
              <Button variant="brand" size="lg">
                Start Voting
              </Button>
            </Link>
            <a href="#how-it-works" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              Learn More
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-muted-blue" />
        </motion.div>
      </div>
    </section>
  );
}

function FloatingOrbs() {
  return (
    <>
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-soft-purple/10 rounded-full blur-3xl"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-40 right-20 w-64 h-64 bg-light-pink/5 rounded-full blur-3xl"
        animate={{
          x: [0, -25, 35, 0],
          y: [0, 35, -15, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 left-1/3 w-48 h-48 bg-muted-blue/10 rounded-full blur-3xl"
        animate={{
          x: [0, 20, -30, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
    </>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <Link2 className="w-8 h-8 text-soft-purple" />,
      title: "On-Chain Transparency",
      desc: "Every vote is permanently recorded on the Sepolia blockchain — publicly verifiable and tamper-proof.",
    },
    {
      icon: <Shield className="w-8 h-8 text-soft-purple" />,
      title: "One Person, One Vote",
      desc: "Wallet-based identity prevents duplicate voting. Each connected wallet can cast exactly one vote.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-soft-purple" />,
      title: "Live Results",
      desc: "Watch votes count in real-time as they're cast. Results update live — no waiting, no surprises.",
    },
  ];

  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h3 className="text-3xl font-bold text-white mb-3">Why VoteChain?</h3>
        <p className="text-muted-blue max-w-lg mx-auto">
          Built for transparency, security, and real-time visibility.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <BackgroundGradient className="h-full" containerClassName="h-full">
              <div className="p-6 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-muted-blue/10 border border-muted-blue/20 flex items-center justify-center">
                  {f.icon}
                </div>
                <h4 className="text-xl font-bold text-white">{f.title}</h4>
                <p className="text-muted-blue leading-relaxed text-sm">{f.desc}</p>
              </div>
            </BackgroundGradient>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
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
  ];

  return (
    <section id="how-it-works" className="px-6 py-24 bg-muted-blue/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-3">How It Works</h3>
          <p className="text-muted-blue">
            Three simple steps. No registration, no signups.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center space-y-4"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 mx-auto rounded-full bg-soft-purple/20 border-2 border-soft-purple flex items-center justify-center"
              >
                <span className="text-2xl font-bold text-soft-purple">{s.step}</span>
              </motion.div>
              <h4 className="text-lg font-bold text-white">{s.title}</h4>
              <p className="text-muted-blue text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="text-center pt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/voting">
            <Button variant="brand" size="lg">
              Go to Voting
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "What is VoteChain?",
      a: "VoteChain is a decentralized voting application built on the Ethereum blockchain (Sepolia testnet). Every vote is recorded on-chain, making it transparent and verifiable by anyone.",
    },
    {
      q: "Which network do I need?",
      a: "Sepolia testnet. Make sure your wallet is connected to Sepolia. You'll need some test ETH for gas fees — you can get it free from Sepolia faucets.",
    },
    {
      q: "Can I vote twice?",
      a: "No. Each wallet address can cast exactly one vote. This is enforced by the smart contract — once you've voted, you cannot vote again in the same session.",
    },
    {
      q: "What happens when voting ends?",
      a: "The contract automatically calculates results. You can view the winner, vote breakdown, and full statistics on the Results page.",
    },
    {
      q: "Are my votes anonymous?",
      a: "Votes are recorded on-chain with your wallet address as a reference. Anyone can see which address voted for whom. It is designed for transparency, not anonymity.",
    },
  ];

  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-white mb-3">Frequently Asked Questions</h3>
      </div>
      <Accordion type="single" collapsible defaultValue="">
        {faqs.map((item, i) => (
          <AccordionItem key={item.q} value={`item-${i}`}>
            <AccordionTrigger className="text-white">{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function CTASection() {
  return (
    <section className="px-6 py-24 bg-gradient-to-t from-soft-purple/10 to-deep-navy text-center">
      <motion.div
        className="max-w-2xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="text-4xl font-bold text-white">Ready to Cast Your Vote?</h3>
        <p className="text-muted-blue text-lg">
          Connect your wallet, choose your candidate, and make your voice heard on-chain.
        </p>
        <Link href="/voting">
          <Button variant="brand" size="lg">
            Start Voting
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-muted-blue/20 text-center text-muted-blue text-sm">
      <p>
        Built on Sepolia testnet &middot; VoteChain &middot; {new Date().getFullYear()}
      </p>
    </footer>
  );
}
