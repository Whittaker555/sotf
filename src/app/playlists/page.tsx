"use client";
import { useSession } from "next-auth/react";
import { SpotifyPlaylistResponse } from "../models/spotifyplaylistresponse";
import { useEffect, useState } from "react";
import PlaylistCard from "./components/playlistCard";
import PlaylistDetails from "./components/playlistDetails";
import PlaylistDetailsSection from "./components/playlistDetails";
import {Button, Modal} from "flowbite-react";

interface ErrorResponse {
  status: number;
  message: string;
}
export interface PlaylistDetails {
  items: Array<{
    track: {
      album: {
        href: string;
        name: string;
      };
      href: string;
      name: string;
    };
    added_by: {
      id: string;
    };
  }>;
}

export default function Playlists() {
  const { data: session } = useSession();
  const [playlistArray, setPlaylistArray] = useState<SpotifyPlaylistResponse>();
  const [playlistId, setPlaylistId] = useState<string>();
  const [playlistDetails, setPlaylistDetails] = useState<PlaylistDetails>();
  const [error, setError] = useState<ErrorResponse>();
  const[showModal, setShowModal] = useState(false);

  if (session && !playlistArray && !error) {
    fetch("/api/spotify/playlists")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setPlaylistArray(data);
      });
  }

  useEffect(() => {
    if (!playlistId) {
      return;
    }
    fetch(`/api/spotify/playlist?id=${playlistId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then((data) => {
        setPlaylistDetails(data);
      });
  }, [playlistId]);

  if (session?.error) {
    return <div>{session.error}</div>;
  }
  const onPlaylistClick = (item: string) => {
    setPlaylistId(item);
    setShowModal(true);
  };

  const handleTrackPlaylist = () => {
    if (!playlistId) {
      return;
    }
    fetch(`/api/spotify/playlists`, {
      method: 'POST', 
      body: JSON.stringify({'playlistId': playlistId})
    })
    .then((res) => {
      console.log(res)
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
    }).finally(() => {
      setShowModal(false);
    });
  };

  return (
    <div className="p-6">
      {error && <div>{error.message}</div>}
      {playlistArray?.items && (
        <div className="flex flex-row">
          <div className="basis-4/12 ">
            <p className="text-white font-normal text-xl mt-5 mb-2">
              Your Playlists
            </p>
            <ul>
              {playlistArray?.items
                .filter((item) => item !== null)
                .map((item) => PlaylistCard(item, onPlaylistClick))}
            </ul>
          </div>
          <div>
            {playlistDetails && PlaylistDetailsSection(playlistDetails)}
          </div>
          
                
      <Modal show={showModal} id="modal" title="Track Playlist?" onClose={() => setShowModal(false)}>
      <Modal.Header>Track Playlist {playlistId}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Do you want to track playlist {playlistId}?
            </p>
          
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => handleTrackPlaylist()}>Yes</Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            No
          </Button>
        </Modal.Footer>
      </Modal>

        </div>
      )}
    </div>
  );
}
