import NextAuth from "next-auth/next";
import { type NextAuthOptions } from "next-auth";
import SpotifyProvider from 'next-auth/providers/spotify';
import { JWT } from "next-auth/jwt";

const scopes = "user-read-private user-read-email ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative user-read-recently-played";
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
            refreshToken(token);
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

async function refreshToken(token: JWT) {
    try{
        if (token.refreshToken === undefined) {
            return {
                ...token,
                error: "Refresh token not found"
            }
        }
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64")
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: token.refreshToken as string
            }),
            cache: "no-cache"
        });
        const data = await response.json();
        return {
            ...token,
            access_token: data.access_token,
            accessTokenExpires: Date.now() + data.expires_in
        }
    }catch(e){
        console.log(e);
        return {
            ...token,
            error: "Refresh token failed"
        }
    }
}


export { handler as GET, handler as POST };

