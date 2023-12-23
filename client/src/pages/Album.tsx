import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SpotifyContext } from "../context/SpotifyContext";
import TrackRowHeading from "../components/trackRow/TrackRowHeading";
import { v4 as uuidv4 } from "uuid";
import TrackRow from "../components/trackRow/TrackRow";
import RowSlider from "../components/rowSlider/RowSlider";
import TrackRowSkeleton from "../components/trackRow/TrackRowSkeleton";
import CollectionHeader from "../components/collectionHeader/CollectionHeader";
import CollectionHeaderSkeleton from "../components/collectionHeader/CollectionHeaderSkeleton";
import PlayButtons from "../components/playButtons/PlayButtons";
import sumTotalTracksDuration from "../utils/sumTotalTracksDuration";

const Album = () => {
  const contextValues = SpotifyContext();
  const { id } = useParams();
  const [album, setAlbum] = useState<
    SpotifyApi.SingleAlbumResponse | undefined
  >();
  const [albumTracksLoading, setAlbumTracksLoading] = useState(false);
  const [artist, setArtist] = useState<string | undefined>("");
  const [artistLoading, setArtistLoading] = useState(false);
  const [albums, setAlbums] = useState<
    SpotifyApi.AlbumObjectSimplified[] | undefined
  >();
  const [albumTracksUris, setAlbumTracksUris] = useState([""]);
  const [albumsLoading, setAlbumsLoading] = useState(false);

  // fetch album by ID
  useEffect(() => {
    async function getAlbum(id: string) {
      setAlbumTracksLoading(true);
      setArtistLoading(true);
      try {
        const fetchedAlbum = await contextValues?.spotify.getAlbum(id);
        const filterUris = fetchedAlbum!.tracks.items.map((track) => track.uri);
        setAlbum(fetchedAlbum);
        setArtist(fetchedAlbum?.artists[0].id);
        setAlbumTracksUris(filterUris);
        setAlbumTracksLoading(false);
        setArtistLoading(false);
      } catch (error) {
        console.log("error fetching album: ", error);
      }
    }
    if (id) getAlbum(id);
  }, [contextValues?.spotify, id]);

  // get more albums by same artist
  useEffect(() => {
    async function getAlbumsByArtist(id: string) {
      setAlbumsLoading(true);
      try {
        const fetchedAlbums = await contextValues?.spotify.getArtistAlbums(id, {
          limit: 10,
        });
        setAlbums(fetchedAlbums?.items);
        setAlbumsLoading(false);
      } catch (error) {
        console.log("error fetching albums by artist: ", error);
      }
    }

    if (artist) getAlbumsByArtist(artist);
  }, [artist, contextValues?.spotify, id]);

  return (
    <div className="Album">
      {artistLoading ? (
        <CollectionHeaderSkeleton />
      ) : (
        <CollectionHeader
          img={album?.images[0].url}
          title={album?.name}
          artist={album?.artists[0].name}
          releaseDate={album?.release_date}
          totalTracks={album?.tracks.total}
          totalTracksDuration={sumTotalTracksDuration(
            undefined,
            album?.tracks.items,
          )}
        />
      )}
      {!albumTracksLoading && albumTracksUris.length > 0 && (
        <div className="mt-4">
          <PlayButtons uri={album?.uri || ""} tracks={albumTracksUris} />
        </div>
      )}
      <div className="my-4">
        <TrackRowHeading />
        {albumTracksLoading ? (
          <TrackRowSkeleton />
        ) : (
          album?.tracks?.items.map((item, index) => {
            const { name, duration_ms, artists, uri } = item;
            return (
              <TrackRow
                key={uuidv4()}
                index={index}
                albumName={album.name}
                artistName={artists[0].name}
                duration={duration_ms}
                name={name}
                uri={[uri]}
                artistId={artists[0].id}
                albumId={album.id}
              />
            );
          })
        )}
      </div>
      <RowSlider
        title="albums"
        url={`/discography/${artist}`}
        albumsObjectSimplified={albums}
        loading={albumsLoading}
      />
    </div>
  );
};

export default Album;
