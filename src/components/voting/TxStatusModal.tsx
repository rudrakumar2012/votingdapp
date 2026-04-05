"use client";

interface Props {
  status: "pending" | "confirming" | "confirmed" | "rejected";
  txHash: string | null;
  candidateName: string | null;
  onClose: () => void;
  errorMsg: string | null;
}

export default function TxStatusModal({ status, txHash, candidateName, onClose, errorMsg }: Props) {
  if (status === "confirmed") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-deep-navy border border-muted-blue/30 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        {status === "pending" && (
          <div className="text-center">
            <div className="inline-block w-10 h-10 border-4 border-soft-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">Approve Transaction</h3>
            <p className="text-sm text-muted-blue mt-2">
              Check your wallet to vote for <strong className="text-light-pink">{candidateName}</strong>
            </p>
          </div>
        )}

        {status === "confirming" && (
          <div className="text-center">
            <div className="inline-block w-10 h-10 border-4 border-soft-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">Confirming...</h3>
            <p className="text-sm text-muted-blue mt-2">
              Voting transaction is being confirmed on chain.
            </p>
          </div>
        )}

        {status === "rejected" && (
          <div className="text-center">
            <div className="text-4xl mb-3 text-red-400">✕</div>
            <h3 className="text-lg font-bold text-white">Transaction Rejected</h3>
            <p className="text-sm text-muted-blue mt-2">
              {errorMsg || "You rejected the transaction in your wallet."}
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 rounded-lg bg-soft-purple text-white text-sm font-medium hover:bg-soft-purple/80 transition"
            >
              Close
            </button>
          </div>
        )}

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
      </div>
    </div>
  );
}
