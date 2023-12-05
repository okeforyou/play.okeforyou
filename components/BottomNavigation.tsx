import {
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  RectangleStackIcon,
} from "@heroicons/react/20/solid";
import { useKaraokeState } from "../hooks/karaoke";

export default function BottomNavigation() {
  const { activeIndex, setActiveIndex } = useKaraokeState();
  return (
    <div className="btm-nav static flex-shrink-0">
      <button
        className={`text-primary ${activeIndex === 0 ? "active" : ""}`}
        onClick={() => setActiveIndex(0)}
      >
       
        <span className="btm-nav-label">ค้นหา</span>
      </button>
      <button
       className={`text-primary ${activeIndex === 0 ? "active" : ""}`}
       onClick={() => setActiveIndex(0)}
      >
       
        <a href="https://party.okeforyou.com/" target="_blank" rel="noopener">โหมด Party</a>
      </button>
      
      <button
        className={`text-primary ${activeIndex === 0 ? "active" : ""}`}
        onClick={() => setActiveIndex(0)}
      >
        
        <a href="https://okeforyou.com/contact/" target="_blank" rel="noopener">ติดต่อ Line</a>
      </button>
    </div>
  );
}
