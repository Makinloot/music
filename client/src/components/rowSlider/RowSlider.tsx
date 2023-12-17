import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { Link } from "react-router-dom";
import Card from "../card/Card";
import { v4 as uuidv4 } from "uuid";
import RowSliderSkeleton from "./RowSliderSkeleton";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

interface RowSliderTypes {
  title: string;
  url?: string;
  playerHistoryObject?: SpotifyApi.PlayHistoryObject[];
  recommendationsFromSeeds?: SpotifyApi.RecommendationsFromSeedsResponse;
  albumsObjectSimplified?: SpotifyApi.AlbumObjectSimplified[];
  artistAlbumResponse?: SpotifyApi.ArtistsAlbumsResponse;
  loading: boolean;
}
const RowSlider: React.FC<RowSliderTypes> = ({
  title,
  url,
  playerHistoryObject,
  recommendationsFromSeeds,
  albumsObjectSimplified,
  artistAlbumResponse,
  loading,
}) => {
  const [slidesPerView, setSlidesPerView] = useState<number>(7.6);

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

  if (
    !playerHistoryObject &&
    !recommendationsFromSeeds &&
    !albumsObjectSimplified &&
    !artistAlbumResponse
  )
    return null;
  return loading ? (
    <RowSliderSkeleton slidesPerView={slidesPerView} />
  ) : (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="my-2 text-xl capitalize">{title}</h3>
        {url && <Link to={url}>See more</Link>}
      </div>
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={20}
        freeMode={true}
        modules={[FreeMode]}
        className="mySwiper"
      >
        {playerHistoryObject && historyObjectRow(playerHistoryObject)}
        {recommendationsFromSeeds &&
          recommendationsRow(recommendationsFromSeeds)}
        {albumsObjectSimplified && albumObjSimplified(albumsObjectSimplified)}
        {artistAlbumResponse && artistAlbumResp(artistAlbumResponse)}
      </Swiper>
    </div>
  );
};

// if data type is PlayerHistoryObject[]
function historyObjectRow(data: SpotifyApi.PlayHistoryObject[]) {
  return data?.map((item) => (
    <SwiperSlide key={uuidv4()} className="py-2">
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Link to={`/album/${item.track.album.id}`}>
        <Card
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          image={item.track.album.images[0].url}
          name={item.track.name}
          nameSecondary={item.track.artists[0].name}
        />
      </Link>
    </SwiperSlide>
  ));
}

// if data type is RecommendationsFromSeedsResponse
function recommendationsRow(data: SpotifyApi.RecommendationsFromSeedsResponse) {
  return data.tracks.map((item) => {
    return (
      <SwiperSlide key={uuidv4()} className="py-2">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <Link to={`/album/${item.album.id}`}>
          <Card
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            image={item.album.images[0].url}
            name={item.name}
            nameSecondary={item.artists[0].name}
          />
        </Link>
      </SwiperSlide>
    );
  });
}

// if data type is SpotifyApi.AlbumObjectSimplified[]
function albumObjSimplified(data: SpotifyApi.AlbumObjectSimplified[]) {
  return (
    data.length > 0 &&
    data.map((item) => {
      return (
        <SwiperSlide key={uuidv4()} className="py-2">
          <Link to={`/album/${item.id}`} onClick={() => window.scrollTo(0, 0)}>
            <Card
              image={item.images[0].url}
              name={item.name}
              nameSecondary={item.artists[0].name}
            />
          </Link>
        </SwiperSlide>
      );
    })
  );
}

// if data type is SpotifyApi.ArtistsAlbumsResponse
function artistAlbumResp(data: SpotifyApi.ArtistsAlbumsResponse) {
  return data.items.map((item) => {
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
  });
}

export default RowSlider;
