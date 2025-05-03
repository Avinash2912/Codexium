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
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <Button
          className="gap-2 font-medium bg-[#1E1E1E] hover:bg-[#2A2A2A] text-zinc-300 border border-[#313131] shadow-lg transition-all duration-200"
          size={"sm"}
        >
          <SparklesIcon className="size-4 text-[#2CBB5D]" />
          <span>Dashboard</span>
        </Button>
      </motion.div>
    </Link>
  );
}

export default DasboardBtn;
