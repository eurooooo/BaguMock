"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

export function AudioPlayer({ url }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // Events
    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (value) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value[0];
    setVolume(value[0]);
    if (value[0] === 0) {
      setIsMuted(true);
      audioRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      audioRef.current.muted = false;
    }
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(
      0,
      audioRef.current.currentTime - 10
    );
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      audioRef.current.duration,
      audioRef.current.currentTime + 10
    );
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full space-y-4">
      <audio ref={audioRef} src={url} preload="metadata" />

      <div className="flex items-center gap-2">
        <div className="w-14 text-right text-sm">{formatTime(currentTime)}</div>

        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleTimeChange}
          className="flex-1"
        />

        <div className="w-14 text-sm">{formatTime(duration)}</div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleMute}
            title={isMuted ? "取消静音" : "静音"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>

          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={skipBackward}
            title="后退 10 秒"
          >
            <SkipBack size={20} />
          </Button>

          <Button size="icon" onClick={togglePlay} className="h-12 w-12">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={skipForward}
            title="前进 10 秒"
          >
            <SkipForward size={20} />
          </Button>
        </div>
        <div className="w-[88px]" /> {/* Spacer to balance the layout */}
      </div>
    </div>
  );
}
