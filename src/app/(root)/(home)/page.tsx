"use client";

import ActionCard from "@/components/ActionCard";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import LoaderUI from "@/components/LoaderUI";
import { Loader2Icon } from "lucide-react";
import MeetingCard from "@/components/MeetingCard";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();  // Move this line here
  const { isInterviewer, isCandidate, isLoading } = useUserRole();
  const interviews = useQuery(api.interviews.getMyInterviews);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };

  if (isLoading) return <LoaderUI />;

  return (
    <div className="container max-w-10xl mx-auto p-6 relative min-h-screen">
      {/* Premium Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-800 via-blue-600/80 to-blue-500 dark:from-blue-550 dark:via-blue-900/20 dark:to-blue-850" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] opacity-50" />
      </div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 border border-blue-700/50 dark:border-blue-600/50 shadow-xl mb-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-green-400 to-green-600 bg-clip-text text-transparent">
              Welcome back, {user?.firstName || 'Guest'}!
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300 text-lg">
              {isInterviewer
                ? "Manage your interviews and review candidates effectively"
                : "Access your upcoming interviews and preparations"}
            </p>
          </div>
          
        </div>
      </motion.div>

      {isInterviewer ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {QUICK_ACTIONS.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-sm"
              >
                <ActionCard action={action} onClick={() => handleQuickAction(action.title)} />
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-xl p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-4">
              Your Interviews
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300 text-lg mb-8">
              View and join your scheduled interviews
            </p>

            {interviews === undefined ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-xl bg-primary/20" />
                  <Loader2Icon className="size-12 animate-spin text-primary relative" />
                </div>
              </div>
            ) : interviews.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {interviews.map((interview, index) => (
                  <motion.div
                    key={interview._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-sm"
                  >
                    <MeetingCard interview={interview} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center justify-center min-h-[300px] gap-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-3xl bg-primary/20" />
                  <p className="text-2xl font-medium text-zinc-600 dark:text-zinc-300 relative">
                    No interviews scheduled
                  </p>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Your upcoming interviews will appear here
                </p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}

      <MeetingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
        isJoinMeeting={modalType === "join"}
      />
    </div>
  );
}
