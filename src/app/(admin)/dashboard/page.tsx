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
      {/* HEADER */}
      <header className="text-center py-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold">Interview Dashboard</h1>
        <p className="mt-2 text-lg">Monitor and manage your interview pipeline</p>
        <Link href="/schedule">
          <Button className="mt-4 bg-white text-blue-500 hover:bg-gray-100">
            Schedule New Interview
          </Button>
        </Link>
      </header>

      {/* INTERVIEW CATEGORIES */}
      <div className="space-y-12 mt-10">
        {INTERVIEW_CATEGORY.map(
          (category) =>
            groupedInterviews[category.id]?.length > 0 && (
              <section key={category.id} className="space-y-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
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
                      <Card
                        key={interview._id}
                        className="group hover:shadow-xl transition-all duration-500 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      >
                        <CardHeader className="p-6">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300">
                              <AvatarImage src={candidateInfo.image} />
                              <AvatarFallback className="bg-blue-500/10 text-blue-500">
                                {candidateInfo.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-xl font-semibold group-hover:text-blue-500 transition-colors duration-300">
                                {candidateInfo.name}
                              </CardTitle>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {interview.title}
                              </p>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="px-6 pb-6">
                          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-5 w-5 text-blue-500/70" />
                              {format(startTime, "MMM dd")}
                            </div>
                            <div className="flex items-center gap-2">
                              <ClockIcon className="h-5 w-5 text-blue-500/70" />
                              {format(startTime, "hh:mm a")}
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="px-6 pb-6 pt-0 flex flex-col gap-3">
                          {interview.status === "completed" && (
                            <div className="flex gap-3 w-full">
                              <Button
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all duration-300"
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
