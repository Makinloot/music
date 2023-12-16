import { useParams } from "react-router-dom";
import { SpotifyContext } from "../context/SpotifyContext";
import { useEffect, useState } from "react";
import { SearchAlbums } from "../components/collection/SearchCollection";

const Discography = () => {
  const contextValues = SpotifyContext();
  const { id } = useParams();
  const [discography, setDiscography] = useState<
    SpotifyApi.AlbumObjectSimplified[] | undefined
  >();

  // TODO: fetch whole discography
  useEffect(() => {
    async function getDiscography(id: string) {
      try {
        const fetchedDiscography = await contextValues?.spotify.getArtistAlbums(
          id,
          {
            limit: 50,
          },
        );
        setDiscography(fetchedDiscography?.items);
      } catch (error) {
        console.log("error fetching discography: ", error);
      }
    }

    if (id) getDiscography(id);
  }, [contextValues?.spotify, id]);

  return (
    <div className="Discography">
      <SearchAlbums albums={discography} />
    </div>
  );
};

export default Discography;
