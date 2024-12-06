
import { SpotifyPlaylistItem } from "@/app/models/spotifyplaylistresponse";
import Image from "next/image";

export default function PlaylistCard(item: SpotifyPlaylistItem ) {
    return(
        <div
        key={item?.id}
        className="flex items-center justify-between w-96 h-24 bg-white rounded-xl p-4 mt-4"
      >
        {item?.images && (
          <Image
            src={item?.images[0]?.url}
            alt="Playlist Image"
            width={100}
            height={100}
            className="w-16 h-16 rounded-lg"
          />
        )}
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
    )
}