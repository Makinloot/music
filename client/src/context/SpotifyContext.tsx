import { createContext, useContext, useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

type Values = {
  currentUser: SpotifyApi.CurrentUsersProfileResponse | null;
  token: string;
};

const Context = createContext<Values | null>(null);

const SpotifyContext = () => {
  return useContext(Context);
};

const spotify = new SpotifyWebApi();

const SpotifyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] =
    useState<SpotifyApi.CurrentUsersProfileResponse | null>(null);
  const [token, setToken] = useState<string>(() => {
    const storedToken = window.localStorage.getItem("token");
    return storedToken || "";
  });

  // handle current user
  const handleCurrentUser = async () => {
    spotify.getMe().then((user) => setCurrentUser(user));
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

    if (_token) {
      window.localStorage.setItem("token", _token);
      setToken(_token);
    }

    // Set access token for SpotifyWebApi instance
    if (token) {
      spotify.setAccessToken(token);
    }

    // Fetch current user details
    if (_token) {
      handleCurrentUser();
    }

    // Clear browser URL
    window.location.hash = "";
  }, [token]); // Include 'token' in the dependency array

  const values = {
    currentUser,
    token,
  };

  return <Context.Provider value={values}>{children}</Context.Provider>;
};

export { SpotifyProvider, SpotifyContext };
