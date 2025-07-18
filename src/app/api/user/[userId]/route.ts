import { NextRequest, NextResponse } from "next/server";

declare global {
  // eslint-disable-next-line no-var
  var userPlaylists: Map<string, Set<string>> | undefined;
}

const userPlaylists: Map<string, Set<string>> = globalThis.userPlaylists || new Map();
if (!globalThis.userPlaylists) {
  globalThis.userPlaylists = userPlaylists;
}

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;
  if (!userId) {
    return NextResponse.json({ message: "userId required" }, { status: 400 });
  }
  const playlists = Array.from(userPlaylists.get(userId) || []);
  return NextResponse.json(playlists);
}
