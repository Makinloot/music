import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SpotifyContext } from "../context/SpotifyContext";
import noImg from "/no-img.png";
import TrackRowHeading from "../components/trackRow/TrackRowHeading";
import TrackRow from "../components/trackRow/TrackRow";
import { v4 as uuidv4 } from "uuid";
import { Button } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import Card from "../components/card/Card";
import { SearchArtists } from "../components/collection/SearchCollection";

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
  const [moreTracks, setMoreTracks] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState<number>(7.6);

  useEffect(() => {
    async function getArtistData(id: string) {
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
        console.log(fetchedArtist);
      } catch (error) {
        console.log("error fetching artist data: ", error);
      }
    }

    if (id) getArtistData(id);
    window.scrollTo(0, 0);
  }, [contextValues?.spotify, id]);

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

  return (
    <div className="Artist">
      <div className="Artist-header flex flex-row items-end justify-start">
        <img
          className="h-[300px] w-[300px] object-cover"
          src={artistData?.artist?.images[0].url || noImg}
          alt={artistData?.artist?.name}
        />
        <div className="ml-2 flex flex-col">
          <h2 className="text-5xl">{artistData?.artist?.name}</h2>
          <span className="mt-2">
            {artistData?.artist?.followers.total.toLocaleString()} Followers
          </span>
        </div>
      </div>
      <div className="Artist-top-tracks my-8">
        <h3 className="my-2 text-xl capitalize">Popular tracks</h3>
        <TrackRowHeading />
        {artistData?.topTracks?.tracks
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
          .slice(0, moreTracks ? 10 : 5)}
        <Button className="my-2" onClick={() => setMoreTracks(!moreTracks)}>
          {moreTracks ? "Show less" : "Show more"}
        </Button>
      </div>
      <div className="Artist-albums">
        <h3 className="my-2 text-xl capitalize">albums</h3>
        <Swiper
          slidesPerView={slidesPerView}
          spaceBetween={20}
          freeMode={true}
          modules={[FreeMode]}
          className="mySwiper"
        >
          {artistData?.albums &&
            artistData.albums.items.map((item) => {
              return (
                <SwiperSlide key={uuidv4()} className="py-2">
                  <Link to={`/album/${item.id}`}>
                    <Card
                      image={item.images[0].url}
                      name={item.name}
                      nameSecondary={item.artists[0].name}
                    />
                  </Link>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
      <div className="Artist-related-artists">
        <SearchArtists
          artists={artistData?.relatedArtists?.artists.slice(0, 8)}
        />
      </div>
    </div>
  );
};

export default Artist;
