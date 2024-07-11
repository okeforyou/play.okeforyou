import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { CheckCircleIcon } from "@heroicons/react/24/outline";

import Alert, { AlertHandler } from "../components/Alert";
import YoutubePlayer from "../components/YoutubePlayer";
import { useAuth } from "../context/AuthContext";
import { useKaraokeState } from "../hooks/karaoke";
import { useRoomState } from "../hooks/room";
import { ACTION } from "../types/socket";
import { generateRandomString } from "../utils/random";
import { socket } from "../utils/socket";

const Monitor = () => {
  const router = useRouter();
  const { room } = router.query;
  const alertRef = useRef<AlertHandler>(null);

  const { playlist, curVideoId, setPlaylist, setCurVideoId } =
    useKaraokeState();

  const { user } = useAuth();
  const { room: roomOfMonitor, setRoom } = useRoomState();

  useEffect(() => {
    if (roomOfMonitor === "") {
      setRoom(generateRandomString(6));
    }

    if (!room) {
      socket.emit("joinRoom", roomOfMonitor);
    }

    socket.on("message", (data) => {
      if (data?.videoId !== undefined) setCurVideoId(data?.videoId);

      if (!room) {
        switch (data.action) {
          case ACTION.REMOTE_JOIN:
            // show connect
            alertRef?.current.open();
            router.push(`/monitor?room=${roomOfMonitor}`);
            break;
        }
      }
    });
  }, [room]);

  useEffect(() => {
    if (playlist?.length && !curVideoId) {
      // playing first video
      const [video, ...newPlaylist] = playlist;
      setCurVideoId(video.videoId);

      socket.emit("message", {
        room: router.query?.room as string,
        action: { action: ACTION.SET_PLAYLIST_FROM_TV, playlist: newPlaylist },
      });
      // then remove it from playlist
      setPlaylist(newPlaylist);
    }
  }, [playlist, curVideoId, router.query?.room]);

  return (
    <>
      <Alert
        ref={alertRef}
        timer={2500}
        headline="สำเร็จ"
        headlineColor="text-green-600"
        bgColor="bg-green-100"
        content={<span className="text-sm">เชื่อมต่อสำเร็จ</span>}
        icon={<CheckCircleIcon />}
      />
      {!!room ? (
        <div>
          <YoutubePlayer
            videoId={curVideoId}
            nextSong={() => {
              setCurVideoId("");
            }}
            className="flex flex-col flex-1 sm:flex-grow-0"
            isMoniter
          />
        </div>
      ) : (
        <div className="relative h-screen">
          <div className="cursor-pointer absolute text-center inset-0 flex flex-col items-center justify-center text-5xl">
            YouOke TV
            <br /> เลขห้อง: {roomOfMonitor}
            <br />
            <span className="text-3xl text-gray-500 pt-4">
              กรอกเลขห้องบนมือถือของคุณ
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Monitor;
