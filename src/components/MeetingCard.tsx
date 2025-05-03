import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "../../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CalendarIcon, Clock, Users, VideoIcon, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

type Interview = Doc<"interviews">;

function MeetingCard({ interview }: { interview: Interview }) {
  const { joinMeeting } = useMeetingActions();
  const status = getMeetingStatus(interview);
  const formattedDate = format(new Date(interview.startTime), "EEEE, MMMM d · h:mm a");

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
        <div className={`h-2 w-full ${
          status === "live" ? "bg-green-500" : 
          status === "upcoming" ? "bg-blue-500" : 
          "bg-zinc-500"
        }`} />
        
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-primary" />
                {format(new Date(interview.startTime), "MMMM d")}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                {format(new Date(interview.startTime), "h:mm a")}
              </div>
            </div>

            <Badge
              variant={
                status === "live" ? "default" : 
                status === "upcoming" ? "secondary" : 
                "outline"
              }
              className="flex items-center gap-1"
            >
              {status === "live" && <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
              {status === "live" ? "Live Now" : 
               status === "upcoming" ? "Upcoming" : 
               "Completed"}
            </Badge>
          </div>

          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <VideoIcon className="h-5 w-5 text-primary" />
              {interview.title}
            </CardTitle>

            {interview.description && (
              <CardDescription className="line-clamp-2 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                {interview.description}
              </CardDescription>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>2 Participants</span>
          </div>

          {status === "live" && (
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 gap-2" 
              onClick={() => joinMeeting(interview.streamCallId)}
            >
              <VideoIcon className="h-4 w-4" />
              Join Meeting
            </Button>
          )}

          {status === "upcoming" && (
            <Button variant="outline" className="w-full gap-2" disabled>
              <Clock className="h-4 w-4" />
              Waiting to Start
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
export default MeetingCard;
