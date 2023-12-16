import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SpotifyContext } from "../context/SpotifyContext";
import moment from "moment";
import TrackRowHeading from "../components/trackRow/TrackRowHeading";
import { v4 as uuidv4 } from "uuid";
import TrackRow from "../components/trackRow/TrackRow";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import Card from "../components/card/Card";

const Album = () => {
  const contextValues = SpotifyContext();
  const { id } = useParams();
  const [album, setAlbum] = useState<
    SpotifyApi.SingleAlbumResponse | undefined
  >();
  const [artist, setArtist] = useState<string | undefined>("");

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
      <MoreAlbumsByArtist artist={artist} currentAlbum={id} />
    </div>
  );
};

function MoreAlbumsByArtist({
  artist,
  currentAlbum,
}: {
  artist: string | undefined;
  currentAlbum: string | undefined;
}) {
  const contextValues = SpotifyContext();
  const [slidesPerView, setSlidesPerView] = useState<number>(7.6);
  const [albums, setAlbums] = useState<{
    albums: SpotifyApi.AlbumObjectSimplified[] | undefined;
    singles: SpotifyApi.AlbumObjectSimplified[] | undefined;
  }>();

  useEffect(() => {
    async function getAlbumsByArtist(id: string) {
      try {
        const fetchedAlbums = await contextValues?.spotify.getArtistAlbums(id, {
          limit: 50,
        });
        const filterAlbums = fetchedAlbums?.items.filter(
          (item) => item.album_group === "album" && item.id !== currentAlbum,
        );
        const filterSingles = fetchedAlbums?.items.filter(
          (item) => item.album_group === "single",
        );
        setAlbums({
          albums: filterAlbums,
          singles: filterSingles,
        });
      } catch (error) {
        console.log("error fetching albums by artist: ", error);
      }
    }

    if (artist) getAlbumsByArtist(artist);
  }, [artist, contextValues?.spotify]);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      // Update slidesPerView based on screen width
      if (screenWidth >= 1500) {
        setSlidesPerView(7.6);
      } else if (screenWidth >= 1024) {
        setSlidesPerView(5.6);
      } else if (screenWidth >= 768) {
        setSlidesPerView(4);
      } else if (screenWidth >= 480) {
        setSlidesPerView(3.3);
      } else {
        setSlidesPerView(2.2);
      }
    };

    // Call handleResize when the component mounts
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function AlbumRow({
    name,
    data,
  }: {
    name: string;
    data: SpotifyApi.AlbumObjectSimplified[] | undefined;
  }) {
    return (
      <div className="my-12">
        <h3 className="my-2 text-xl capitalize">{name}</h3>
        <Swiper
          slidesPerView={slidesPerView}
          spaceBetween={20}
          freeMode={true}
          modules={[FreeMode]}
          className="mySwiper"
        >
          {data &&
            data.map((item) => {
              return (
                <SwiperSlide key={uuidv4()} className="py-2">
                  <Card
                    image={item.images[0].url}
                    name={item.name}
                    nameSecondary={item.artists[0].name}
                  />
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    );
  }

  return (
    <div>
      {albums?.albums && albums.albums.length > 0 && (
        <AlbumRow name={"Albums"} data={albums?.albums} />
      )}
      {albums?.singles && albums.singles.length > 0 && (
        <AlbumRow name={"Singles"} data={albums?.singles} />
      )}
    </div>
  );
}

export default Album;
