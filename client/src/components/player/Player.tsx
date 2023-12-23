import SpotifyPlayer from "react-spotify-web-playback";
import { SpotifyContext } from "../../context/SpotifyContext";

const Player = ({ accessToken }: { accessToken: string }) => {
  const contextValues = SpotifyContext();

  return (
    <div className="player fixed bottom-0 z-[40000] w-full">
      <SpotifyPlayer
        hideAttribution
        styles={{ height: 80 }}
        token={accessToken}
        callback={(state) => {
          // console.log(state);
          if (!state.isPlaying) contextValues?.setPlay(false);
          else {
            contextValues?.setPlay(true);
            contextValues?.setActiveUri(state.track.uri);
          }
        }}
        play={contextValues?.play}
        uris={contextValues?.trackUris ? contextValues?.trackUris : []}
      />
    </div>
  );
};

export default Player;
