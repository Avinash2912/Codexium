"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { SparklesIcon } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { motion } from "framer-motion";

function DasboardBtn() {
  const { isCandidate, isLoading } = useUserRole();

  if (isCandidate || isLoading) return null;

  return (
    <Link href={"/dashboard"}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button
          className="gap-2 font-medium bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
          size={"sm"}
        >
          <motion.div
            initial={{ opacity: 0.5, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent rotate-180 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          />
          <SparklesIcon className="size-4 animate-pulse" />
          <span className="relative z-10">Dashboard</span>
        </Button>
      </motion.div>
    </Link>
  );
}

export default DasboardBtn;
