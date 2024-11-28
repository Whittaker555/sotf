"use client";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { Suspense, useState } from "react";
import { SpotifyPlaylistResponse } from "./models/spotifyplaylistresponse";

export default function Home() {
  const { data: session } = useSession();
  const [playlist, setPlaylist] = useState<SpotifyPlaylistResponse>();
  if (session && !playlist) {
    fetch("/api/spotify")
      .then((res) => res.json())
      .then((data) => setPlaylist(data));
  }
  if (session) {
    return (
      <Suspense>
        <div className="p-6">
          <p className="text-white font-normal text-xl mt-5 mb-2">
            Signed In as
          </p>
          <span className="bold-txt">{session?.user?.name}</span>
          {playlist?.items
            .filter((item) => item !== null)
            .map((item) => (
              <div
                key={item?.id}
                className="flex items-center justify-between w-96 h-24 bg-white rounded-xl p-4 mt-4"
              >
                <img
                  src={item?.images ? item?.images[0].url : undefined}
                  alt=""
                  className="w-16 h-16 rounded-lg"
                />
                <div className="flex flex-col ml-4">
                  <p className="text-black font-bold">{item?.name}</p>
                  <a
                    href={item?.external_urls.spotify}
                    className="text-blue-500 underline"
                  >
                    Open in Spotify
                  </a>
                </div>
              </div>
            ))}
          <p
            className="opacity-70 mt-8 mb-5 underline cursor-pointer"
            onClick={() => signOut()}
          >
            Sign Out
          </p>
        </div>
      </Suspense>
    );
  } else {
    return (
      <div>
        <button
          onClick={() => signIn()}
          className="shadow-primary w-56 h-16 rounded-xl bg-white border-0 text-black text-3xl active:scale-[0.99] m-6"
        >
          Sign In
        </button>
      </div>
    );
  }
}
