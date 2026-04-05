"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Candidate {
  name: string;
  voteCount: number;
}

export default function CandidateSelector({
  candidates,
  onSelect,
  selected,
}: {
  candidates: Candidate[];
  onSelect: (name: string) => void;
  selected: string | null;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {candidates.map((c, i) => (
        <button
          key={i}
          onClick={() => onSelect(c.name)}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-soft-purple focus-visible:ring-offset-2 focus-visible:ring-offset-deep-navy rounded-2xl"
        >
          <Card
            className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selected === c.name
                ? "border-soft-purple shadow-lg shadow-soft-purple/20 bg-muted-blue/15"
                : "border-muted-blue/30 hover:border-soft-purple/50 bg-muted-blue/5"
            }`}
          >
            <CardHeader className="pb-1 pt-4 px-4">
              <h3 className="text-lg font-bold text-white">{c.name}</h3>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Badge variant={selected === c.name ? "default" : "secondary"}>
                {c.voteCount} {c.voteCount === 1 ? "vote" : "votes"}
              </Badge>
            </CardContent>
            {selected === c.name && (
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-soft-purple animate-pulse" />
            )}
          </Card>
        </button>
      ))}
    </div>
  );
}
