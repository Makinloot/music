import { createContext, useContext, useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

type Values = {
  currentUser: SpotifyApi.CurrentUsersProfileResponse | null;
  token: string;
  spotify: SpotifyWebApi.SpotifyWebApiJs;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  likedTracks: SpotifyApi.SavedTrackObject[] | undefined;
  setLikedTracks: React.Dispatch<
    React.SetStateAction<SpotifyApi.SavedTrackObject[] | undefined>
  >;
  likedOffset: number;
  setLikedOffset: React.Dispatch<React.SetStateAction<number>>;
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
  const [likedTracks, setLikedTracks] = useState<
    SpotifyApi.SavedTrackObject[] | undefined
  >();
  const [likedOffset, setLikedOffset] = useState(0);

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

  // fetch liked tracks
  useEffect(() => {
    async function fetchLikedTracks() {
      try {
        let allData: SpotifyApi.SavedTrackObject[] = [];
        let hasMoreItems = true;
        let offset = 0;

        while (hasMoreItems) {
          const fetchedData = await spotify.getMySavedTracks({
            limit: 50,
            offset: offset,
          });

          if (fetchedData?.items && fetchedData.items.length > 0) {
            allData = [...allData, ...fetchedData.items];
            offset += 50;

            setLikedTracks(allData);
          } else {
            hasMoreItems = false;
          }
        }
      } catch (error) {
        console.log(`Error fetching liked tracks: ${error}`);
      }
    }

    fetchLikedTracks();
  }, [token]);

  const values = {
    currentUser,
    token,
    spotify,
    darkMode,
    setDarkMode,
    likedTracks,
    setLikedTracks,
    likedOffset,
    setLikedOffset,
  };

  return <Context.Provider value={values}>{children}</Context.Provider>;
};

export { SpotifyProvider, SpotifyContext };
