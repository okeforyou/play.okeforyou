import Image from "next/image";
import { Fragment, useState } from "react";
import { useQuery } from "react-query";

import { useKaraokeState } from "../hooks/karaoke";
import { getArtists, getSkeletonItems, getTopArtists } from "../utils/api";

export default function ListSingerGrid() {
  const { data: topArtistsData, isLoading: isLoadTopArtists } = useQuery(
    ["getTopArtists"],
    getTopArtists
  );

  const [gender, setGender] = useState(193);
  const { data: artists, isLoading } = useQuery(["getArtists", gender], () =>
    getArtists(gender)
  );
  const { setSearchTerm } = useKaraokeState();
  const { artist: topArtists } = topArtistsData || {};
  const { artist } = artists || {};

  return (
    <>
      <div className="text-center text-2xl col-span-full pt-4">
        ศิลปินยอดฮิต
      </div>
      <div
        className={`relative grid grid-cols-4 xl:grid-cols-6  gap-4 col-span-full p-8 pt-4`}
      >
        {isLoadTopArtists && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-base-300 z-50" />
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
                className="overflow-hidden bg-transparent   cursor-pointer flex-auto"
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
                    className="animate-pulse bg-gray-400 rounded-full"
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

      {!isLoadTopArtists && (
        <div
          className={`tabs tabs-boxed col-span-full justify-center bg-transparent relative grid grid-cols-3 xl:grid-cols-5  gap-2 col-span-full`}
        >
          {/* @ts-ignore */}
          {topArtistsData.artistCategories.map((cat) => {
            const names = cat.tag_name.replace("/ ", "").split(" ");

            const firstword = names[0] || "";
            let lastword = "";
            if (names.length > 1) {
              names.shift();
              lastword = names.join(" ");
            }

            return (
              <div
                key={cat.tag_id}
                className={`text-sm h-20 leading-6 hover:drop-shadow-xl hover:text-slate-200 tracking-wide text-white bg-slate-900 tab  ${
                  gender == cat.tag_id ? "tab-active" : ""
                }`}
                onClick={() => setGender(cat.tag_id)}
              >
                {firstword}
                <br />
                {lastword}
              </div>
            );
          })}
        </div>
      )}
      {isLoading && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-base-300 z-50" />
          {getSkeletonItems(16).map((s) => (
            <div
              key={s}
              className="card bg-gray-300 animate-pulse w-full aspect-w-4 aspect-h-3"
            />
          ))}
        </>
      )}
      {artist?.map((artist) => {
        return (
          <Fragment key={artist.name}>
            <div
              className="card overflow-hidden bg-white shadow hover:shadow-md cursor-pointer flex-auto rounded-xl "
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
    </>
  );
}
