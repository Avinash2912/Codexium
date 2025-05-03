import { motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";

function LoaderUI() {
  return (
    <div className="h-[calc(100vh-4rem-1px)] flex items-center justify-center relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#18181855_1px,transparent_1px),linear-gradient(to_bottom,#18181855_1px,transparent_1px)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-8 p-12 rounded-3xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-zinc-200/20 dark:border-zinc-800/20"
      >
        <div className="relative">
          {/* Main Loader */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="size-32 rounded-full border-8 border-zinc-200 dark:border-zinc-800 border-t-primary shadow-xl"
          />
          
          {/* Inner Spinner */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 size-16 m-auto rounded-full border-4 border-zinc-200 dark:border-zinc-800 border-t-primary/70"
          />

          {/* Center Logo or Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute inset-0 m-auto size-8 flex items-center justify-center"
          >
            <Loader2Icon className="size-8 text-primary animate-spin" />
          </motion.div>
        </div>

        <div className="space-y-3 text-center">
          <motion.div
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.98, 1, 0.98]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Loading...
            </h3>
          </motion.div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Preparing your experience
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoaderUI;
