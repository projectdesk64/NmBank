import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface SeamlessTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const SeamlessText = ({ children, className = "", delay = 0 }: SeamlessTextProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={String(children)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, delay }}
        className={className}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
};

