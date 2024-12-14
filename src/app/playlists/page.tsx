"use client";
import { useSession } from "next-auth/react";
import { SpotifyPlaylistResponse } from "../models/spotifyplaylistresponse";
import { useState } from "react";
import PlaylistCard from "./components/playlistCard";

interface ErrorResponse {
  status: number;
  message: string;
}

export default function Playlists() {
  const { data: session } = useSession();
  const [playlist, setPlaylist] = useState<SpotifyPlaylistResponse>();
  const [error, setError] = useState<ErrorResponse>();
  if (session && !playlist && !error) {
    fetch("/api/spotify")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then((data) => {
        if(data.error){
          setError(data.error);
          return;
        }
        setPlaylist(data);
      });
  }
  if (session?.error) {
    return <div>{session.error}</div>;
  }

  return (
    <div className="p-6">
      {error && <div>{error.message}</div>}
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
