import { NextRequest, NextResponse } from "next/server";

declare global {
  // eslint-disable-next-line no-var
  var userPlaylists: Map<string, Set<string>> | undefined;
}

// In-memory store for playlists per user
const userPlaylists: Map<string, Set<string>> = globalThis.userPlaylists || new Map();
if (!globalThis.userPlaylists) {
  globalThis.userPlaylists = userPlaylists;
}

export async function POST(req: NextRequest) {
  try {
    const { userId, playlistId } = await req.json();
    if (!userId || !playlistId) {
      return NextResponse.json({ message: "userId and playlistId required" }, { status: 400 });
    }
    const playlists = userPlaylists.get(userId) || new Set<string>();
    playlists.add(playlistId);
    userPlaylists.set(userId, playlists);
    return NextResponse.json({ message: "Playlist added" });
  } catch (error) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, playlistId } = await req.json();
    if (!userId || !playlistId) {
      return NextResponse.json({ message: "userId and playlistId required" }, { status: 400 });
    }
    const playlists = userPlaylists.get(userId);
    if (playlists) {
      playlists.delete(playlistId);
    }
    return NextResponse.json({ message: "Playlist deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
