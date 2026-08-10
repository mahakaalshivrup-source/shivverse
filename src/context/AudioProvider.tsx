"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Mantra } from "@/data/mantrasData";

// ═══════════════════════════════════════════════════
// Audio Context Types
// ═══════════════════════════════════════════════════
interface AudioContextType {
  currentTrack: Mantra | null;
  trackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playlist: Mantra[];
  playTrack: (track: Mantra, index: number, list: Mantra[]) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  playNext: () => void;
  playPrev: () => void;
  closePlayer: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioContext = createContext<AudioContextType | null>(null);

// ═══════════════════════════════════════════════════
// Hook to consume context
// ═══════════════════════════════════════════════════
export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used inside AudioProvider");
  return ctx;
}

// ═══════════════════════════════════════════════════
// Provider Component
// ═══════════════════════════════════════════════════
export default function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrack, setCurrentTrack] = useState<Mantra | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playlist, setPlaylist] = useState<Mantra[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);

  // ───── Play a specific track ─────
  const playTrack = useCallback(
    (track: Mantra, index: number, list: Mantra[]) => {
      setCurrentTrack(track);
      setTrackIndex(index);
      setPlaylist(list);
      setCurrentTime(0);
      setDuration(0);

      // Let the effect handle loading & playing once src updates
      if (audioRef.current) {
        audioRef.current.src = track.audioSrc;
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay may be blocked; user can press play manually
            setIsPlaying(false);
          });
      }
    },
    []
  );

  // ───── Toggle play/pause ─────
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [isPlaying, currentTrack]);

  // ───── Seek ─────
  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  // ───── Volume ─────
  const setVolume = useCallback((v: number) => {
    if (audioRef.current) audioRef.current.volume = v;
    setVolumeState(v);
  }, []);

  // ───── Next / Prev ─────
  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    const nextIndex = (trackIndex + 1) % playlist.length;
    playTrack(playlist[nextIndex], nextIndex, playlist);
  }, [trackIndex, playlist, playTrack]);

  const playPrev = useCallback(() => {
    if (playlist.length === 0) return;
    const prevIndex = (trackIndex - 1 + playlist.length) % playlist.length;
    playTrack(playlist[prevIndex], prevIndex, playlist);
  }, [trackIndex, playlist, playTrack]);

  // ───── Audio event listeners ─────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-advance to next track
      if (playlist.length > 1) {
        const nextIndex = (trackIndex + 1) % playlist.length;
        playTrack(playlist[nextIndex], nextIndex, playlist);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [trackIndex, playlist, playTrack]);

  // ───── Sync volume on mount ─────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ───── Close player ─────
  const closePlayer = useCallback(() => {
    setCurrentTrack(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        trackIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        playlist,
        playTrack,
        togglePlayPause,
        seek,
        setVolume,
        playNext,
        playPrev,
        closePlayer,
        audioRef,
      }}
    >
      {/* Hidden global audio element */}
      <audio ref={audioRef} preload="metadata" />
      {children}
    </AudioContext.Provider>
  );
}
