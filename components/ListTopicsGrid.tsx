import Image from "next/image";
import { Fragment } from "react";
import { useQuery } from "react-query";

import { useKaraokeState } from "../hooks/karaoke";
import { getSkeletonItems, getTopics } from "../utils/api";

export default function ListTopicsGrid() {
  const { data, isLoading } = useQuery(["getTopics"], getTopics);
  const { setActiveIndex, setSearchTerm } = useKaraokeState();
  const { topic: topics } = data || {};

  return (
    <div
      className={`relative grid grid-cols-2 xl:grid-cols-3  gap-2 col-span-full`}
    >
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
      {topics?.map((topic) => {
        return (
          <Fragment key={topic.key}>
            <div
              className="card rounded-lg overflow-hidden bg-white shadow hover:shadow-md cursor-pointer flex-auto"
              onClick={() => {
                setSearchTerm(
                  topic.title +
                    " " +
                    //@ts-ignore
                    topic.artist_name
                );
                setActiveIndex(0);
              }}
            >
              <figure className="relative w-full aspect-w-1 aspect-h-1">
                <Image
                  unoptimized
                  src={topic.coverImageURL}
                  priority
                  alt={topic.title}
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
              <div className="card-body p-2 gap-y-0">
                <h2 className="font-semibold text-sm 2xl:text-lg line-clamp-2">
                  {topic.title}
                </h2>
                <h2 className="text-xs 2xl:text-lg text-gray-400">
                  {/* @ts-ignore */}
                  {topic.artist_name}
                </h2>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
