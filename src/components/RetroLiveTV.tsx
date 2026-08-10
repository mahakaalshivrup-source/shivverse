"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";
import { Power, Play, Pause, Volume2, VolumeX, Plus, Minus } from "lucide-react";

interface StreamConfig {
  id: string;
  channelNumber: string;
  source: string;
}

export default function RetroLiveTV() {
  const [channels, setChannels] = useState<StreamConfig[]>([]);
  
  // TV States
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  
  // Playback States
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState("");
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showOSD, setShowOSD] = useState(false);

  // Keep track of active scan to prevent race conditions if user clicks multiple times
  const scanIdRef = useRef(0);

  // Fetch channels configuration
  useEffect(() => {
    fetch("/data/livestreams.json")
      .then((res) => res.json())
      .then((data) => setChannels(data))
      .catch((err) => console.error("Failed to load livestreams configuration", err));
  }, []);

  // Handle OSD fade out during normal playback
  useEffect(() => {
    if (isPowerOn && !isScanning && !isOffline && activeVideoUrl) {
      setShowOSD(true);
      const timer = setTimeout(() => setShowOSD(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isPowerOn, isScanning, isOffline, activeVideoUrl, currentChannelIndex, isMuted, isPlaying]);

  // The recursive Auto-Scan function
  const autoScan = async (startIndex: number, currentScanId: number) => {
    if (channels.length === 0) return;
    
    // Safety check: if they started a new scan or turned off the TV, abort this chain.
    if (currentScanId !== scanIdRef.current || !isPowerOn) return;

    setIsScanning(true);
    setIsBuffering(true);
    setIsOffline(false);
    setActiveVideoUrl(null);
    setShowOSD(true);

    try {
      const channel = channels[startIndex];
      const res = await fetch(`/api/get-live?source=${encodeURIComponent(channel.source)}`);
      const data = await res.json();

      if (currentScanId !== scanIdRef.current || !isPowerOn) return;

      if (data.isLive && data.url) {
        // We found a live channel!
        setActiveVideoUrl(data.url);
        setActiveTitle(data.title);
        setCurrentChannelIndex(startIndex);
        setIsScanning(false);
        setIsPlaying(true);
      } else {
        // Not live. Check if we've tried all channels.
        const nextIndex = startIndex + 1;
        if (nextIndex >= channels.length) {
          // Exhausted all channels
          setIsScanning(false);
          setIsBuffering(false);
          setIsOffline(true);
        } else {
          // Keep scanning the next one
          setCurrentChannelIndex(nextIndex); // Update UI to show we are checking this one
          autoScan(nextIndex, currentScanId);
        }
      }
    } catch (error) {
      console.error("Scan error:", error);
      setIsScanning(false);
      setIsBuffering(false);
      setIsOffline(true);
    }
  };

  // Manual Channel Check (No recursion)
  const checkSpecificChannel = async (index: number) => {
    if (channels.length === 0 || !isPowerOn) return;
    
    // Increment scan ID to kill any ongoing auto-scan
    scanIdRef.current += 1;
    const currentScanId = scanIdRef.current;

    setIsScanning(true);
    setIsBuffering(true);
    setIsOffline(false);
    setActiveVideoUrl(null);
    setCurrentChannelIndex(index);
    setShowOSD(true);

    try {
      const channel = channels[index];
      const res = await fetch(`/api/get-live?source=${encodeURIComponent(channel.source)}`);
      const data = await res.json();

      if (currentScanId !== scanIdRef.current || !isPowerOn) return;

      setIsScanning(false);

      if (data.isLive && data.url) {
        setActiveVideoUrl(data.url);
        setActiveTitle(data.title);
        setIsPlaying(true);
      } else {
        setIsBuffering(false);
        setIsOffline(true);
      }
    } catch (error) {
      setIsScanning(false);
      setIsBuffering(false);
      setIsOffline(true);
    }
  };

  // Controls Handlers
  const handlePowerToggle = () => {
    const newState = !isPowerOn;
    setIsPowerOn(newState);
    
    if (newState) {
      // Turning ON
      scanIdRef.current += 1;
      autoScan(0, scanIdRef.current);
    } else {
      // Turning OFF
      scanIdRef.current += 1; // Kill active scans
      setIsScanning(false);
      setIsBuffering(false);
      setIsOffline(false);
      setActiveVideoUrl(null);
      setShowOSD(false);
    }
  };

  const handleNextChannel = () => {
    if (!isPowerOn || channels.length === 0) return;
    const nextIndex = (currentChannelIndex + 1) % channels.length;
    checkSpecificChannel(nextIndex);
  };

  const handlePrevChannel = () => {
    if (!isPowerOn || channels.length === 0) return;
    const prevIndex = (currentChannelIndex - 1 + channels.length) % channels.length;
    checkSpecificChannel(prevIndex);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-5xl mx-auto my-12">
      {/* TV Cabinet */}
      <div className="relative bg-[#111] border-8 border-[#222] rounded-[2rem] p-6 shadow-2xl flex-1 w-full flex flex-col md:flex-row gap-6">
        
        {/* CRT Glass Screen Container */}
        <div className="relative aspect-video bg-black overflow-hidden border-4 border-black rounded-[1.5rem] flex-1 shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
          
          {/* Turn Off Animation */}
          <AnimatePresence>
            {!isPowerOn && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ scaleY: 0.01, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 bg-black z-30 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Video Player Layer (Receives Clicks) */}
          {isPowerOn && activeVideoUrl && !isOffline && !isScanning && (
            <div className="absolute inset-0 w-full h-full">
              <ReactPlayer
                url={activeVideoUrl}
                width="100%"
                height="100%"
                playing={isPlaying && isPowerOn}
                muted={isMuted}
                controls={true} // Allow controls for skipping ads
                onReady={() => setIsBuffering(false)}
                onBuffer={() => setIsBuffering(true)}
                onBufferEnd={() => setIsBuffering(false)}
                onPlay={() => setIsBuffering(false)}
                onError={() => setIsOffline(true)}
                onEnded={() => setIsOffline(true)}
                style={{ position: 'absolute', top: 0, left: 0 }}
                config={{
                  youtube: {
                    playerVars: { 
                      controls: 1, 
                      modestbranding: 1, 
                      rel: 0, 
                      autoplay: 1
                    }
                  }
                }}
              />
            </div>
          )}

          {/* TV Static Overlay (For Scanning, Buffering, or Offline) */}
          {isPowerOn && (isScanning || isBuffering || isOffline) && (
            <div 
              className="absolute inset-0 z-20 pointer-events-none opacity-50 mix-blend-screen bg-[url('https://media.giphy.com/media/YkX9eX0cI8B7A/giphy.gif')] bg-cover" 
            />
          )}

          {/* Scanline & Glare Effects (Always over everything, strictly pointer-events-none) */}
          <div className="absolute inset-0 z-40 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_4px]" />
          <div className="absolute inset-0 z-40 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_60%)]" />

          {/* On-Screen Display (OSD) */}
          {isPowerOn && (
            <div className="absolute top-6 left-6 z-50 pointer-events-none">
              
              {/* State: Scanning */}
              {isScanning && (
                <div className="font-mono text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)] text-lg tracking-wider animate-pulse">
                  SCANNING CHANNELS...
                </div>
              )}

              {/* State: Offline */}
              {isOffline && (
                <div className="font-mono text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] text-xl md:text-2xl tracking-wider animate-pulse font-bold mt-10">
                  SIGNAL LOST - OFFLINE
                </div>
              )}

              {/* State: Live Playing */}
              <AnimatePresence>
                {!isScanning && !isOffline && showOSD && channels[currentChannelIndex] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)] text-lg md:text-xl tracking-wider flex flex-col"
                  >
                    <div className="flex items-center gap-3">
                      <span>CH {channels[currentChannelIndex].channelNumber}</span>
                      <span className="opacity-50">•</span>
                      <span className="truncate max-w-[200px] md:max-w-[300px] uppercase">{activeTitle}</span>
                      {!isBuffering && <span className="animate-pulse ml-2">[LIVE]</span>}
                    </div>
                    {/* Audio Status */}
                    <div className="mt-2 text-sm text-green-400/80">
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>

        {/* Physical Control Panel */}
        <div className="w-full md:w-28 bg-[#1a1a1a] rounded-xl p-4 border-2 border-[#111] shadow-inner flex md:flex-col items-center justify-between gap-6">
          
          {/* Power Section */}
          <div className="flex flex-col items-center gap-2">
            {/* LED Indicator */}
            <div 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isPowerOn 
                  ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' 
                  : 'bg-red-500 shadow-[0_0_10px_#ef4444]'
              }`} 
            />
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePowerToggle}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-b-4 active:border-b-0 transition-all ${isPowerOn ? 'bg-red-600 border-red-800' : 'bg-[#333] border-[#111]'}`}
              title="Power"
            >
              <Power size={20} className={isPowerOn ? 'text-white' : 'text-gray-400'} />
            </motion.button>
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Power</span>
          </div>

          <div className="w-[2px] h-full md:w-full md:h-[2px] bg-black/40 rounded-full" />

          {/* Playback & Volume */}
          <div className="flex md:flex-col gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { if(isPowerOn && !isScanning && !isOffline) setIsPlaying(!isPlaying); }}
              className="w-10 h-10 rounded-lg bg-[#333] border-b-4 border-[#111] active:border-b-0 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { if(isPowerOn) setIsMuted(!isMuted); }}
              className="w-10 h-10 rounded-lg bg-[#333] border-b-4 border-[#111] active:border-b-0 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </motion.button>
          </div>

          <div className="w-[2px] h-full md:w-full md:h-[2px] bg-black/40 rounded-full" />

          {/* Channel Selector */}
          <div className="flex flex-col items-center gap-3">
             <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Channel</span>
             <div className="flex md:flex-col gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextChannel}
                  className="w-10 h-10 rounded-full bg-[#444] border-b-4 border-[#222] active:border-b-0 flex items-center justify-center text-gray-200 hover:bg-[#555] cursor-pointer"
                >
                  <Plus size={20} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevChannel}
                  className="w-10 h-10 rounded-full bg-[#444] border-b-4 border-[#222] active:border-b-0 flex items-center justify-center text-gray-200 hover:bg-[#555] cursor-pointer"
                >
                  <Minus size={20} />
                </motion.button>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
