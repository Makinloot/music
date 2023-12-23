import { SpotifyContext } from "../../context/SpotifyContext";
import { IoPauseCircle, IoPlayCircle } from "react-icons/io5";

const PlayButtons = ({ uri, tracks }: { uri?: string; tracks?: string[] }) => {
  const contextValues = SpotifyContext();

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
            if (uri) {
              // contextValues?.setActiveUri(uri);
              contextValues?.setTrackUris([""]);
              contextValues?.setTrackUris([uri]);
              // contextValues?.setPlay(true);
            } else if (!uri && tracks) {
              contextValues?.setTrackUris([""]);
              contextValues?.setTrackUris(tracks);
              // contextValues?.setPlay(true);
            }
            contextValues?.setPlay(true);
          }}
        >
          <IoPlayCircle size={38} />
        </button>
      )}
    </div>
  );
};

export default PlayButtons;
