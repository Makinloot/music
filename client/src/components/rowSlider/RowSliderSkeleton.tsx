import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import loadingImg from "/loading-img.jpg";
import Skeleton from "react-loading-skeleton";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "react-loading-skeleton/dist/skeleton.css";
import "./RowSlider.css";

const RowSliderSkeleton: React.FC<{ slidesPerView: number }> = ({
  slidesPerView,
}) => {
  const fakeArray = Array.from({ length: 10 }, () => ({}));
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="movingBackground my-2 text-xl capitalize opacity-0">
          asd
        </div>
        <span className="opacity-0">See more</span>
      </div>
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={20}
        freeMode={true}
        modules={[FreeMode]}
        className="mySwiper"
      >
        {fakeArray.map(() => (
          <SwiperSlide key={uuidv4()} className="py-2">
            <div className="Card select-none rounded-md">
              <div className="Card-img relative rounded-md">
                <img
                  className="max-h-[215px] w-full max-w-[215px] rounded-md object-cover opacity-0"
                  src={loadingImg}
                />
                <Skeleton
                  className="absolute inset-0"
                  baseColor="#202020"
                  highlightColor="#444"
                />
              </div>
              <Skeleton
                className=""
                baseColor="#202020"
                highlightColor="#444"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RowSliderSkeleton;
