import { useEffect, useRef, useState } from "react";

export default function useBackgroundMusic() {
  const audioRef = useRef(null);
  const enabledRef = useRef(true);
  const startedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  const play = () => {
    const audio = audioRef.current;
    if (!audio || !enabledRef.current || document.hidden) return;
    setError(false);
    audio.play().catch((error) => {
      if (error.name !== "AbortError") setError(true);
    });
  };

  useEffect(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}audio/neon-protocol.mp3`);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "metadata";
    audioRef.current = audio;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => setError(true);
    const onVisibilityChange = () => {
      if (document.hidden) audio.pause();
      else if (startedRef.current && enabledRef.current) {
        audio.play().catch((error) => {
          if (error.name !== "AbortError") setError(true);
        });
      }
    };
    audio.addEventListener("playing", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      audio.removeEventListener("playing", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, []);

  const startMusic = () => {
    startedRef.current = true;
    play();
  };

  const toggleMusic = () => {
    if (playing) {
      enabledRef.current = false;
      audioRef.current?.pause();
    } else {
      enabledRef.current = true;
      startMusic();
    }
  };

  return { startMusic, toggleMusic, playing, error };
}
