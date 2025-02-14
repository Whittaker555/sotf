import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.access_token || !token.sub) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch existing playlists from your API.
    const existingResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/user/${token.name}`
    );
    const existingPlaylists = await existingResponse.json();

    // Fetch Spotify playlists.
    const spotifyResponse = await fetch(
      `https://api.spotify.com/v1/users/${token.sub}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );
    const allUserPlaylists = await spotifyResponse.json();
    const existingIds = new Set(existingPlaylists);

    // Map over the Spotify playlists and add an "isExisting" flag.
    const modifiedPlaylists = {
      ...allUserPlaylists,
      items: allUserPlaylists.items.map((playlist: any) => ({
        ...playlist,
        isExisting: existingIds.has(playlist.id),
      })),
    };
    return NextResponse.json(modifiedPlaylists);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Failed to fetch Spotify user data." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Retrieve the token from the request using next-auth's JWT helper.
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.access_token || !token.sub) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse the incoming JSON payload.
    // Expecting a JSON object with a "playlistId" property.
    const { playlistId } = await req.json();

    // Call your API endpoint to log the playlist for the user.
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: token.name, // Use the token's "name" as the user ID.
        playlistId,         // The playlist ID from the request payload.
      }),
    });

    // Check for a successful response.
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Return the API's JSON response.
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error calling API:", error);
    return NextResponse.json(
      { message: "Error calling API", error: error.message },
      { status: 500 }
    );
  }
}
