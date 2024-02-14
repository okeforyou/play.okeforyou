import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFullscreen, usePromise, useToggle } from "react-use";
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";

import {
  ArrowUturnLeftIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/20/solid";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../context/AuthContext";
import Alert, { AlertHandler } from "./Alert";

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
  const [isFullScreenIphone, setIsFullScreenIphone] = useState<boolean>(false);
  const alertRef = useRef<AlertHandler>(null);
  const alertFullNotWorkRef = useRef<AlertHandler>(null);

  const [isIphone, setIsIphone] = useState<boolean>(false);

  const isIOS =
    /iPad|iPhone/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

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
    return true;
    // if (!user.uid) {
    //   router.push("/login");
    // }
  };

  useEffect(() => {
    const player = playerRef.current?.getInternalPlayer();
    if (player) {
      updatePlayerState(player);
    }
  }, [videoId]);

  const isEnd = async (player) => {
    if (player && player.getCurrentTime && player.getDuration) {
      const playState = await player.getPlayerState();
      if (playState === YouTube.PlayerState.ENDED) {
        return true;
      }
    }
    return false;
  };
  const loopCheckEnd = async () => {
    const player = playerRef.current?.internalPlayer;
    if (await isEnd(player)) {
      nextSong();
    }
  };

  const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
  useEffect(() => {
    const intervalId =
      playerState === YouTube.PlayerState.PLAYING &&
      isFirefox &&
      setInterval(() => loopCheckEnd(), 1000);
    return () =>
      playerState === YouTube.PlayerState.PLAYING &&
      isFirefox &&
      clearInterval(intervalId);
  }, [nextSong, playerState]);

  const pauseVideo = async () => {
    const player = playerRef.current?.getInternalPlayer();
    if (!player) return;
    setPlayerState(YouTube.PlayerState.PAUSED);
    await player.pauseVideo();
    await player.getPlayerState();
  };

  const handleEnd = (e) => {
    if (!isFirefox) nextSong();
  };

  // Event handler for triggering fullscreen on a user gesture
  const handleFullscreenButtonClick = () => {
    if (!isIphone && !isFullscreen) {
      alertFullNotWorkRef?.current.open();
    }

    if (
      //@ts-ignore
      fullscreenRef.webkitEnterFullScreen ||
      //@ts-ignore
      fullscreenRef.webkitExitFullscreen
    ) {
      console.log(" Toggle fullscreen in Safari for iPad");
      // Toggle fullscreen in Safari for iPad
      if (!isFullscreen) {
        //@ts-ignore
        fullscreenRef.webkitEnterFullScreen();
        toggleFullscreen(true);
      } else {
        //@ts-ignore
        fullscreenRef.webkitExitFullscreen();
        toggleFullscreen(false);
      }
    } else if (isIphone) {
      setIsFullScreenIphone(!isFullScreenIphone);

      !isFullScreenIphone && alertRef?.current.open();
    } else {
      // Toggle fullscreen for other OS / Devices / Browsers
      console.log("Toggle fullscreen for other OS / Devices / Browsers");
      toggleFullscreen();
      setIsFullScreenIphone(!isFullScreenIphone);
    }
  };

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
                await player.pauseVideo();
                setPlayerState(YouTube.PlayerState.PAUSED);
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
                await player?.playVideo();
                setPlayerState(YouTube.PlayerState.PLAYING);
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

  const fullBtn = useMemo(
    () => [
      (isIphone ? !isFullScreenIphone : !isFullscreen)
        ? {
            icon: ArrowsPointingOutIcon,
            label: "เต็มจอ",
            onClick: async () => {
              handleFullscreenButtonClick();
            },
          }
        : {
            icon: ArrowsPointingInIcon,
            label: "จอเล็ก",
            onClick: async () => {
              handleFullscreenButtonClick();
            },
          },
    ],
    [isFullscreen, isFullScreenIphone, isIphone]
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

  const UseFullScreenCss = isFullScreenIphone;

  return (
    <div
      ref={fullscreenRef}
      id="youtubePlayer"
      className={`${isFullscreen ? "bg-black" : "bg-white"} ${className}`}
    >
      <Alert
        ref={alertRef}
        timer={2000}
        headline="เต็มจอ"
        headlineColor="text-green-600"
        bgColor="bg-green-100"
        content={<span className="text-sm">กดเล่นเพื่อเต็มจอ</span>}
        icon={<PlayIcon />}
      />
      <span className={`${isIOS && !isIphone ? "" : "hidden"}`}>
        <Alert
          ref={alertFullNotWorkRef}
          timer={3000}
          headline="หากไม่เต็มจอ"
          headlineColor="text-green-600"
          bgColor="bg-green-100"
          content={
            <button
              className="text-sm btn btn-ghost"
              onClick={async () => {
                setIsFullScreenIphone(false);
                toggleFullscreen(false);
                setIsIphone(true);
                await pauseVideo();
              }}
            >
              กดที่นี่แล้วลองอีกครั้ง
            </button>
          }
          icon={<ExclamationTriangleIcon />}
        />
      </span>

      <div
        className="w-full aspect-video relative flex-1 md:flex-grow-1"
        onClick={() => handleFullscreenButtonClick()}
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
                : "h-[calc(100dvh)] cursor-zoom-out"
            } `}
            id="yt-iframe"
            iframeClassName={`w-full h-[calc(100dvh)] pointer-events-none`}
            style={{
              width: "100%",
              height: "100%",
              position: UseFullScreenCss ? "fixed" : "absolute",
              zIndex: UseFullScreenCss ? 20 : 0,
            }}
            loading="lazy"
            opts={{
              playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                modestbranding: 1,
                playsinline: isIphone && isFullScreenIphone ? 0 : 1,
              },
            }}
            onStateChange={(ev) => updatePlayerState(ev.target)}
            onEnd={handleEnd}
          />
        )}
      </div>
      <div
        className={`flex-shrink-0 flex flex-row md:w-full p-1 items-center z-20 hover:opacity-100 ${
          UseFullScreenCss ? "opacity-0" : ""
        }`}
        style={
          UseFullScreenCss
            ? {
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
              }
            : {}
        }
      >
        {playPauseBtn.concat(playerBtns, muteBtn, fullBtn).map((btn) => {
          return (
            <button
              key={btn.label}
              className="btn btn-ghost font-normal text-primary flex h-auto flex-col flex-1 overflow-hidden  text-sm 2xl:text-lg p-0 hover:bg-base-200"
              onClick={btn.onClick}
            >
              <btn.icon className="w-8 h-8 2xl:w-10 2xl:h-10" />
              {btn.label}
            </button>
          );
        })}
        {extra}
      </div>
    </div>
  );
}

export default YoutubePlayer;
