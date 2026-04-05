"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/voting");
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center text-muted-blue">
      <p>Redirecting to voting...</p>
    </div>
  );
}
