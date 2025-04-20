import { QuickActionType } from "@/constants";
import { Card } from "./ui/card";
import { motion } from "framer-motion";

function ActionCard({ action, onClick }: { action: QuickActionType; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="group relative overflow-hidden border-zinc-200/50 dark:border-zinc-800/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl cursor-pointer backdrop-blur-xl"
        onClick={onClick}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-black/50 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-500`}
        />
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 translate-x-full group-hover:translate-x-[-250%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
        </div>

        {/* Content */}
        <div className="relative p-6 size-full">
          <div className="space-y-4">
            {/* Icon Container */}
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${action.color}/20 shadow-lg backdrop-blur-md group-hover:shadow-xl transition-all duration-500`}
            >
              <action.icon 
                className={`h-7 w-7 text-${action.color} group-hover:scale-110 transition-transform duration-300`} 
              />
            </motion.div>

            {/* Text Content */}
            <div className="space-y-2">
              <h3 className="font-semibold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all duration-300">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground/80 group-hover:text-muted-foreground transition-colors">
                {action.description}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default ActionCard;
