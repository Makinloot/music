export const authEndpoint = "https://accounts.spotify.com/authorize";

const redirectUri = "http://localhost:5173";
const clientId = process.env.CLIENT_ID;

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

const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;

export async function authUrl(req, res) {
  try {
    res.json(loginUrl);
  } catch (error) {
    console.log(`error sending auth url: ${error}`);
    res.status(404).json(`error sending auth url: `, error);
  }
}
