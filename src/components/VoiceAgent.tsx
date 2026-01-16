import { useConversation } from "@elevenlabs/react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { toast } from "sonner";

export function VoiceAgent() {
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to voice agent");
      toast.success("Connected to voice assistant");
    },
    onDisconnect: () => {
      console.log("Disconnected from voice agent");
      toast.info("Call ended");
    },
    onMessage: (message) => {
      console.log("Message:", message);
    },
    onError: (error) => {
      console.error("Voice agent error:", error);
      toast.error("Voice agent error occurred");
    },
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get token from edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-conversation-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get conversation token");
      }

      const data = await response.json();

      if (!data?.token) {
        throw new Error("No token received");
      }

      // Start the conversation with WebRTC
      await conversation.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast.error(error instanceof Error ? error.message : "Failed to start voice call");
    } finally {
      setIsConnecting(false);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === "connected";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-center gap-2">
        {isConnected && (
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-4 py-2 shadow-lg mb-2">
            <p className="text-sm text-muted-foreground">
              {conversation.isSpeaking ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  AI is speaking...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-primary" />
                  Listening...
                </span>
              )}
            </p>
          </div>
        )}
        
        {conversation.status === "disconnected" ? (
          <Button
            onClick={startConversation}
            disabled={isConnecting}
            size="lg"
            className="rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary/90"
          >
            {isConnecting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Phone className="w-6 h-6" />
            )}
          </Button>
        ) : (
          <Button
            onClick={stopConversation}
            size="lg"
            variant="destructive"
            className="rounded-full w-16 h-16 shadow-lg"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        )}
        
        <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          {isConnected ? "End Call" : "Voice Assistant"}
        </span>
      </div>
    </div>
  );
}
