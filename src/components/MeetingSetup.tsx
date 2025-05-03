import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { CameraIcon, MicIcon, SettingsIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
  const [isCameraDisabled, setIsCameraDisabled] = useState(true);
  const [isMicDisabled, setIsMicDisabled] = useState(false);

  const call = useCall();

  if (!call) return null;

  useEffect(() => {
    if (isCameraDisabled) call.camera.disable();
    else call.camera.enable();
  }, [isCameraDisabled, call.camera]);

  useEffect(() => {
    if (isMicDisabled) call.microphone.disable();
    else call.microphone.enable();
  }, [isMicDisabled, call.microphone]);

  const handleJoin = async () => {
    await call.join();
    onSetupComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-slate-900">
      <div className="w-full max-w-[1200px] mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl -z-10" />
        
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Welcome to the Meeting
          </h1>
          <p className="text-muted-foreground text-lg">Get ready to connect</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* VIDEO PREVIEW CONTAINER */}
          <Card className="md:col-span-1 p-6 border border-primary/20 bg-card/50 backdrop-blur-xl">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Camera Preview</h2>
              <p className="text-sm text-muted-foreground">Adjust your camera position and lighting</p>
            </div>
            <Separator className="my-4" />
            <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-card border border-primary/20 relative ring-2 ring-primary/5">
              <VideoPreview className="h-full w-full object-cover" />
            </div>
          </Card>

          {/* CARD CONTROLS */}
          <Card className="md:col-span-1 border border-primary/20 bg-card/50 backdrop-blur-xl">
            <div className="p-6 space-y-6">
              {/* MEETING DETAILS */}
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">Meeting Details</h2>
                <div className="bg-primary/5 rounded-lg p-3 font-mono text-sm border border-primary/20">
                  {call.id}
                </div>
              </div>

              <Separator />

              {/* CONTROLS GROUP */}
              <div className="space-y-4">
                {/* CAM CONTROL */}
                <div className="group flex items-center justify-between p-4 rounded-xl transition-all hover:bg-primary/5 border border-transparent hover:border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <CameraIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Camera</p>
                      <p className="text-sm text-muted-foreground">{isCameraDisabled ? "Off" : "On"}</p>
                    </div>
                  </div>
                  <Switch
                    checked={!isCameraDisabled}
                    onCheckedChange={(checked) => setIsCameraDisabled(!checked)}
                  />
                </div>

                {/* MIC CONTROL */}
                <div className="group flex items-center justify-between p-4 rounded-xl transition-all hover:bg-primary/5 border border-transparent hover:border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <MicIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Microphone</p>
                      <p className="text-sm text-muted-foreground">{isMicDisabled ? "Off" : "On"}</p>
                    </div>
                  </div>
                  <Switch
                    checked={!isMicDisabled}
                    onCheckedChange={(checked) => setIsMicDisabled(!checked)}
                  />
                </div>

                {/* DEVICE SETTINGS */}
                <div className="group flex items-center justify-between p-4 rounded-xl transition-all hover:bg-primary/5 border border-transparent hover:border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <SettingsIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Settings</p>
                      <p className="text-sm text-muted-foreground">Configure devices</p>
                    </div>
                  </div>
                  <DeviceSettings />
                </div>
              </div>

              <Separator />

              {/* JOIN BTN */}
              <div className="space-y-4">
                <Button 
                  className="w-full h-12 text-lg font-medium transition-all hover:scale-[1.02]" 
                  size="lg" 
                  onClick={handleJoin}
                >
                  Join Meeting
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Ready to join? Our team is excited to meet you! 🎉
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MeetingSetup;
