"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig, projectId } from "@/config/wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";

if (projectId) {
  createWeb3Modal({
    wagmiConfig,
    projectId,
    themeMode: "dark",
    themeVariables: {
      "--w3m-color-mix": "#1F2544",
      "--w3m-color-mix-strength": 80,
      "--w3m-accent": "#81689D",
      "--w3m-border-radius-master": "8px",
    },
  });
}

const queryClient = new QueryClient();

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
