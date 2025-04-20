"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import LoaderUI from "@/components/LoaderUI";
import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INTERVIEW_CATEGORY } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, CheckCircle2Icon, ClockIcon, XCircleIcon } from "lucide-react";
import { format } from "date-fns";
import CommentDialog from "@/components/CommentDialog";

type Interview = Doc<"interviews">;

function DashboardPage() {
  const users = useQuery(api.users.getUsers);
  const interviews = useQuery(api.interviews.getAllInterviews);
  const updateStatus = useMutation(api.interviews.updateInterviewStatus);

  const handleStatusUpdate = async (interviewId: Id<"interviews">, status: string) => {
    try {
      await updateStatus({ id: interviewId, status });
      toast.success(`Interview marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (!interviews || !users) return <LoaderUI />;

  const groupedInterviews = groupInterviews(interviews);

  return (
    <div className="container mx-auto py-10 min-h-screen relative">
      {/* Premium Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#18181855_1px,transparent_1px),linear-gradient(to_bottom,#18181855_1px,transparent_1px)]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-primary/20 dark:bg-primary/10 blur-[100px]" />
      </div>

      <div className="flex items-center mb-12 justify-between">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Interview Dashboard
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 text-lg">
            Monitor and manage your interview pipeline
          </p>
        </div>
        <Link href="/schedule">
          <Button className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-lg transition-all duration-300">
            Schedule New Interview
          </Button>
        </Link>
      </div>

      <div className="space-y-12">
        {INTERVIEW_CATEGORY.map(
          (category) =>
            groupedInterviews[category.id]?.length > 0 && (
              <section key={category.id} className="space-y-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {category.title}
                  </h2>
                  <Badge variant={category.variant} className="px-3 py-1 text-sm font-medium">
                    {groupedInterviews[category.id].length}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedInterviews[category.id].map((interview: Interview) => {
                    const candidateInfo = getCandidateInfo(users, interview.candidateId);
                    const startTime = new Date(interview.startTime);

                    return (
                      <Card className="group hover:shadow-xl transition-all duration-500 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm bg-white/50 dark:bg-black/50">
                        <CardHeader className="p-6">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                              <AvatarImage src={candidateInfo.image} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {candidateInfo.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                                {candidateInfo.name}
                              </CardTitle>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {interview.title}
                              </p>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="px-6 pb-6">
                          <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-5 w-5 text-primary/70" />
                              {format(startTime, "MMM dd")}
                            </div>
                            <div className="flex items-center gap-2">
                              <ClockIcon className="h-5 w-5 text-primary/70" />
                              {format(startTime, "hh:mm a")}
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="px-6 pb-6 pt-0 flex flex-col gap-3">
                          {interview.status === "completed" && (
                            <div className="flex gap-3 w-full">
                              <Button
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg transition-all duration-300"
                                onClick={() => handleStatusUpdate(interview._id, "succeeded")}
                              >
                                <CheckCircle2Icon className="h-4 w-4 mr-2" />
                                Pass
                              </Button>
                              <Button
                                variant="destructive"
                                className="flex-1 shadow-lg transition-all duration-300"
                                onClick={() => handleStatusUpdate(interview._id, "failed")}
                              >
                                <XCircleIcon className="h-4 w-4 mr-2" />
                                Fail
                              </Button>
                            </div>
                          )}
                          <CommentDialog interviewId={interview._id} />
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
}
export default DashboardPage;
