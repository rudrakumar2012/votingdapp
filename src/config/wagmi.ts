import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.SEPOLIA_RPC_URL),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId,
      metadata: {
        name: "Voting DApp",
        description: "On-chain voting application on Sepolia",
        url: "https://example.com",
        icons: ["https://example.com/icon.png"],
      },
    }),
  ],
});

export { projectId, sepolia };
