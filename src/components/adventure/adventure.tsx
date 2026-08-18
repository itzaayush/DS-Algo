"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getGameLevel } from "@/content/adventure";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { isWebGLAvailable } from "@/lib/webgl";
import { WorldMap } from "./world-map";
import { LevelView } from "./level-view";

export function Adventure() {
  const reducedMotion = usePrefersReducedMotion();
  const [webglOk, setWebglOk] = useState(true);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
  }, []);

  const level = activeLevel ? getGameLevel(activeLevel) : null;

  return (
    <AnimatePresence mode="wait">
      {level ? (
        <motion.div
          key={level.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <LevelView
            level={level}
            webglOk={webglOk}
            reducedMotion={reducedMotion}
            onExit={() => setActiveLevel(null)}
          />
        </motion.div>
      ) : (
        <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <WorldMap onEnter={setActiveLevel} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
