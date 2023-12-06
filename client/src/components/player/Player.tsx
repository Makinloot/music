import { useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import { SpotifyContext } from "../../context/SpotifyContext";

const Player = ({ accessToken }: { accessToken: string }) => {
  const contextValues = SpotifyContext();

  useEffect(() => {
    contextValues?.setPlay(true);
  }, [contextValues?.trackUris]);

  return (
    <div className="player fixed bottom-0 w-full">
      <SpotifyPlayer
        token={accessToken}
        callback={(state) => {
          // console.log(state);
          if (!state.isPlaying) contextValues?.setPlay(false);
        }}
        play={contextValues?.play}
        uris={contextValues?.trackUris ? contextValues?.trackUris : []}
      />
    </div>
  );
};

export default Player;
