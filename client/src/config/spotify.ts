export const authEndpoint = "https://accounts.spotify.com/authorize";

const redirectUri = "http://localhost:5173";
const clientId = "b51490b7ecab47ce982667c5c29f8eed";

const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read",
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20",
)}&response_type=token&show_dialog=true`;
