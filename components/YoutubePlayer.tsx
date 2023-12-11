import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFullscreen, usePromise, useToggle } from "react-use";
import YouTube, { YouTubePlayer } from "react-youtube";

import {
  ArrowUturnLeftIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/20/solid";

import { useAuth } from "../context/AuthContext";

function YoutubePlayer({ videoId, nextSong, className = "", extra = null }) {
  const playerRef = useRef<YouTube>();
  const fullscreenRef = useRef<HTMLDivElement>();
  const [show, toggleFullscreen] = useToggle(false);
  const isFullscreen = useFullscreen(fullscreenRef, show, {
    onClose: () => toggleFullscreen(false),
  });
  const [playerState, setPlayerState] = useState<number>();
  const { user } = useAuth();
  const router = useRouter();

  const [isMuted, setIsMuted] = useState(false);
  const mounted = usePromise();

  async function updatePlayerState(player: YouTubePlayer) {
    if (!player) return;
    const [muteState, playerState] = await mounted(
      Promise.allSettled([player.isMuted(), player.getPlayerState()])
    );
    // These lines will not execute if this component gets unmounted.
    if (muteState.status === "fulfilled") setIsMuted(muteState.value);
    if (playerState.status === "fulfilled") setPlayerState(playerState.value);
  }

  const checkLogin = () => {
    if (!user.uid) {
      router.push("/login");
    }
  };
  useEffect(() => {
    const player = playerRef.current?.getInternalPlayer();
    if (player) updatePlayerState(player);
  }, [videoId]);

  const playPauseBtn = useMemo(
    () => [
      playerState === YouTube.PlayerState.PLAYING
        ? {
            icon: PauseIcon,
            label: "หยุด",
            onClick: async () => {
              try {
                const player = playerRef.current?.getInternalPlayer();
                if (!player) return;
                setPlayerState(await player.getPlayerState());
                await player.pauseVideo();
              } catch (error) {
                console.log(error);
              }
            },
          }
        : {
            icon: PlayIcon,
            label: "เล่น",
            onClick: async () => {
              checkLogin();
              try {
                const player = playerRef.current?.getInternalPlayer();
                if (!player) return;
                setPlayerState(await player?.getPlayerState());
                await player?.playVideo();
              } catch (error) {
                console.log(error);
              }
            },
          },
    ],
    [playerState]
  );
  const muteBtn = useMemo(
    () => [
      !isMuted
        ? {
            icon: SpeakerWaveIcon,
            label: "ปิดเสียง",
            onClick: async () => {
              try {
                const player = playerRef.current?.getInternalPlayer();
                if (!player) return;
                await player.mute();
                setIsMuted(true);
              } catch (error) {
                console.log(error);
              }
            },
          }
        : {
            icon: SpeakerXMarkIcon,
            label: "เปิดเสียง",
            onClick: async () => {
              try {
                const player = playerRef.current?.getInternalPlayer();
                if (!player) return;
                await player.unMute();
                setIsMuted(false);
              } catch (error) {
                console.log(error);
              }
            },
          },
    ],
    [isMuted]
  );

  const playerBtns: any = useMemo(
    () => [
      {
        icon: ForwardIcon,
        label: "เพลงถัดไป",
        onClick: () => {
          checkLogin();
          nextSong();
        },
      },
      {
        icon: ArrowUturnLeftIcon,
        label: "ร้องอีกครั้ง",
        onClick: async () => {
          checkLogin();
          try {
            const player = playerRef.current?.getInternalPlayer();
            if (!player) return;
            await player.seekTo(0, true);
          } catch (error) {
            console.log(error);
          }
        },
      },
    ],
    [nextSong]
  );

  return (
    <div
      ref={fullscreenRef}
      id="youtubePlayer"
      className={`${isFullscreen ? "bg-black" : "bg-white"} ${className}`}
    >
      <div
        className="w-full aspect-video relative flex-1 md:flex-grow-1"
        onClick={toggleFullscreen}
      >
        {!videoId ? (
          <div className="h-full w-full flex items-center justify-center bg-black">
            <Image
              src="/assets/icons/icon.svg"
              width={48}
              height={48}
              className=""
              alt="KaraTube's Logo"
            />
          </div>
        ) : (
          <YouTube
            ref={playerRef}
            videoId={videoId}
            className={`w-full bg-black ${
              !isFullscreen
                ? "aspect-video cursor-zoom-in"
                : "h-full cursor-zoom-out"
            }`}
            iframeClassName={`w-full h-full pointer-events-none`}
            style={{ width: "100%", height: "100%" }}
            loading="lazy"
            opts={{
              playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                modestbranding: 1,
                playsinline: 1,
              },
            }}
            onStateChange={(ev) => updatePlayerState(ev.target)}
            onEnd={nextSong}
          />
        )}
      </div>
      <div className="flex-shrink-0 flex flex-row md:w-full p-1 items-center">
        {playPauseBtn.concat(playerBtns, muteBtn).map((btn) => (
          <button
            key={btn.label}
            className="btn btn-ghost font-normal text-primary flex h-auto flex-col flex-1 overflow-hidden  text-sm 2xl:text-lg p-0 hover:bg-base-200"
            onClick={btn.onClick}
          >
            <btn.icon className="w-8 h-8 2xl:w-10 2xl:h-10" />
            {btn.label}
          </button>
        ))}
        {extra}
      </div>
    </div>
  );
}

export default YoutubePlayer;
