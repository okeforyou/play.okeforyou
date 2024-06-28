import Image from "next/image";
import { Fragment, useState } from "react";
import { useQuery } from "react-query";

import { useKaraokeState } from "../hooks/karaoke";
import { getArtists, getSkeletonItems, getTopArtists } from "../utils/api";
import JooxError from "./JooxError";

export default function ListSingerGrid({ showTab = true }) {
  const { data: topArtistsData, isLoading: isLoadTopArtists } = useQuery(
    ["getTopArtists"],
    getTopArtists,
    {
      retry: false,
      refetchInterval: 0,
      onError: () => {
        setIsError(true);
      },
    }
  );

  const [tagId, setTagId] = useState("193");
  const { data: artists, isLoading } = useQuery(
    ["getArtists", tagId],
    () => getArtists(tagId),
    {
      retry: false,
      refetchInterval: 0,
      onError: () => {
        setIsError(true);
      },
    }
  );
  const { setSearchTerm } = useKaraokeState();
  const { artist: topArtists } = topArtistsData || {};
  const { artist } = artists || {};
  const { setActiveIndex } = useKaraokeState();
  const [isError, setIsError] = useState(false);

  return isError ? (
    <JooxError />
  ) : (
    <>
      <div className="col-span-full  bg-transparent pt-2">
        {showTab && (
          <nav className="tabs tabs-boxed flex justify-center  bg-transparent">
            <button type="button" className="tab tab-active">
              ศิลปินยอดฮิต
            </button>
            <button
              type="button"
              className="tab"
              onClick={() => {
                setActiveIndex(2);
              }}
            >
              มาแรง
            </button>
          </nav>
        )}
      </div>
      <div className="col-span-full  bg-transparent  pl-2 text-2xl">
        ศิลปินยอดนิยม
      </div>
      <div
        className={`relative grid grid-cols-4 xl:grid-cols-6 gap-2 col-span-full pt-2 pb-4`}
      >
        {isLoadTopArtists && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-base-300 z-10" />
            {getSkeletonItems(16).map((s) => (
              <div
                key={s}
                className="card bg-gray-300 animate-pulse w-full aspect-w-1 aspect-h-1"
              ></div>
            ))}
          </>
        )}
        {topArtists?.map((artist) => {
          return (
            <Fragment key={artist.name}>
              <div
                className="overflow-hidden bg-transparent cursor-pointer flex-auto"
                onClick={() => {
                  setSearchTerm(artist.name);
                }}
              >
                <figure className="relative w-full aspect-square">
                  <Image
                    unoptimized
                    src={artist.imageUrl}
                    priority
                    alt={artist.name}
                    layout="fill"
                    className="animate-pulse bg-gray-400 rounded-lg"
                    onLoad={(ev) =>
                      ev.currentTarget.classList.remove("animate-pulse")
                    }
                    onErrorCapture={(ev) => {
                      ev.currentTarget.src = "/assets/avatar.jpeg";
                    }}
                  />
                </figure>
                <div className="card-body p-1">
                  <h2 className="text-sm 2xl:text-md text-center pt-2 line-clamp-2">
                    {artist.name}
                  </h2>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
      <div className="col-span-full  bg-transparent p-2 pl-2 text-2xl">
        หมวดหมู่ศิลปิน {isError}
      </div>
      {!isLoadTopArtists && (
        <div
          className={`tabs tabs-boxed col-span-full justify-center bg-transparent relative grid grid-cols-3 xl:grid-cols-5  gap-2 col-span-full p-0`}
        >
          {topArtistsData?.artistCategories.map((cat) => {
            const names = cat.tag_name.replace("/ ", "").split(" ");

            const firstword = names[0] || "";
            let lastword = "";
            if (names.length > 1) {
              names.shift();
              lastword = names.join(" ");
            }
            // Tag list
            return (
              <div
                key={cat.tag_id}
                className={`text-sm h-20 leading-6 hover:drop-shadow-xl hover:text-slate-200 tracking-wide text-white bg-slate-900 tab bg-cover bg-no-repeat ${
                  tagId == cat.tag_id ? "tab-active" : ""
                }   
                `}
                onClick={() => setTagId(cat.tag_id)}
                style={{ backgroundImage: `url('${cat.imageUrl}')` }}
              >
                <div
                  className="absolute  top-0 h-full w-full bg-fixed items-center"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                >
                  <div className="flex h-full items-center justify-center">
                    {firstword}
                    <br />
                    {lastword}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {isLoading && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-base-300 z-10" />
          {getSkeletonItems(16).map((s) => (
            <div
              key={s}
              className="card bg-gray-300 animate-pulse w-full aspect-w-4 aspect-h-3"
            />
          ))}
        </>
      )}
      <div className="col-span-full bg-transparent p-4 pb-2 pl-2 text-2xl">
        {(topArtistsData?.artistCategories || []).find(
          (cat) => cat.tag_id === tagId
        )?.tag_name || "ศิลปินไทย ชายเดี่ยว"}
      </div>
      <div
        className={`tabs tabs-boxed col-span-full justify-center bg-transparent relative grid grid-cols-3 xl:grid-cols-5  gap-2 col-span-full p-0`}
      >
        {artist?.map((artist) => {
          return (
            <Fragment key={artist.name}>
              <div
                className="card overflow-hidden bg-white shadow hover:shadow-md cursor-pointer flex-auto rounded-lg"
                onClick={() => {
                  setSearchTerm(artist.name);
                }}
              >
                <figure className="relative w-full aspect-square">
                  <Image
                    unoptimized
                    src={artist.imageUrl}
                    priority
                    alt={artist.name}
                    layout="fill"
                    className="animate-pulse bg-gray-400"
                    onLoad={(ev) =>
                      ev.currentTarget.classList.remove("animate-pulse")
                    }
                    onErrorCapture={(ev) => {
                      ev.currentTarget.src = "/assets/avatar.jpeg";
                    }}
                  />
                </figure>
                <div className="card-body p-2">
                  <h2 className="font-semibold  text-sm 2xl:text-2xl line-clamp-2 h-[2.7em]">
                    {artist.name}
                  </h2>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
