import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SpotifyContext } from "../context/SpotifyContext";
import noImg from "/no-img.png";
import TrackRowHeading from "../components/trackRow/TrackRowHeading";
import TrackRow from "../components/trackRow/TrackRow";
import { v4 as uuidv4 } from "uuid";
import { Button } from "antd";
import RowSlider from "../components/rowSlider/RowSlider";
import TrackRowSkeleton from "../components/trackRow/TrackRowSkeleton";
import CollectionHeaderSkeleton from "../components/collectionHeader/CollectionHeaderSkeleton";
import CollectionHeader from "../components/collectionHeader/CollectionHeader";

interface ArtistDataTypes {
  artist: SpotifyApi.SingleArtistResponse | undefined;
  topTracks: SpotifyApi.ArtistsTopTracksResponse | undefined;
  albums: SpotifyApi.ArtistsAlbumsResponse | undefined;
  relatedArtists: SpotifyApi.ArtistsRelatedArtistsResponse | undefined;
}

const Artist = () => {
  const contextValues = SpotifyContext();
  const { id } = useParams();
  const [artistData, setArtistData] = useState<ArtistDataTypes | undefined>();
  const [artistDataLoading, setArtistDataLoading] = useState({
    artist: false,
    topTracks: false,
    albums: false,
  });
  const [moreTracks, setMoreTracks] = useState(false);

  useEffect(() => {
    async function getArtistData(id: string) {
      setArtistDataLoading({
        artist: true,
        albums: true,
        topTracks: true,
      });
      try {
        const fetchedArtist = await contextValues?.spotify.getArtist(id);
        const fetchedArtistTopTracks =
          await contextValues?.spotify.getArtistTopTracks(id, "US", {
            limit: 10,
          });
        const fetchedArtistAlbums =
          await contextValues?.spotify.getArtistAlbums(id);
        const fetchedRelatedArtists =
          await contextValues?.spotify.getArtistRelatedArtists(id);
        setArtistData({
          artist: fetchedArtist,
          topTracks: fetchedArtistTopTracks,
          albums: fetchedArtistAlbums,
          relatedArtists: fetchedRelatedArtists,
        });
        setArtistDataLoading({
          artist: false,
          albums: false,
          topTracks: false,
        });
      } catch (error) {
        console.log("error fetching artist data: ", error);
      }
    }

    if (id) getArtistData(id);
    window.scrollTo(0, 0);
  }, [contextValues?.spotify, id]);

  return (
    <div className="Artist">
      {artistDataLoading.artist ? (
        <CollectionHeaderSkeleton />
      ) : (
        <CollectionHeader
          img={artistData?.artist?.images[0].url || noImg}
          title={artistData?.artist?.name}
          followers={artistData?.artist?.followers.total.toLocaleString()}
        />
      )}

      <div className="Artist-top-tracks my-8">
        <h3 className="my-2 text-xl capitalize">Popular tracks</h3>
        <TrackRowHeading />
        {artistDataLoading.topTracks ? (
          <TrackRowSkeleton count={5} />
        ) : (
          artistData?.topTracks?.tracks
            .map((item, index) => (
              <TrackRow
                key={uuidv4()}
                index={index}
                albumName={item.album.name}
                artistName={item.artists[0].name}
                name={item.name}
                duration={item.duration_ms}
                image={item.album.images[0].url}
              />
            ))
            .slice(0, moreTracks ? 10 : 5)
        )}
        <Button className="my-2" onClick={() => setMoreTracks(!moreTracks)}>
          {moreTracks ? "Show less" : "Show more"}
        </Button>
      </div>

      <RowSlider
        title="albums"
        url={`/discography/${artistData?.artist?.id}`}
        artistAlbumResponse={artistData?.albums}
        loading={artistDataLoading.albums}
      />
    </div>
  );
};

export default Artist;
