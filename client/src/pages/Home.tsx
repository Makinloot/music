import { useEffect, useState } from "react";
import { SpotifyContext } from "../context/SpotifyContext";
import noImg from "/no-img.png";
import { v4 as uuidv4 } from "uuid";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import Card from "../components/card/Card";

const Home = () => {
  const contextValues = SpotifyContext();
  const [recentlyPlayed, setRecentlyPlayed] = useState<
    SpotifyApi.PlayHistoryObject[] | undefined
  >();
  const [seeds, setSeeds] = useState<{ seed_tracks: string[] | undefined }>();

  useEffect(() => {
    async function getSeeds() {
      try {
        const fetchedRecentlyPlayedTracks =
          await contextValues?.spotify.getMyRecentlyPlayedTracks();
        setRecentlyPlayed(fetchedRecentlyPlayedTracks?.items);

        const generatedSeeds = fetchedRecentlyPlayedTracks?.items
          .map((item) => item.track.id)
          .slice(0, 5);

        setSeeds({
          seed_tracks: generatedSeeds,
        });
      } catch (error) {
        console.log("error fetching seeds: ", error);
      }
    }
    getSeeds();
  }, [contextValues?.spotify]);

  return (
    <div className="Home">
      <h3 className="text-2xl md:text-4xl">
        Welcome back {contextValues?.currentUser?.display_name}
      </h3>
      <TopTracks />
      <RecentlyPlayed data={recentlyPlayed} />
      <Recommendations seeds={seeds} />
    </div>
  );
};

export default Home;

function TopTracks() {
  const contextValues = SpotifyContext();
  const [topTracks, setTopTracks] = useState<
    SpotifyApi.TrackObjectFull[] | undefined
  >();

  useEffect(() => {
    async function getTopTracks() {
      try {
        const fetchedTopTracks = await contextValues?.spotify.getMyTopTracks();
        setTopTracks(fetchedTopTracks?.items);
      } catch (error) {
        console.log("error fetching recently played tracks: ", error);
      }
    }

    getTopTracks();
  }, [contextValues?.spotify]);

  return (
    <div className="my-8">
      <h3 className="my-2 text-xl capitalize">your top tracks</h3>
      <div className="recently-played-container grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {topTracks &&
          topTracks
            .map((item) => (
              <div
                key={uuidv4()}
                className="flex items-center overflow-hidden rounded-md bg-gray-400/30"
              >
                <img
                  className="w-16 lg:w-24"
                  src={item.album.images[0].url || noImg}
                  alt={item.name}
                />
                <strong className="mx-2 truncate lg:text-lg">
                  {item.name}
                </strong>
              </div>
            ))
            .splice(0, 6)}
      </div>
    </div>
  );
}

function Recommendations({
  seeds,
}: {
  seeds: { seed_tracks: string[] | undefined } | undefined;
}) {
  const contextValues = SpotifyContext();
  const [recommendedTracks, setRecommendedTracks] = useState<
    SpotifyApi.RecommendationsFromSeedsResponse | undefined
  >();
  const [slidesPerView, setSlidesPerView] = useState<number>(7.6);

  useEffect(() => {
    async function getRecommendations(seeds: {
      seed_tracks: string[] | undefined;
    }) {
      try {
        const fetchedRecommendations =
          await contextValues?.spotify.getRecommendations(seeds);
        // setRecommendedTracks(fetchedRecommendations?.tracks);
        setRecommendedTracks(fetchedRecommendations);
      } catch (error) {
        console.log("error fetching recommendations: ", error);
      }
    }

    if (seeds) getRecommendations(seeds);
  }, [seeds, contextValues?.spotify]);

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
    <div>
      <h3 className="my-2 text-xl capitalize">recommended</h3>
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={20}
        freeMode={true}
        modules={[FreeMode]}
        className="mySwiper"
      >
        {recommendedTracks &&
          recommendedTracks.tracks.map((item) => {
            return (
              <SwiperSlide key={uuidv4()} className="py-2">
                <Card
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  image={item.album.images[0].url}
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

function RecentlyPlayed({
  data,
}: {
  data: SpotifyApi.PlayHistoryObject[] | undefined;
}) {
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

  return (
    <div>
      <h3 className="my-2 text-xl capitalize">recently played</h3>
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
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  image={item.track.album.images[0].url}
                  name={item.track.name}
                  nameSecondary={item.track.artists[0].name}
                />
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
}
