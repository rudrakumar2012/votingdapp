"use client";

import { useState } from "react";
import { motion, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedTooltip({
  items,
}: {
  items: { id: number; name: string; designation: string; image: string }[];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };

  return (
    <>
      {items.map((item, idx) => {
        const x = useMotionValue(0);
        const rotate = useSpring(
          useTransform(x, [-100, 100], [-45, 45]),
          springConfig,
        );
        return (
          <div
            key={item.name}
            className={cn(
              "-mr-4 relative group",
            )}
            onMouseEnter={() => setHoveredIndex(item.id)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence mode="popLayout">
              {hoveredIndex === item.id && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 260,
                      damping: 10,
                    },
                  }}
                  exit={{ opacity: 0, y: 20, scale: 0.6 }}
                  style={{
                    translateX: "-50%",
                    translateY: "-50%",
                    top: "-50%",
                    left: "50%",
                    zIndex: 50,
                  }}
                  className="absolute flex items-center justify-center"
                >
                  <div className="bg-deep-navy border border-muted-blue/30 rounded-lg p-2 text-xs shadow-xl">
                    <p className="text-white font-semibold">{item.name}</p>
                    <p className="text-muted-blue text-[10px]">{item.designation}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              style={{ x }}
              dragElastic={0.5}
              drag="x"
            >
              <div className="w-10 h-10 rounded-full bg-soft-purple/20 border border-muted-blue/30 flex items-center justify-center text-sm text-light-pink">
                {item.name.charAt(0)}
              </div>
            </motion.div>
          </div>
        );
      })}
    </>
  );
}
