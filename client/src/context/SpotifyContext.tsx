import { createContext, useContext, useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import useLikedTracks from "../hooks/setLikedTracks";

type Values = {
  currentUser: SpotifyApi.CurrentUsersProfileResponse | null;
  token: string;
  spotify: SpotifyWebApi.SpotifyWebApiJs;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  likedTracks: SpotifyApi.SavedTrackObject[] | undefined;
  totalTracks: number;
};

const Context = createContext<Values | null>(null);

const SpotifyContext = () => {
  return useContext(Context);
};

const spotify = new SpotifyWebApi();

const SpotifyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] =
    useState<SpotifyApi.CurrentUsersProfileResponse | null>(null);
  const [token, setToken] = useState<string>(
    window.localStorage.getItem("token") || "",
  );
  const [darkMode, setDarkMode] = useState(true);

  // liked tracks & total liked tracks
  const { likedTracks, totalTracks } = useLikedTracks(token);

  // handle current user
  const handleCurrentUser = async () => {
    try {
      const userData = await spotify.getMe();
      setCurrentUser(userData);
    } catch (error) {
      console.log("error", error);
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  useEffect(() => {
    const getTokenFromUrl = () => {
      return window.location.hash
        .substring(1)
        .split("&")
        .reduce((initial: Record<string, string>, item) => {
          const parts = item.split("=");
          if (["access_token", "expires_in", "token_type"].includes(parts[0])) {
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});
    };

    const hash = getTokenFromUrl();
    const _token = hash.access_token;

    // save token to local storage
    if (_token) {
      window.localStorage.setItem("token", _token);
    }

    // save token in state, save token in spotify instance
    const tokenFromStorage = window.localStorage.getItem("token");
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      spotify.setAccessToken(window.localStorage.getItem("token"));
      handleCurrentUser();
    }

    // Fetch current user details
    if (_token) {
      handleCurrentUser();
    }

    // Clear browser URL
    window.location.hash = "";
  }, [token]);

  const values = {
    currentUser,
    token,
    spotify,
    darkMode,
    setDarkMode,
    likedTracks,
    totalTracks,
  };

  return <Context.Provider value={values}>{children}</Context.Provider>;
};

export { SpotifyProvider, SpotifyContext };
