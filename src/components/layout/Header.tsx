"use client";

export default function Header({ activePage, onNavigate }: { activePage: "voting" | "results"; onNavigate: (page: "voting" | "results") => void }) {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between bg-muted-blue/40 backdrop-blur">
      <h1 className="text-xl font-bold text-light-pink">VoteChain</h1>
      <nav className="flex gap-2">
        <button
          onClick={() => onNavigate("voting")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activePage === "voting" ? "bg-soft-purple text-white" : "text-muted-blue hover:text-light-pink"
          }`}
        >
          Vote
        </button>
        <button
          onClick={() => onNavigate("results")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activePage === "results" ? "bg-soft-purple text-white" : "text-muted-blue hover:text-light-pink"
          }`}
        >
          Results
        </button>
      </nav>
    </header>
  );
}
