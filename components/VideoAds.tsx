import React, { useEffect, useRef, useState } from "react";

import { useAds } from "../context/AdsContext";
import { Ad } from "../services/adsServices";

const VideoAds: React.FC = () => {
  const { data: _data, error, isLoading } = useAds();
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [showAd, setShowAd] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const data = _data.videoAds;

    if (!isLoading && data.length > 0) {
      const randomAd = data[Math.floor(Math.random() * data.length)];
      setCurrentAd(randomAd);
      setShowAd(true);

      if (randomAd.videoUrl) {
      } else {
        // If the ad is an image, set a timeout to switch after 5 seconds
        const timeout = setTimeout(() => {
          setShowAd(false);
        }, 5000);

        return () => clearTimeout(timeout); // Cleanup timeout on component unmount
      }
    }
  }, [_data, isLoading]);

  useEffect(() => {
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.addEventListener("ended", handleVideoEnded);
        videoRef.current.muted = true;
        videoRef.current.autoplay = true;
        videoRef.current.play().catch((error) => {
          console.error("Autoplay failed:", error);
        });
      }
    }, 700);
  }, [videoRef?.current]);

  const handleVideoEnded = () => {
    setShowAd(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading ads: {error.message}</div>;

  return (
    showAd && (
      <div
        className={`absolute flex h-full inset-0 z-30 items-center justify-center ${
          showAd ? "bg-black bg-opacity-30" : ""
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {currentAd && (
          <div
            key={currentAd.linkAdsUrl}
            className="transition-opacity dsuration-500 ease-in-out"
            onClick={() => window.open(currentAd.linkAdsUrl, "_blank")}
          >
            <a
              href={currentAd.linkAdsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {currentAd.imageUrl && (
                <img
                  src={currentAd.imageUrl}
                  alt={currentAd.text}
                  className="object-contain h-96"
                />
              )}
              {currentAd.videoUrl && (
                <video ref={videoRef} controls={false} className="h-96">
                  <source src={currentAd.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {!currentAd.imageUrl && !currentAd.videoUrl && (
                <p>{currentAd.text}</p>
              )}
            </a>
          </div>
        )}
      </div>
    )
  );
};

export default VideoAds;
