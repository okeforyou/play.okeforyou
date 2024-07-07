import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { CheckCircleIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";

import Alert, { AlertHandler } from "../components/Alert";
import YoutubePlayer from "../components/YoutubePlayer";
import { useAuth } from "../context/AuthContext";
import { useRoomState } from "../hooks/room";
import { ACTION } from "../types/socket";
import { socket } from "../utils/socket";

const Monitor = () => {
  const router = useRouter();
  const { room } = router.query;
  const [videoId, setVideoId] = useState<string>("");
  const alertRef = useRef<AlertHandler>(null);

  const { user } = useAuth();
  const { room: roomOfMonitor } = useRoomState();

  const isLogin = !!user.uid;

  if (!isLogin) router.push("/login");

  useEffect(() => {
    if (!room) {
      socket.emit("joinRoom", roomOfMonitor);
    }

    socket.on("message", (data) => {
      if (data?.videoId !== undefined) setVideoId(data?.videoId);

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
            videoId={videoId}
            nextSong={() => {}}
            className="flex flex-col flex-1 sm:flex-grow-0"
            isMoniter
          />
        </div>
      ) : (
        <div className="relative h-screen">
          <div className="cursor-pointer absolute text-center inset-0 flex flex-col items-center justify-center text-xl">
            YouOke TV
            <br /> เลขห้อง: {roomOfMonitor}
            <br />
            <span className="text-sm text-gray-500">
              กรอกเลขห้องบนมือถือของคุณ
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Monitor;
