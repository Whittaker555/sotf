import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Schema } from "../../../../../amplify/data/resource";
import { generateClient } from 'aws-amplify/data';

// interface Playlist {
//   playlistId: string;
// }

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
    .then((data) => {
      return NextResponse.json(data);
    })
    .catch((error) => {
      console.error("Error fetching Spotify user data:", error);
      return NextResponse.json(
        { message: "Failed to fetch Spotify user data." },
        { status: 500 }
      );
    });
}

export async function POST(req: NextRequest) {

  const client = generateClient<Schema>();


  const { data, errors } = await client.mutations.addPlaylistId({
    id: "1",
    playlistId: "1",
  });
  console.log(data, errors);



  // // add playlist to user_playlists dynamodb
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // if (!token || !token.access_token || !token.sub) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }
  // const spotifyId = token.sub;
  // const client = new DynamoDBClient({});
  // const docClient = DynamoDBDocumentClient.from(client);

  // const reqBody = await req.json();
  // const {playlistId} = reqBody;

  // const command = new GetCommand({
  //   TableName: "user_playlists",
  //   Key: {
  //     user: spotifyId,
  //   },
  // });

  // const response = await docClient.send(command);
  // if (!response.Item) {
  //   const putCommand = new PutCommand({
  //     TableName: "user_playlists",
  //     Item: {
  //       user: spotifyId,
  //       playlists: [{ playlistId }],
  //     },
  //   });

  //   await docClient.send(putCommand);
  // } else {
  //   if(response.Item.playlists.find((playlist : Playlist) => playlist.playlistId === playlistId)) {
  //     return NextResponse.json({ message: "Playlist already added" });
  //   }
    
  //   const putCommand = new PutCommand({
  //     TableName: "user_playlists",
  //     Item: {
  //       user: spotifyId,
  //       playlists: [
  //         ...response.Item.playlists,
  //         { playlistId },
  //       ],
  //     },
  //   });

  //   await docClient.send(putCommand);
  // }

  return NextResponse.json({ message: "Playlist added" });

}

