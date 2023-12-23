import { useEffect, useState } from "react";
import { SpotifyContext } from "../../context/SpotifyContext";
import { IoPauseCircle, IoPlayCircle, IoShuffle } from "react-icons/io5";

const PlayButtons = ({
  uri,
  tracks,
  noShuffle,
}: {
  uri?: string;
  tracks?: string[];
  noShuffle?: boolean;
}) => {
  const contextValues = SpotifyContext();
  const [shuffledTracks, setShuffledTracks] = useState([""]);

  // shuffle tracks
  useEffect(() => {
    const shuffledUris = tracks
      ? [...tracks].sort(() => Math.random() - 0.5)
      : [];
    setShuffledTracks(shuffledUris);
  }, [contextValues?.shuffle, tracks, contextValues?.trackUris]);

  // check if tracks equal to trackUris
  const areArraysEqual = (
    array1: string[] | undefined,
    array2: string[] | undefined,
  ) => {
    if (array1 && array2) {
      const sortedArray1 = array1.slice().sort();
      const sortedArray2 = array2.slice().sort();

      return JSON.stringify(sortedArray1) === JSON.stringify(sortedArray2);
    }
    return false;
  };

  return (
    <div className="flex items-center gap-1">
      {(contextValues?.play && uri == contextValues?.trackUris[0]) ||
      areArraysEqual(tracks, contextValues?.trackUris) ? (
        <button
          onClick={() => {
            contextValues?.setPlay(false);
            contextValues?.setActiveUri("");
          }}
        >
          <IoPauseCircle size={38} />
        </button>
      ) : (
        <button
          onClick={() => {
            if (uri && !contextValues?.shuffle) {
              // contextValues?.setActiveUri(uri);
              contextValues?.setTrackUris([uri]);
              // contextValues?.setPlay(true);
            } else if (shuffledTracks && contextValues?.shuffle) {
              contextValues?.setTrackUris(shuffledTracks);
              // contextValues?.setPlay(true);
            } else if (!uri && tracks) {
              contextValues?.setTrackUris(tracks);
              // contextValues?.setPlay(true);
            }
            contextValues?.setPlay(true);
          }}
        >
          <IoPlayCircle size={38} />
        </button>
      )}
      {contextValues?.shuffle ? (
        <button
          onClick={() => {
            localStorage.setItem("shuffle", "false");
            contextValues.setShuffle(false);
          }}
        >
          <IoShuffle size={35} color="green" />
        </button>
      ) : (
        !noShuffle && (
          <button
            onClick={() => {
              localStorage.setItem("shuffle", "true");
              contextValues?.setShuffle(true);
              contextValues?.setTrackUris(shuffledTracks);
              contextValues?.setPlay(true);
            }}
          >
            <IoShuffle size={35} />
          </button>
        )
      )}
    </div>
  );
};

export default PlayButtons;
