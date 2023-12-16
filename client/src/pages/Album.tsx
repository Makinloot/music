import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SpotifyContext } from "../context/SpotifyContext";
import moment from "moment";
import TrackRowHeading from "../components/trackRow/TrackRowHeading";
import { v4 as uuidv4 } from "uuid";
import TrackRow from "../components/trackRow/TrackRow";
import RowSlider from "../components/rowSlider/RowSlider";

const Album = () => {
  const contextValues = SpotifyContext();
  const { id } = useParams();
  const [album, setAlbum] = useState<
    SpotifyApi.SingleAlbumResponse | undefined
  >();
  const [artist, setArtist] = useState<string | undefined>("");
  const [albums, setAlbums] = useState<
    SpotifyApi.AlbumObjectSimplified[] | undefined
  >();

  useEffect(() => {
    async function getAlbum(id: string) {
      try {
        const fetchedAlbum = await contextValues?.spotify.getAlbum(id);
        setAlbum(fetchedAlbum);
        setArtist(fetchedAlbum?.artists[0].id);
      } catch (error) {
        console.log("error fetching album: ", error);
      }
    }
    if (id) getAlbum(id);
  }, [contextValues?.spotify, id]);

  useEffect(() => {
    async function getAlbumsByArtist(id: string) {
      try {
        const fetchedAlbums = await contextValues?.spotify.getArtistAlbums(id, {
          limit: 20,
        });
        const filterAlbums = fetchedAlbums?.items.filter(
          (item) => item.album_group === "album" && item.id !== id,
        );
        setAlbums(filterAlbums);
      } catch (error) {
        console.log("error fetching albums by artist: ", error);
      }
    }

    if (artist) getAlbumsByArtist(artist);
  }, [artist, contextValues?.spotify, id]);

  return (
    <div className="Album">
      <div className="album-header flex items-end">
        <img
          className="mr-2 max-w-[200px]"
          src={album?.images[0].url}
          alt={album?.name}
        />
        <div>
          <h2 className="mb-2 text-4xl">{album?.name}</h2>
          <div className="flex items-center justify-start gap-1">
            <h3>{album?.artists[0]?.name}</h3>•
            <span>{moment(album?.release_date).format("YYYY")}</span>•
            <span>{album?.tracks.total} songs</span>•
            {/* display duration of album */}
            <span>
              {moment
                .utc(
                  album?.tracks?.items?.reduce(
                    (total, track) => total + track.duration_ms,
                    0,
                  ),
                )
                .format(
                  moment
                    .duration(
                      album?.tracks?.items?.reduce(
                        (total, track) => total + track.duration_ms,
                        0,
                      ),
                    )
                    .hours() >= 1
                    ? "h [hours], m [minutes], s [seconds]"
                    : "m [minutes], s [seconds]",
                )}
            </span>
          </div>
        </div>
      </div>
      <div className="my-4">
        <TrackRowHeading />
        {album?.tracks?.items.map((item, index) => {
          const { name, duration_ms, artists } = item;
          return (
            <TrackRow
              key={uuidv4()}
              index={index}
              albumName={album.name}
              artistName={artists[0].name}
              duration={duration_ms}
              name={name}
            />
          );
        })}
      </div>
      <RowSlider
        title="albums"
        url={`/discography/${artist}`}
        albumsObjectSimplified={albums}
      />
    </div>
  );
};

export default Album;
