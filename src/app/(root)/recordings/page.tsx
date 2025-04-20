"use client";

import LoaderUI from "@/components/LoaderUI";
import RecordingCard from "@/components/RecordingCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetCalls from "@/hooks/useGetCalls";
import { CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function RecordingsPage() {
  const { calls, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!calls) return;

      try {
        // Get recordings for each call
        const callData = await Promise.all(calls.map((call) => call.queryRecordings()));
        const allRecordings = callData.flatMap((call) => call.recordings);

        setRecordings(allRecordings);
      } catch (error) {
        console.log("Error fetching recordings:", error);
      }
    };

    fetchRecordings();
  }, [calls]);

  if (isLoading) return <LoaderUI />;

  return (
    <div className="container max-w-7xl mx-auto p-6 relative min-h-screen">
      {/* Modern Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#18181855_1px,transparent_1px),linear-gradient(to_bottom,#18181855_1px,transparent_1px)]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-primary/20 dark:bg-primary/10 blur-[100px]" />
      </div>

      {/* HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-xl p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Recordings
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300 mt-2 text-lg">
          {recordings.length} {recordings.length === 1 ? "recording" : "recordings"} available
        </p>
      </motion.div>

      {/* RECORDINGS GRID */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <ScrollArea className="h-[calc(100vh-16rem)] mt-3 rounded-xl">
          {recordings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
              {recordings.map((r, index) => (
                <motion.div
                  key={r.end_time}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="backdrop-blur-sm"
                >
                  <RecordingCard recording={r} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center h-[400px] gap-4 rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50"
            >
              <p className="text-xl font-medium text-zinc-600 dark:text-zinc-300">
                No recordings available
              </p>
            </motion.div>
          )}
        </ScrollArea>
      </motion.div>
    </div>
  );
}

export default RecordingsPage;
