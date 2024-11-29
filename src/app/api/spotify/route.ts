import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.access_token || !token.sub) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return await fetch(
    `https://api.spotify.com/v1/users/${token.sub}/playlists`,
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => NextResponse.json(data))
    .catch((error) => {
      console.error("Error fetching Spotify user data:", error);
      return NextResponse.json(
        { message: "Failed to fetch Spotify user data." },
        { status: 500 }
      );
    });
}
