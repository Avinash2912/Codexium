import { motion } from "framer-motion";

function LoaderUI() {
  return (
    <div className="h-[calc(100vh-4rem-1px)] flex items-center justify-center relative">
      {/* Background Effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#18181855_1px,transparent_1px),linear-gradient(to_bottom,#18181855_1px,transparent_1px)]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/30 via-purple-500/20 to-pink-500/30 blur-[100px]" />
      </div>

      {/* Loading Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="size-24 rounded-full border-4 border-primary/20 border-t-primary shadow-lg"
          />
          
          {/* Middle Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 size-16 m-auto rounded-full border-4 border-purple-500/20 border-t-purple-500"
          />
          
          {/* Inner Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 size-8 m-auto rounded-full border-4 border-pink-500/20 border-t-pink-500"
          />
          
          {/* Center Dot */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 m-auto size-4 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2 text-center"
        >
          <p className="text-2xl font-semibold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Loading
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Please wait while we prepare your experience
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoaderUI;
