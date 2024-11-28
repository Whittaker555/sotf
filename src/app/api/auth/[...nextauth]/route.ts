import NextAuth from "next-auth/next";
import { type NextAuthOptions } from "next-auth";
import SpotifyProvider from 'next-auth/providers/spotify';

var scopes = "user-read-private user-read-email ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative user-read-recently-played";
const options: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID || "",
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
            authorization: "https://accounts.spotify.com/authorize?scope=" + scopes,
          }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if(account){
                token.access_token = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpires = account.expires_at;
            }

            if(Date.now() < token.accessTokenExpires! * 1000){
                return token
            }
            console.log("Token expired")
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.access_token as string;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(options);

export { handler as GET, handler as POST };

