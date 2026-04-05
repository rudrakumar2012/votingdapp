"use client";

import { AnimatePresence, motion } from "framer-motion";

interface Props {
  status: "pending" | "confirming" | "confirmed" | "rejected";
  txHash: string | null;
  candidateName: string | null;
  onClose: () => void;
  errorMsg: string | null;
}

const icons: Record<string, React.ReactNode> = {
  pending: (
    <div className="inline-block w-10 h-10 border-4 border-soft-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
  ),
  confirming: (
    <div className="inline-block w-10 h-10 border-4 border-soft-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
  ),
  confirmed: (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="text-4xl mb-3 text-green-400"
    >
      ✓
    </motion.div>
  ),
  rejected: (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="text-4xl mb-3 text-red-400"
    >
      ✕
    </motion.div>
  ),
};

const titles: Record<string, string> = {
  pending: "Approve Transaction",
  confirming: "Confirming...",
  confirmed: "Vote Confirmed!",
  rejected: "Transaction Rejected",
};

const descriptions: Record<string, string> = {
  pending: "Check your wallet to confirm the vote.",
  confirming: "Your vote is being confirmed on-chain.",
  confirmed: "Your vote has been permanently recorded.",
  rejected: "The transaction was rejected.",
};

export default function TxStatusModal({ status, txHash, candidateName, onClose, errorMsg }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-deep-navy border border-muted-blue/30 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            {icons[status]}
            <h3 className="text-lg font-bold text-white">{titles[status]}</h3>
            <p className="text-sm text-muted-blue mt-2">
              {status === "rejected" ? (
                errorMsg || "You rejected the transaction in your wallet."
              ) : (
                <>
                  {descriptions[status]}
                  {candidateName && (
                    <> Vote for <strong className="text-light-pink">{candidateName}</strong></>
                  )}
                </>
              )}
            </p>
          </div>

          {txHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs text-soft-purple hover:text-light-pink mt-4 break-all"
            >
              {txHash}
            </a>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
