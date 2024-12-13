"use client";
import { useSession } from "next-auth/react";
import { SpotifyPlaylistResponse } from "../models/spotifyplaylistresponse";
import { useState } from "react";
import PlaylistCard from "./components/playlistCard";

export default function Playlists() {
  const { data: session } = useSession();

  const [playlist, setPlaylist] = useState<SpotifyPlaylistResponse>();
  if (session && !playlist) {
    fetch("/api/spotify")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then((data) => setPlaylist(data));
  }
  if (session?.error) {
    return <div>{session.error}</div>;
  }
  return (
    <div className="p-6">
      {playlist?.items && (
        <div>
          <p className="text-white font-normal text-xl mt-5 mb-2">
            Your Playlists
          </p>
          <ul>
            {playlist?.items
              .filter((item) => item !== null)
              .map((item) => PlaylistCard(item))}
          </ul>
        </div>
      )}
    </div>
  );
}
