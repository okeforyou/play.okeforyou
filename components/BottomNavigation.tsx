import { useRouter } from "next/router";

import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftIcon,
  MusicalNoteIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../context/AuthContext";
import { useKaraokeState } from "../hooks/karaoke";

export default function BottomNavigation() {
  const { activeIndex, setActiveIndex } = useKaraokeState();
  const { logOut, user } = useAuth();
  const router = useRouter();

  const isLogin = !!user.uid;

  return (
    <div className="btm-nav static flex-shrink-0 h-1/9 text-sm">
      <button
        className={`text-primary  shrink ${activeIndex === 1 ? "active" : ""}`}
        onClick={() => setActiveIndex(1)}
      >
        <MusicalNoteIcon className="w-6 h-6" />
        <span className="btm-nav-label">ศิลปิน</span>
      </button>
      <button
        className={`text-primary shrink ${activeIndex === 2 ? "active" : ""}`}
        onClick={() => setActiveIndex(2)}
      >
        <TrophyIcon className="w-6 h-6" />
        <span className="btm-nav-label ">เพลงฮิต</span>
      </button>
      <a
        className={`text-primary shrink`}
        href={isLogin ? "https://party.okeforyou.com/" : ""}
        target="_blank"
        rel="noopener"
        onClick={(e) => {
          if (!isLogin) {
            e.preventDefault();
            router.push("/login");
          }
        }}
      >
        <UserGroupIcon className="w-6 h-6" />
        โหมด Party
      </a>

      <a
        className={`text-primary shrink`}
        href="https://okeforyou.com/contact/"
        target="_blank"
        rel="noopener"
      >
        <ChatBubbleLeftIcon className="w-6 h-6" />
        ติดต่อ Line
      </a>
      {!user.uid ? (
        <button
          title="เข้าสู่ระบบ"
          className={`text-gray-500 flex-none  w-10 h-8`}
          onClick={() => {
            router.push("/login");
          }}
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
        </button>
      ) : (
        <button
          className={`text-gray-500 flex-none  w-10 h-8`}
          onClick={logOut}
          title="ออกจากระบบ"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
