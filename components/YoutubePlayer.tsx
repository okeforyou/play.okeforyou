import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFullscreen, usePromise, useToggle } from "react-use";
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";

import {
  ArrowUturnLeftIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/20/solid";
import {
  ArrowDownLeftIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ExclamationTriangleIcon,
  TvIcon,
} from "@heroicons/react/24/outline";
import { DeviceTabletIcon } from "@heroicons/react/24/solid";

import { useAuth } from "../context/AuthContext";
import { useKaraokeState } from "../hooks/karaoke";
import { useRoomState } from "../hooks/room";
import { ACTION, SocketData } from "../types/socket";
import { socket } from "../utils/socket";
import Alert, { AlertHandler } from "./Alert";
import BottomAds from "./BottomAds";
import VideoAds from "./VideoAds";

function YoutubePlayer({
  videoId,
  nextSong,
  className = "",
  extra = null,
  isMoniter = false,
}) {
  const router = useRouter();
  const playerRef = useRef<YouTube>();
  const fullscreenRef = useRef<HTMLDivElement>();
  const [show, toggleFullscreen] = useToggle(false);
  const isFullscreen = useFullscreen(fullscreenRef, show, {
    onClose: () => toggleFullscreen(false),
  });
  const [playerState, setPlayerState] = useState<number>();
  const { user } = useAuth();
  const isLogin = !!user.uid;

  const [isFullScreenIphone, setIsFullScreenIphone] = useState<boolean>(false);
  const alertRef = useRef<AlertHandler>(null);
  const alertFullNotWorkRef = useRef<AlertHandler>(null);

  const [isIphone, setIsIphone] = useState<boolean>(false);
  const [isRemote, setIsRemote] = useState<boolean>(false);

  const { playlist } = useKaraokeState();
  const { room } = useRoomState();

  const [isOpenMonitor, setIsOpenMonitor] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isShowAds, setIsShowAds] = useState(false);
  const [videoCount, setVideoCount] = useState<number>(0);

  const mounted = usePromise();

  const isIOS =
    /iPad|iPhone/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  async function updatePlayerState(player: YouTubePlayer) {
    if (!player) return;
    const [muteState, playerState] = await mounted(
      Promise.allSettled([player.isMuted(), player.getPlayerState()])
    );

    // These lines will not execute if this component gets unmounted.
    if (muteState.status === "fulfilled") setIsMuted(muteState.value);
    if (playerState.status === "fulfilled") setPlayerState(playerState.value);
  }

  useEffect(() => {
    sendMessage(ACTION.SET_SONG);
    if (!!videoId) setVideoCount(videoCount + 1);
  }, [videoId]);

  useEffect(() => {
    // Create a socket connection
    const _room = isMoniter ? (router.query?.room as string) || "" : room;
    socket.emit("joinRoom", _room);

    socket.on("message", (data) => {
      if (!isMoniter) return;

      switch (data.action) {
        case ACTION.PLAY:
          handlePlay();
          break;

        case ACTION.PAUSED:
          handlePause();
          break;

        case ACTION.REPLAY:
          handleReplay();
          break;

        case ACTION.NEXT_SONG:
          break;

        case ACTION.MUTE:
          handleMute();
          break;

        case ACTION.UNMUTE:
          handleUnMute();
          break;
        default:
          break;
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (act = ACTION.PLAY) => {
    if (!room || isMoniter || !isLogin) return;

    let action: SocketData = { action: act };

    if ([ACTION.PLAY, ACTION.PAUSED, ACTION.SET_SONG].includes(act)) {
      action.videoId = videoId;
    }

    if (act === ACTION.NEXT_SONG) {
      if (playlist.length > 0) action.videoId = playlist[0].videoId;
      else action.videoId = "";
    }

    socket.emit("message", { room, action });
  };

  useEffect(() => {
    if (!isLogin && videoCount % 3 == 0) {
      handlePause();
      setIsShowAds(false);
      setTimeout(() => setIsShowAds(true), 200);
    }
  }, [videoCount]);

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

  const handleMute = async () => {
    sendMessage(ACTION.MUTE);
    try {
      const player = playerRef.current?.getInternalPlayer();
      setIsMuted(true);
      if (!player) return;
      await player.mute();
    } catch (error) {
      console.log(error);
    }
  };
  const handleUnMute = async () => {
    sendMessage(ACTION.UNMUTE);
    try {
      const player = playerRef.current?.getInternalPlayer();
      setIsMuted(false);
      if (!player) return;
      await player.unMute();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlay = async () => {
    try {
      sendMessage(ACTION.PLAY);

      const player = playerRef.current?.getInternalPlayer();

      setPlayerState(YouTube.PlayerState.PLAYING);
      if (!player) return;
      await player?.playVideo();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePause = async () => {
    sendMessage(ACTION.PAUSED);

    try {
      const player = playerRef.current?.getInternalPlayer();

      setPlayerState(YouTube.PlayerState.PAUSED);
      if (!player) return;
      await player.pauseVideo();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReplay = async () => {
    sendMessage(ACTION.REPLAY);
    try {
      const player = playerRef.current?.getInternalPlayer();
      if (!player) return;
      await player.seekTo(0, true);
    } catch (error) {
      console.log(error);
    }
  };

  const playPauseBtn = [
    playerState === YouTube.PlayerState.PLAYING
      ? {
          icon: PauseIcon,
          label: "หยุด",
          onClick: handlePause,
        }
      : {
          icon: PlayIcon,
          label: "เล่น",
          onClick: handlePlay,
        },
  ];

  const muteBtn = useMemo(
    () => [
      !isMuted
        ? {
            icon: SpeakerWaveIcon,
            label: "ปิดเสียง",
            onClick: handleMute,
          }
        : {
            icon: SpeakerXMarkIcon,
            label: "เปิดเสียง",
            onClick: handleUnMute,
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
          sendMessage(ACTION.NEXT_SONG);
          nextSong();
        },
      },
      {
        icon: ArrowUturnLeftIcon,
        label: "ร้องอีกครั้ง",
        onClick: handleReplay,
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
                await handlePause();
              }}
            >
              กดที่นี่แล้วลองอีกครั้ง
            </button>
          }
          icon={<ExclamationTriangleIcon />}
        />
      </span>
      {isLogin && !isMoniter && (
        <div
          className={`${
            isRemote
              ? " w-full aspect-video  top-0 right-0 "
              : "w-16 h-16  top-5 right-5  drop-shadow-md rounded-full "
          } bg-primary text-white  z-2 left-auto
          flex items-center justify-center  transition-all duration-50 ${
            !isRemote && playerState === PlayerStates.PLAYING ? "opacity-0" : ""
          }`}
          style={{
            zIndex: 2,
            position: "absolute",
          }}
        >
          <div className="relative">
            {isRemote && (
              <div className="absolute inset-0 flex items-center justify-center  text-xl">
                <a
                  href={`/monitor?room=${room}`}
                  target="_blank"
                  className="flex flex-col items-center justify-center text-center cursor-pointer "
                >
                  <TvIcon className="w-10 h-10" />
                  {room}
                </a>
              </div>
            )}
            <div
              className={`  cursor-pointer   ${
                isRemote ? "absolute top-5 right-5  " : ""
              }  flex items-center justify-center w-16 h-16 `}
              onClick={() => {
                setIsRemote(!isRemote);
                handlePause();
              }}
            >
              <ArrowDownLeftIcon
                className={`w-10 h-10  ${!isRemote ? "opacity-0 hidden" : ""}`}
              />
              <DeviceTabletIcon
                className={`rotate-180  w-10 h-10 ${
                  isRemote ? "opacity-0 hidden" : ""
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {isMoniter && !isOpenMonitor && (
        <div
          className={` w-full aspect-video   bg-primary text-white  z-2 left-auto
          flex items-center justify-center  transition-all duration-50  `}
          style={{
            zIndex: 2,
            position: "absolute",
          }}
        >
          <div className="relative">
            <div
              className="cursor-pointer  absolute inset-0 flex items-center justify-center  text-xl"
              onClick={() => {
                setIsOpenMonitor(true);
                handlePlay();
              }}
            >
              เปิดจอ
            </div>
          </div>
        </div>
      )}
      <div
        className="w-full aspect-video relative flex-1 md:flex-grow-1"
        onClick={() => handleFullscreenButtonClick()}
      >
        {!videoId || isRemote ? (
          <div
            className="h-full w-full flex items-center justify-center bg-black"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
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
                autoplay:
                  isLogin && playerState !== PlayerStates.PAUSED ? 1 : 0,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                modestbranding: 1,
                playsinline: isIphone && isFullScreenIphone ? 0 : 1,
              },
            }}
            onStateChange={(ev) => {
              updatePlayerState(ev.target);
            }}
            onEnd={() => {
              sendMessage(ACTION.NEXT_SONG);
              nextSong();
            }}
          />
        )}
      </div>

      {!isLogin && <BottomAds />}
      {!isLogin && isShowAds && <VideoAds />}

      {!isMoniter && (
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
          {playPauseBtn
            .concat(playerBtns, muteBtn, isRemote ? [] : fullBtn)
            .map((btn) => {
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
      )}
    </div>
  );
}

export default YoutubePlayer;
