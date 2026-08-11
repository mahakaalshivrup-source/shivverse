"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Play, Pause, Volume2, VolumeX, Plus, Minus } from "lucide-react";

interface StreamConfig {
  id: string;
  channelNumber: string;
  name: string;
  channelId: string;
}

export default function RetroLiveTV() {
  const [channels, setChannels] = useState<StreamConfig[]>([]);
  
  // TV States
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  
  // Background Pre-loader States
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isCurrentlyLive, setIsCurrentlyLive] = useState(false);
  const [readyVideoId, setReadyVideoId] = useState<string | null>(null);
  const [readyTitle, setReadyTitle] = useState("");
  const [readyIndex, setReadyIndex] = useState(0);

  // Active Playback States
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState("LOADING...");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // MUST be muted initially for background autoplay
  const [showOSD, setShowOSD] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Send commands to the YouTube iframe via postMessage API
  const sendIframeCommand = (command: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args: [] }),
        "*"
      );
    }
  };

  // Toggle Mute via postMessage
  useEffect(() => {
    if (isPowerOn && isPreloaded) {
      if (isMuted) {
        sendIframeCommand("mute");
      } else {
        sendIframeCommand("unMute");
      }
    }
  }, [isMuted, isPowerOn, isPreloaded]);

  // Toggle Play/Pause via postMessage
  useEffect(() => {
    if (isPowerOn && isPreloaded) {
      if (isPlaying) {
        sendIframeCommand("playVideo");
      } else {
        sendIframeCommand("pauseVideo");
      }
    }
  }, [isPlaying, isPowerOn, isPreloaded]);

  // Fetch channels configuration and START BACKGROUND SCAN
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const res = await fetch("/data/livestreams.json");
        const data: StreamConfig[] = await res.json();
        if (!mounted) return;
        setChannels(data);

        let fallbackId: string | null = null;
        let fallbackTitle = "";
        let fallbackIdx = 0;

        // The Background Pre-Scan Loop
        for (let i = 0; i < data.length; i++) {
          const channel = data[i];
          try {
            const liveRes = await fetch(`/api/get-stream?channelId=${encodeURIComponent(channel.channelId)}`);
            const liveData = await liveRes.json();
            
            if (!mounted) return;

            if (liveData.success && liveData.videoId) {
              if (liveData.isLive) {
                // Found a TRUE live channel! Lock it in and stop scanning.
                setReadyVideoId(liveData.videoId);
                setReadyTitle(liveData.title);
                setReadyIndex(i);
                setIsCurrentlyLive(true);
                setIsPreloaded(true);
                return; // Break the loop completely
              } else if (!fallbackId) {
                // It's a VOD. Save the very first one as our fallback.
                fallbackId = liveData.videoId;
                fallbackTitle = liveData.title;
                fallbackIdx = i;
              }
            }
          } catch (e) {
            console.error("Background scan error:", e);
          }
        }

        // If we get here, no channels were live. Use the fallback!
        if (mounted) {
          if (fallbackId) {
            setReadyVideoId(fallbackId);
            setReadyTitle(fallbackTitle);
            setReadyIndex(fallbackIdx);
            setIsCurrentlyLive(false);
            setIsPreloaded(true);
          } else {
            // Literally everything failed
            setIsOffline(true);
            setIsPreloaded(true); // Still "preloaded", just failed
          }
        }

      } catch (err) {
        console.error("Failed to load livestreams", err);
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  // Handle OSD fade out
  useEffect(() => {
    if (isPowerOn && !isOffline && activeVideoId) {
      setShowOSD(true);
      const timer = setTimeout(() => setShowOSD(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isPowerOn, isOffline, activeVideoId, currentChannelIndex, isMuted, isPlaying]);

  // Controls Handlers
  const handlePowerToggle = () => {
    const newState = !isPowerOn;
    setIsPowerOn(newState);
    
    if (newState) {
      // Turning ON
      if (isPreloaded) {
        if (readyVideoId) {
          // Pre-loaded channel is ready! Zero latency reveal!
          setActiveVideoId(readyVideoId);
          setActiveTitle(readyTitle);
          setCurrentChannelIndex(readyIndex);
          setIsOffline(false);
          setShowOSD(true);
        } else {
          // Pre-scan finished and found absolutely NOTHING (even VODs failed)
          setActiveVideoId(null);
          setIsOffline(true);
          setShowOSD(true);
        }
      } else {
        // Edge case: clicked before preloader finished
        setActiveTitle("SCANNING...");
        setShowOSD(true);
      }
    } else {
      // Turning OFF
      setShowOSD(false);
      // We don't nullify activeVideoId here so the hidden iframe can stay buffered
    }
  };

  const manualCheckChannel = async (index: number) => {
    if (channels.length === 0 || !isPowerOn) return;
    
    setIsOffline(false);
    setActiveVideoId(null); // Clear ID to force a fresh iframe load (no zero latency for manual switches)
    setCurrentChannelIndex(index);
    setActiveTitle("CONNECTING...");
    setShowOSD(true);

    try {
      const channel = channels[index];
      const res = await fetch(`/api/get-stream?channelId=${encodeURIComponent(channel.channelId)}`);
      const data = await res.json();

      if (data.success && data.videoId) {
        setActiveTitle(data.title);
        setActiveVideoId(data.videoId);
        setIsCurrentlyLive(data.isLive);
      } else {
        setIsOffline(true);
      }
    } catch (error) {
      setIsOffline(true);
    }
  };

  const handleNextChannel = () => {
    if (!isPowerOn || channels.length === 0) return;
    const nextIndex = (currentChannelIndex + 1) % channels.length;
    manualCheckChannel(nextIndex);
  };

  const handlePrevChannel = () => {
    if (!isPowerOn || channels.length === 0) return;
    const prevIndex = (currentChannelIndex - 1 + channels.length) % channels.length;
    manualCheckChannel(prevIndex);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-5xl mx-auto my-12">
      {/* TV Cabinet */}
      <div className="relative bg-[#111] border-4 md:border-8 border-[#222] rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-6 shadow-2xl flex-1 w-full flex flex-col md:flex-row gap-2 md:gap-6">
        
        {/* CRT Glass Screen Container */}
        <div className="relative aspect-video w-full bg-black overflow-hidden border-2 md:border-4 border-black rounded-xl md:rounded-[1.5rem] flex-1 shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
          
          {/* Turn Off Animation / Standby Screen */}
          <AnimatePresence>
            {!isPowerOn && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ scaleY: 0.01, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 bg-black z-30 pointer-events-none flex flex-col items-center justify-center text-center px-6"
              >
                <div className="font-mono flex flex-col gap-4 text-xs md:text-sm tracking-[0.2em] text-white/30">
                  <div className="text-red-500/80 animate-pulse font-bold text-sm md:text-base drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                    CLICK POWER TO START
                  </div>
                  <div>* LOADING MAY SOMETIMES TAKE LONGER</div>
                  <div>* TRY TO ADJUST SIGNAL BY PRESSING CH +/-</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Player Layer - The Zero Latency Hack */}
          {/* We use activeVideoId if the user is manually changing channels, otherwise we use readyVideoId for the initial background preload */}
          {isPreloaded && (activeVideoId || readyVideoId) && !isOffline && (
            <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isPowerOn ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-[-1]'}`}>
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${activeVideoId || readyVideoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`}
                className="w-full h-full border-none"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          )}

          {/* TV Static Overlay */}
          {isPowerOn && (!activeVideoId || isOffline) && (
            <div 
              className="absolute inset-0 z-20 pointer-events-none opacity-50 mix-blend-screen bg-[url('https://media.giphy.com/media/YkX9eX0cI8B7A/giphy.gif')] bg-cover" 
            />
          )}

          {/* Scanline & Glare Effects */}
          <div className="absolute inset-0 z-40 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_4px]" />
          <div className="absolute inset-0 z-40 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_60%)]" />

          {/* On-Screen Display (OSD) */}
          {isPowerOn && (
            <div className="absolute top-6 left-6 z-50 pointer-events-none">
              
              {/* Background Scanning Fallback */}
              {!isPreloaded && !activeVideoId && (
                <div className="font-mono text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)] text-lg tracking-wider animate-pulse">
                  SCANNING FREQUENCIES...
                </div>
              )}

              {/* State: Offline / No Channels Live */}
              {isOffline && (
                <div className="font-mono text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] text-xl md:text-2xl tracking-wider animate-pulse font-bold mt-10">
                  NO SIGNAL - ALL CHANNELS OFFLINE
                </div>
              )}

              {/* State: Playing (OSD removed to prevent clashing with YouTube's native title) */}
            </div>
          )}

        </div>

        {/* Physical Control Panel */}
        <div className="w-full md:w-28 bg-[#1a1a1a] rounded-xl p-2 md:p-4 border-2 border-[#111] shadow-inner flex flex-row md:flex-col items-center justify-center md:justify-between gap-2 md:gap-6 mt-1 md:mt-0">
          
          {/* Power Section */}
          <div className="flex flex-col items-center gap-1 md:gap-2">
            <div 
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                isPowerOn 
                  ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' 
                  : (!isPreloaded ? 'bg-yellow-500 shadow-[0_0_10px_#eab308] animate-pulse' : 'bg-red-500 shadow-[0_0_10px_#ef4444]')
              }`} 
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePowerToggle}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-b-[3px] md:border-b-4 active:border-b-0 transition-all ${isPowerOn ? 'bg-red-600 border-red-800' : 'bg-[#333] border-[#111]'}`}
              title="Power"
            >
              <Power className={`w-4 h-4 md:w-5 md:h-5 ${isPowerOn ? 'text-white' : 'text-gray-400'}`} />
            </motion.button>
            <span className="text-[8px] md:text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-0 md:mt-1">Power</span>
          </div>

          <div className="w-[1px] h-12 md:w-full md:h-[2px] bg-black/40 rounded-full mx-1 md:mx-0" />

          {/* Playback & Volume */}
          <div className="flex flex-row md:flex-col gap-2 md:gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { if(isPowerOn && !isOffline) setIsPlaying(!isPlaying); }}
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#333] border-b-[3px] md:border-b-4 border-[#111] active:border-b-0 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3 h-3 md:w-4 md:h-4" /> : <Play className="w-3 h-3 md:w-4 md:h-4 ml-1" />}
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { if(isPowerOn) setIsMuted(!isMuted); }}
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#333] border-b-[3px] md:border-b-4 border-[#111] active:border-b-0 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3 h-3 md:w-4 md:h-4" /> : <Volume2 className="w-3 h-3 md:w-4 md:h-4" />}
            </motion.button>
          </div>

          <div className="w-[1px] h-12 md:w-full md:h-[2px] bg-black/40 rounded-full mx-1 md:mx-0" />

          {/* Channel Selector */}
          <div className="flex flex-col items-center gap-1 md:gap-3">
             <span className="text-[8px] md:text-[10px] text-gray-500 uppercase font-bold tracking-widest">Channel</span>
             <div className="flex flex-row md:flex-col gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextChannel}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#444] border-b-[3px] md:border-b-4 border-[#222] active:border-b-0 flex items-center justify-center text-gray-200 hover:bg-[#555] cursor-pointer"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevChannel}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#444] border-b-[3px] md:border-b-4 border-[#222] active:border-b-0 flex items-center justify-center text-gray-200 hover:bg-[#555] cursor-pointer"
                >
                  <Minus className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
