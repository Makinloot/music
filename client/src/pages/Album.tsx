import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SpotifyContext } from "../context/SpotifyContext";
import moment from "moment";
import TrackRowHeading from "../components/trackRow/TrackRowHeading";
import { v4 as uuidv4 } from "uuid";
import TrackRow from "../components/trackRow/TrackRow";
import RowSlider from "../components/rowSlider/RowSlider";
import TrackRowSkeleton from "../components/trackRow/TrackRowSkeleton";
import noImg from "/no-img.png";
import Skeleton from "react-loading-skeleton";

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
  const [albumsLoading, setAlbumsLoading] = useState(false);

  // fetch album by ID
  useEffect(() => {
    async function getAlbum(id: string) {
      setAlbumTracksLoading(true);
      setArtistLoading(true);
      try {
        const fetchedAlbum = await contextValues?.spotify.getAlbum(id);
        setAlbum(fetchedAlbum);
        setArtist(fetchedAlbum?.artists[0].id);
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
          limit: 20,
        });
        const filterAlbums = fetchedAlbums?.items.filter(
          (item) => item.album_group === "album" && item.id !== id,
        );
        setAlbums(filterAlbums);
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
        <AlbumHeaderSkeleton />
      ) : (
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
      )}
      <div className="my-4">
        <TrackRowHeading />
        {albumTracksLoading ? (
          <TrackRowSkeleton />
        ) : (
          album?.tracks?.items.map((item, index) => {
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

function AlbumHeaderSkeleton() {
  return (
    <div className="album-header flex items-end">
      <div className="relative">
        <img className="mr-2 max-w-[200px] opacity-0" src={noImg} />
        <Skeleton
          className="absolute inset-0"
          baseColor="#202020"
          highlightColor="#444"
        />
      </div>
      <Skeleton
        className="ml-2 h-7 w-60 max-w-full"
        baseColor="#202020"
        highlightColor="#444"
        count={2}
      />
    </div>
  );
}

export default Album;
