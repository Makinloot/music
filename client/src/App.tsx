import React from "react";
import Login from "./components/login/Login";

import Main from "./components/main/Main";
import { SpotifyContext } from "./context/SpotifyContext";
import { ConfigProvider, theme } from "antd";
const App: React.FC = () => {
  const contextValues = SpotifyContext();
  const spotifyToken = contextValues?.token || localStorage.getItem("token");

  return spotifyToken ? (
    <ConfigProvider
      theme={
        contextValues?.darkMode
          ? {
              algorithm: theme.darkAlgorithm,
            }
          : {}
      }
    >
      <Main />
    </ConfigProvider>
  ) : (
    <Login />
  );
};

export default App;
