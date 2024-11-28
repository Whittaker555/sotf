export interface SpotifyPlaylistResponse {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: (SpotifyPlaylistItem | null)[];
  }
  
  interface SpotifyPlaylistItem {
    name: string;
    collaborative: boolean;
    description: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: SpotifyImage[];
  }
  
  interface SpotifyImage {
    height: number;
    url: string;
    width: number;
  }