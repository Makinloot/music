import { useState, useEffect } from "react";
import { Button, Input, Layout, Menu } from "antd";
import { HomeOutlined, SearchOutlined, HeartOutlined } from "@ant-design/icons";
import { IoLibraryOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { SpotifyContext } from "../../context/SpotifyContext";
import AsideAlbums from "./AsideAlbums";
import AsidePlaylists from "./AsidePlaylists";
import AsideArtists from "./AsideArtists";

const Aside = () => {
  const contextValues = SpotifyContext();
  const [selectedKey] = useState(localStorage.getItem("selectedKey") || "1");
  const [asideType, setAsideType] = useState("playlist");
  const [searchValue, setSearchValue] = useState("");
  const { Sider } = Layout;

  // set search value to empty string if menu is collapsed/opened
  useEffect(() => {
    setSearchValue("");
  }, [contextValues?.collapsed]);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={contextValues?.collapsed}
      className="sider mb-[90px] overflow-scroll overflow-x-hidden"
      collapsedWidth={100}
    >
      {/* ASIDE MENU */}
      <Menu
        className="py-2"
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[selectedKey]}
      >
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<SearchOutlined />}>
          <Link to="/search">Search</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<HeartOutlined />}>
          <Link to="/liked">Liked</Link>
        </Menu.Item>
      </Menu>
      <div
        className={`Library my-6  ${
          contextValues?.collapsed ? "px-[4px]" : "px-[2px]"
        }`}
      >
        <button
          className={`flex h-12 w-full cursor-pointer items-center ${
            !contextValues?.collapsed
              ? "ml-[25px] justify-start"
              : "justify-center"
          }`}
          onClick={() => contextValues?.setCollapsed(!contextValues.collapsed)}
        >
          <IoLibraryOutline />
          {!contextValues?.collapsed && <span className="ml-3">Library</span>}
        </button>

        {/* ASIDE DATA TYPE BUTTONS */}
        {!contextValues?.collapsed && (
          <div className="Library-types py-4">
            <Swiper
              slidesPerView={1.6}
              spaceBetween={0}
              freeMode={true}
              modules={[FreeMode]}
              className="mySwiper"
            >
              <SwiperSlide>
                <Button
                  className="px-8"
                  danger={asideType === "playlist" && true}
                  onClick={() => {
                    setSearchValue("");
                    setAsideType("playlist");
                  }}
                >
                  Playlists
                </Button>
              </SwiperSlide>
              <SwiperSlide>
                <Button
                  className="px-8"
                  danger={asideType === "album" && true}
                  onClick={() => {
                    setSearchValue("");
                    setAsideType("album");
                  }}
                >
                  Albums
                </Button>
              </SwiperSlide>
              <SwiperSlide>
                <Button
                  className="px-8"
                  danger={asideType === "artist" && true}
                  onClick={() => {
                    setSearchValue("");
                    setAsideType("artist");
                  }}
                >
                  Artists
                </Button>
              </SwiperSlide>
            </Swiper>
          </div>
        )}

        {/* SEARCH INPUT */}
        {!contextValues?.collapsed && (
          <Input
            className="w-full"
            placeholder="Search in your library..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        )}

        {/* MAPPED DATA */}
        {asideType === "playlist" ? (
          <AsidePlaylists searchValue={searchValue} />
        ) : asideType === "album" ? (
          <AsideAlbums searchValue={searchValue} />
        ) : (
          asideType === "artist" && <AsideArtists searchValue={searchValue} />
        )}
      </div>
    </Sider>
  );
};

export default Aside;
