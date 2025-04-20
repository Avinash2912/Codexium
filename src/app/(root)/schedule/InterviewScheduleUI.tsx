import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { Loader2Icon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/MeetingCard";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

function InterviewScheduleUI() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
  const users = useQuery(api.users.getUsers) ?? [];
  const createInterview = useMutation(api.interviews.createInterview);

  const candidates = users?.filter((u) => u.role === "candidate");
  const interviewers = users?.filter((u) => u.role === "interviewer");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    candidateId: "",
    interviewerIds: user?.id ? [user.id] : [],
  });

  const scheduleMeeting = async () => {
    if (!client || !user) return;
    if (!formData.candidateId || formData.interviewerIds.length === 0) {
      toast.error("Please select both candidate and at least one interviewer");
      return;
    }

    setIsCreating(true);

    try {
      const { title, description, date, time, candidateId, interviewerIds } = formData;
      const [hours, minutes] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });

      await createInterview({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: "upcoming",
        streamCallId: id,
        candidateId,
        interviewerIds,
      });

      setOpen(false);
      toast.success("Meeting scheduled successfully!");

      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        candidateId: "",
        interviewerIds: user?.id ? [user.id] : [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule meeting. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const addInterviewer = (interviewerId: string) => {
    if (!formData.interviewerIds.includes(interviewerId)) {
      setFormData((prev) => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, interviewerId],
      }));
    }
  };

  const removeInterviewer = (interviewerId: string) => {
    if (interviewerId === user?.id) return;
    setFormData((prev) => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
    }));
  };

  const selectedInterviewers = interviewers.filter((i) =>
    formData.interviewerIds.includes(i.clerkId)
  );

  const availableInterviewers = interviewers.filter(
    (i) => !formData.interviewerIds.includes(i.clerkId)
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  // Filter and sort interviews
  const filteredInterviews = interviews
    ?.filter((interview) => {
      const matchesSearch = interview.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === "all" ||
        (filter === "upcoming" && new Date(interview.startTime).getTime() > Date.now()) ||
        (filter === "completed" && new Date(interview.startTime).getTime() <= Date.now());
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return b.startTime - a.startTime;
      }
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8 relative min-h-screen">
      {/* Modern Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#18181855_1px,transparent_1px),linear-gradient(to_bottom,#18181855_1px,transparent_1px)]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-primary/20 dark:bg-primary/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-6"
      >
        {/* HEADER INFO */}
        <div className="rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-xl p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Interview Hub
              </h1>
              <p className="text-zinc-600 dark:text-zinc-300 text-lg">
                Streamline your interview process
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search interviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-[200px] bg-white/50 dark:bg-black/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50"
                />
              </div>

              <Select value={filter} onValueChange={(value: typeof filter) => setFilter(value)}>
                <SelectTrigger className="w-full sm:w-[140px] bg-white/50 dark:bg-black/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Interviews</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-lg">
                    Schedule Interview
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto backdrop-blur-xl bg-white/95 dark:bg-black/95">
                  <DialogHeader>
                    <DialogTitle>Schedule Interview</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* INTERVIEW TITLE */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="Interview title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    {/* INTERVIEW DESC */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Interview description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    {/* CANDIDATE */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Candidate</label>
                      <Select
                        value={formData.candidateId}
                        onValueChange={(candidateId) => setFormData({ ...formData, candidateId })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select candidate" />
                        </SelectTrigger>
                        <SelectContent>
                          {candidates.map((candidate) => (
                            <SelectItem key={candidate.clerkId} value={candidate.clerkId}>
                              <UserInfo user={candidate} />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* INTERVIEWERS */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Interviewers</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedInterviewers.map((interviewer) => (
                          <div
                            key={interviewer.clerkId}
                            className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                          >
                            <UserInfo user={interviewer} />
                            {interviewer.clerkId !== user?.id && (
                              <button
                                onClick={() => removeInterviewer(interviewer.clerkId)}
                                className="hover:text-destructive transition-colors"
                              >
                                <XIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {availableInterviewers.length > 0 && (
                        <Select onValueChange={addInterviewer}>
                          <SelectTrigger>
                            <SelectValue placeholder="Add interviewer" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableInterviewers.map((interviewer) => (
                              <SelectItem key={interviewer.clerkId} value={interviewer.clerkId}>
                                <UserInfo user={interviewer} />
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* DATE & TIME */}
                    <div className="flex gap-4">
                      {/* CALENDAR */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => date && setFormData({ ...formData, date })}
                          disabled={(date) => date < new Date()}
                          className="rounded-md border"
                        />
                      </div>

                      {/* TIME */}

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Time</label>
                        <Select
                          value={formData.time}
                          onValueChange={(time) => setFormData({ ...formData, time })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOTS.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={scheduleMeeting} disabled={isCreating}>
                        {isCreating ? (
                          <>
                            <Loader2Icon className="mr-2 size-4 animate-spin" />
                            Scheduling...
                          </>
                        ) : (
                          "Schedule Interview"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </motion.div>

      {/* LOADING STATE & MEETING CARDS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6"
      >
        {!interviews ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl bg-primary/20" />
              <Loader2Icon className="size-12 animate-spin text-primary relative" />
            </div>
          </div>
        ) : filteredInterviews.length > 0 ? (
          filteredInterviews.map((interview, index) => (
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
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="col-span-full flex flex-col items-center justify-center h-[400px] gap-4 rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-3xl bg-primary/20" />
              <p className="text-2xl font-medium text-zinc-600 dark:text-zinc-300 relative">
                {searchQuery ? "No matches found" : "No interviews scheduled"}
              </p>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400">
              {searchQuery ? "Try adjusting your search" : "Schedule your first interview"}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
export default InterviewScheduleUI;
