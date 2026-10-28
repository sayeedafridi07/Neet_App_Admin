import { useRef, useState } from "react";

const SPEEDS = [1, 1.25, 1.5, 1.75, 2, 0.75];

export const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};

// Playback state + controls for a custom <audio> UI.
// Spread `audioProps` onto the <audio> element.
export function useAudioPlayer(initialDuration = 0) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Playback rate resets on a new source; keep the chosen speed
  const applySpeed = (e) => {
    e.target.playbackRate = SPEEDS[speedIndex];
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play();
    else audio.pause();
  };

  const skip = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(
      Math.max(audio.currentTime + seconds, 0),
      duration || audio.duration || 0,
    );
  };

  const seek = (time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const cycleSpeed = () => {
    const next = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(next);
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[next];
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return {
    audioProps: {
      ref: audioRef,
      preload: "metadata",
      onPlay: () => setIsPlaying(true),
      onPause: () => setIsPlaying(false),
      onEnded: () => setIsPlaying(false),
      // Fires when `src` changes, so a single element can play a queue
      onLoadStart: () => {
        setCurrentTime(0);
        setDuration(0);
      },
      onTimeUpdate: (e) => setCurrentTime(e.target.currentTime),
      onLoadedMetadata: (e) => {
        setDuration(e.target.duration);
        applySpeed(e);
      },
    },
    isPlaying,
    currentTime,
    duration,
    progress: duration ? (currentTime / duration) * 100 : 0,
    speed: SPEEDS[speedIndex],
    isMuted,
    togglePlay,
    skip,
    seek,
    cycleSpeed,
    toggleMute,
  };
}
