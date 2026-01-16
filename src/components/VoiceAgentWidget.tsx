import { useConversation } from "@elevenlabs/react";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, X, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function VoiceAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to voice agent");
      toast.success("Connected! Start speaking...");
    },
    onDisconnect: () => {
      console.log("Disconnected from voice agent");
    },
    onMessage: (message) => {
      console.log("Message:", message);
    },
    onError: (error) => {
      console.error("Voice agent error:", error);
      toast.error("Connection error. Please try again.");
    },
  });

  // Simulate audio visualization when speaking
  useEffect(() => {
    if (conversation.isSpeaking) {
      const interval = setInterval(() => {
        setPulseIntensity(Math.random() * 0.5 + 0.5);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setPulseIntensity(0);
    }
  }, [conversation.isSpeaking]);

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

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
        throw new Error(errorData.error || "Failed to connect");
      }

      const data = await response.json();

      if (!data?.token) {
        throw new Error("No token received");
      }

      await conversation.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast.error(error instanceof Error ? error.message : "Failed to connect");
    } finally {
      setIsConnecting(false);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === "connected";

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.button
              onClick={() => setIsOpen(true)}
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:bg-primary/50 transition-all duration-300" />
              
              {/* Button */}
              <div className="relative flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-5 py-3 rounded-full shadow-2xl border border-primary/20">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Talk to Huda</span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-80"
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-5 py-4 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    {isConnected && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Huda AI</h3>
                    <p className="text-xs text-muted-foreground">
                      {isConnected ? "Connected" : "Voice Assistant"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => {
                    if (isConnected) stopConversation();
                    setIsOpen(false);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6">
                {!isConnected ? (
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Mic className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Ask about services, pricing, or book an appointment
                      </p>
                      <Button
                        onClick={startConversation}
                        disabled={isConnecting}
                        className="w-full rounded-full bg-primary hover:bg-primary/90"
                        size="lg"
                      >
                        {isConnecting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Connecting...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Start Conversation
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    {/* Audio Visualization */}
                    <div className="relative w-32 h-32 mx-auto">
                      {/* Outer rings */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute inset-0 rounded-full border-2 border-primary/30"
                          animate={{
                            scale: conversation.isSpeaking 
                              ? [1, 1.2 + i * 0.1, 1] 
                              : 1,
                            opacity: conversation.isSpeaking 
                              ? [0.5, 0.2, 0.5] 
                              : 0.3,
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                      
                      {/* Center orb */}
                      <motion.div
                        className="absolute inset-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center"
                        animate={{
                          scale: conversation.isSpeaking 
                            ? [1, 1.05 + pulseIntensity * 0.1, 1] 
                            : [1, 1.02, 1],
                        }}
                        transition={{
                          duration: conversation.isSpeaking ? 0.3 : 2,
                          repeat: Infinity,
                        }}
                      >
                        {conversation.isSpeaking ? (
                          <div className="flex items-center gap-1">
                            {[...Array(4)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-1 bg-primary-foreground rounded-full"
                                animate={{
                                  height: [8, 20 + Math.random() * 10, 8],
                                }}
                                transition={{
                                  duration: 0.4,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <Mic className="w-8 h-8 text-primary-foreground" />
                        )}
                      </motion.div>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {conversation.isSpeaking ? "Huda is speaking..." : "Listening..."}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {conversation.isSpeaking 
                          ? "Wait for response" 
                          : "Speak now"}
                      </p>
                    </div>

                    {/* End Call Button */}
                    <Button
                      onClick={stopConversation}
                      variant="destructive"
                      className="w-full rounded-full"
                      size="lg"
                    >
                      <PhoneOff className="w-4 h-4 mr-2" />
                      End Conversation
                    </Button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-muted/30 border-t border-border/50">
                <p className="text-xs text-center text-muted-foreground">
                  Powered by AI • Available 24/7
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
