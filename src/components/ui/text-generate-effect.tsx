"use client";

import { motion, stagger, useAnimate } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function TextGenerateEffect({
  words,
  className,
}: {
  words: string;
  className?: string;
}) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const wordsArray = words.split(" ");
    animate(
      "span",
      {
        opacity: 1,
        filter: "blur(0px)",
      },
      {
        duration: 0.5,
        delay: stagger(0.15),
      },
    );
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {words.split(" ").map((word, i) => (
          <motion.span
            key={word + i}
            className="text-muted-blue opacity-0"
            style={{
              filter: "blur(10px)",
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-light", className)}>
      {renderWords()}
    </div>
  );
}
