import { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

const Player = ({ accessToken }: { accessToken: string }) => {
  // const { trackUri } = useSpotify()
  const [play, setPlay] = useState(false);

  // useEffect(() => {
  //   setPlay(true)
  // }, [trackUri])

  return (
    <div className="player fixed bottom-0 w-full">
      <SpotifyPlayer
        token={localStorage.getItem("token") || ""}
        callback={(state) => {
          if (!state.isPlaying) setPlay(false);
        }}
        play={play}
        // uris={trackUri ? [trackUri] : []}
        uris={"spotify:track:0WQiDwKJclirSYG9v5tayI"}
      />
      <div className="player-menu flex-row">{/* <Navbar bottom /> */}</div>
    </div>
  );
};

export default Player;
