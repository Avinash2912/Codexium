import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { LayoutListIcon, LoaderIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import EndCallButton from "./EndCallButton";
import CodeEditor from "./CodeEditor";

function MeetingRoom() {
  const router = useRouter();
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#153ca8]">
        <div className="flex flex-col items-center gap-4">
          <LoaderIcon className="size-10 animate-spin text-[#2CBB5D]" />
          <p className="text-zinc-400 font-medium">Connecting to session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#132250]">
      <ResizablePanelGroup 
        direction="horizontal" 
        className="min-h-screen lg:flex hidden"
      >
        <ResizablePanel defaultSize={32} minSize={32} maxSize={38} className="relative">
          {/* VIDEO LAYOUT */}
          <div className="absolute inset-0 bg-[#141415]">
            <div className="relative h-full">
              <div className="absolute top-4 left-0 right-0 h-2 bg-[#1E1E1E] border-b ">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-2  z-10 rounded-full bg-[#2CBB5D] animate-pulse " />
                  <p className="text-sm font-medium z-10  text-zinc-300"> Live Session</p>
                </div>
              </div>
              
              <div className="h-[calc(100%-48px)] mt-2">
                {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}
              </div>
            </div>

            {/* PARTICIPANTS LIST OVERLAY */}
            {showParticipants && (
              <div className="absolute right-0 top-12 h-[calc(100%-48px)] w-[320px] bg-[#1E1E1E] border-l border-[#313131] shadow-xl">
                <div className="p-4 border-b border-[#313131] flex items-center justify-between">
                  <h3 className="font-medium text-pink-700">Participants</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-zinc-200"
                    onClick={() => setShowParticipants(false)}
                  >
                    ✕
                  </Button>
                </div>
                <CallParticipantsList onClose={() => setShowParticipants(false)} />
              </div>
            )}
          </div>

          {/* VIDEO CONTROLS */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 ">
            <div className="flex items-center gap-2 p-2 rounded-md bg-[#161120] border border-[#313131] shadow-lg">
              <div className="flex items-center gap-2 px-2">
                <CallControls onLeave={() => router.push("/")} />
              </div>

              <div className="h-6 w-[1px] bg-[#313131]" />

              <div className="flex items-center gap-2 px-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-9 rounded-lg hover:bg-[#2A2A2A] text-zinc-300"
                    >
                      <LayoutListIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1E1E1E] border-[#313131]">
                    <DropdownMenuItem onClick={() => setLayout("grid")}
                      className="hover:bg-[#2A2A2A] text-zinc-300"
                    >
                      Grid View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLayout("speaker")}
                      className="hover:bg-[#2A2A2A] text-zinc-300"
                    >
                      Speaker View
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-lg hover:bg-[#2A2A2A] text-zinc-300"
                  onClick={() => setShowParticipants(!showParticipants)}
                >
                  <UsersIcon className="size-4" />
                </Button>

                <EndCallButton />
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-[#313131] hover:bg-[#2CBB5D] transition-colors" />

        <ResizablePanel defaultSize={65} minSize={25} className="bg-[#0F1117]">
          <div className="h-12 bg-[#1E1E1E] border-b border-[#313131] flex items-center px-4">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-medium text-zinc-300">Problem Description</h2>
              
            </div>
          </div>
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-screen">
        <div className="h-[40vh] bg-[#1A1A1A] relative">
          {/* Video Header */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-[#1E1E1E] border-b border-[#313131] flex items-center px-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2CBB5D] animate-pulse" />
              <p className="text-sm font-medium text-zinc-300">Live Session</p>
            </div>
          </div>
          
          {/* Video Layout */}
          <div className="h-[calc(100%-48px)] mt-12">
            {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
            <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-[#1E1E1E] border border-[#313131] shadow-lg">
              <div className="flex items-center gap-2 px-2">
                <CallControls onLeave={() => router.push("/")} />
              </div>

              <div className="h-6 w-[1px] bg-[#313131]" />

              <div className="flex items-center gap-2 px-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-lg hover:bg-[#2A2A2A] text-zinc-300"
                  onClick={() => setLayout(layout === "grid" ? "speaker" : "grid")}
                >
                  <LayoutListIcon className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-lg hover:bg-[#2A2A2A] text-zinc-300"
                  onClick={() => setShowParticipants(!showParticipants)}
                >
                  <UsersIcon className="size-4" />
                </Button>

                <EndCallButton />
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor Section */}
        <div className="flex-1 bg-[#0F1117] overflow-hidden">
          <div className="h-12 bg-[#1E1E1E] border-b border-[#313131] flex items-center px-4">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-medium text-zinc-300">Problem Description</h2>
              
            </div>
          </div>
          <div className="h-[calc(100%-48px)]">
            <CodeEditor />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingRoom;
