import { useConversation } from "@elevenlabs/react";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, X, Sparkles, Mic, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function VoiceAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
      {/* Vertical Edge Button - Right Side Centered */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-[80]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.button
              onClick={() => setIsOpen(true)}
              className="relative group flex items-center"
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Glow effect */}
              <motion.div 
                className="absolute inset-0 bg-primary/40 blur-xl rounded-l-2xl"
                animate={{ 
                  opacity: isHovered ? 0.8 : 0.4,
                  scale: isHovered ? 1.1 : 1
                }}
              />
              
              {/* Main Button */}
              <div className="relative flex items-center bg-gradient-to-l from-primary via-primary to-primary/90 rounded-l-2xl shadow-2xl shadow-primary/30 overflow-hidden">
                {/* Animated shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
                
                {/* Content */}
                <div className="relative flex items-center gap-3 px-4 py-4">
                  {/* Animated Icon */}
                  <motion.div
                    className="relative"
                    animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary-foreground" />
                    </div>
                    {/* Pulse ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white/50"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  
                  {/* Text - Vertical */}
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-primary-foreground/80 font-medium">AI Assistant</span>
                    <span className="text-sm font-bold text-primary-foreground whitespace-nowrap">
                      Talk to Huda
                    </span>
                  </div>
                </div>
                
                {/* Edge accent */}
                <div className="w-1 h-full bg-white/30" />
              </div>
              
              {/* Decorative dots */}
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    initial={{ scale: 0 }}
                    animate={{ scale: isHovered ? 1 : 0 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Panel - Slides from right edge */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[85]"
              onClick={() => {
                if (isConnected) stopConversation();
                setIsOpen(false);
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-1/2 -translate-y-1/2 z-[90] w-80 sm:w-96"
            >
              <div className="bg-background/95 backdrop-blur-xl border-l border-y border-border rounded-l-3xl shadow-2xl overflow-hidden">
                {/* Header with gradient */}
                <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent px-6 py-5 border-b border-border/50">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full" />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="relative"
                        animate={isConnected ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                          <Sparkles className="w-7 h-7 text-primary-foreground" />
                        </div>
                        {isConnected && (
                          <motion.span 
                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                      <div>
                        <h3 className="font-serif text-xl font-semibold text-foreground">Huda AI</h3>
                        <p className="text-sm text-muted-foreground">
                          {isConnected ? "Call in progress" : "Voice Assistant"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-10 w-10 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        if (isConnected) stopConversation();
                        setIsOpen(false);
                      }}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {!isConnected ? (
                    <motion.div 
                      className="text-center space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {/* Animated mic icon */}
                      <div className="relative w-28 h-28 mx-auto">
                        {/* Outer rings */}
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute inset-0 rounded-full border border-primary/20"
                            animate={{
                              scale: [1, 1.3 + i * 0.15],
                              opacity: [0.6, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.4,
                            }}
                          />
                        ))}
                        
                        {/* Center */}
                        <motion.div
                          className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mic className="w-6 h-6 text-primary" />
                          </div>
                        </motion.div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">Ready to help!</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Ask about services, pricing, availability, or book your appointment
                        </p>
                      </div>

                      <Button
                        onClick={startConversation}
                        disabled={isConnecting}
                        className="w-full rounded-2xl bg-primary hover:bg-primary/90 h-14 text-base font-medium shadow-lg shadow-primary/20"
                        size="lg"
                      >
                        {isConnecting ? (
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Connecting...
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5" />
                            Start Voice Call
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="text-center space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Audio Visualization */}
                      <div className="relative w-36 h-36 mx-auto">
                        {/* Animated rings */}
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute inset-0 rounded-full border-2 border-primary/30"
                            animate={{
                              scale: conversation.isSpeaking 
                                ? [1, 1.2 + i * 0.1, 1] 
                                : 1,
                              opacity: conversation.isSpeaking 
                                ? [0.5, 0.1, 0.5] 
                                : 0.2,
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                        
                        {/* Center orb */}
                        <motion.div
                          className="absolute inset-6 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl shadow-primary/30"
                          animate={{
                            scale: conversation.isSpeaking 
                              ? [1, 1.08 + pulseIntensity * 0.08, 1] 
                              : [1, 1.03, 1],
                          }}
                          transition={{
                            duration: conversation.isSpeaking ? 0.25 : 2,
                            repeat: Infinity,
                          }}
                        >
                          {conversation.isSpeaking ? (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-1.5 bg-primary-foreground rounded-full"
                                  animate={{
                                    height: [10, 24 + Math.random() * 12, 10],
                                  }}
                                  transition={{
                                    duration: 0.35,
                                    repeat: Infinity,
                                    delay: i * 0.08,
                                  }}
                                />
                              ))}
                            </div>
                          ) : (
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Mic className="w-10 h-10 text-primary-foreground" />
                            </motion.div>
                          )}
                        </motion.div>
                      </div>

                      {/* Status */}
                      <div className="space-y-1">
                        <motion.p 
                          className="text-lg font-medium text-foreground"
                          animate={{ opacity: [1, 0.7, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {conversation.isSpeaking ? "Huda is speaking..." : "Listening to you..."}
                        </motion.p>
                        <p className="text-sm text-muted-foreground">
                          {conversation.isSpeaking 
                            ? "Please wait for response" 
                            : "Speak naturally"}
                        </p>
                      </div>

                      {/* End Call Button */}
                      <Button
                        onClick={stopConversation}
                        variant="destructive"
                        className="w-full rounded-2xl h-14 text-base font-medium"
                        size="lg"
                      >
                        <PhoneOff className="w-5 h-5 mr-3" />
                        End Conversation
                      </Button>
                    </motion.div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-muted/30 border-t border-border/50">
                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    AI-Powered • Available 24/7
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
