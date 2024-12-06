"use client";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div>
      <button
        onClick={() => signIn("spotify", {
          callbackUrl: "/playlists",
          redirect: true
        })}
        className="shadow-primary w-56 h-16 rounded-xl bg-white border-0 text-black text-3xl active:scale-[0.99] m-6"
      >
        Connect your Spotify
      </button>
    </div>
  );
}
