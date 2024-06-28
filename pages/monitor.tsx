import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import YoutubePlayer from "../components/YoutubePlayer";
import { useAuth } from "../context/AuthContext";
import { socket } from "../utils/socket";

const Monitor = () => {
  const router = useRouter();
  const { room } = router.query;
  const [videoId, setVideoId] = useState<string>("");

  const { user } = useAuth();
  const isLogin = !!user.uid;

  if (!isLogin) router.push("/login");

  useEffect(() => {
    if (!room) return;

    socket.on("message", (data) => {
      if (data?.videoId !== undefined) setVideoId(data?.videoId);
    });
  }, [room]);

  return (
    <div>
      <YoutubePlayer
        videoId={videoId}
        nextSong={() => {}}
        className="flex flex-col flex-1 sm:flex-grow-0"
        isMoniter
      />
    </div>
  );
};

export default Monitor;
