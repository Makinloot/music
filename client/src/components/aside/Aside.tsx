import { useState, useEffect } from "react";
import { Button, Input, Layout, Menu } from "antd";
import { HomeOutlined, SearchOutlined, HeartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { SpotifyContext } from "../../context/SpotifyContext";
import AsideAlbums from "./AsideAlbums";
import AsidePlaylists from "./AsidePlaylists";
import AsideArtists from "./AsideArtists";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./Aside.css";
import useScreenWidth from "../../hooks/useScreenWidth";

const Aside = () => {
  const contextValues = SpotifyContext();
  const [selectedKey] = useState(localStorage.getItem("selectedKey") || "1");
  const [asideType, setAsideType] = useState("playlist");
  const [searchValue, setSearchValue] = useState("");
  const { Sider } = Layout;
  const smallScreen = useScreenWidth();

  // set search value to empty string if menu is collapsed/opened
  useEffect(() => {
    setSearchValue("");
  }, [contextValues?.collapsed]);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={contextValues?.collapsed}
      collapsedWidth={smallScreen ? 0 : 100}
      className="!fixed z-[1000] h-screen"
      style={{ backgroundColor: !contextValues?.darkMode ? "white" : "" }}
    >
      <div
        className={`${contextValues?.collapsed ? "h-[160px]" : "h-[260px]"}`}
      >
        {/* ASIDE MENU */}
        <Menu
          className="py-2"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          style={{
            backgroundColor: !contextValues?.darkMode ? "white" : "",
            color: !contextValues?.darkMode ? "black" : "",
          }}
        >
          <Menu.Item
            className={`${!contextValues?.darkMode ? "hover:!text-black" : ""}`}
            key="1"
            icon={<HomeOutlined />}
          >
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item
            className={`${!contextValues?.darkMode ? "hover:!text-black" : ""}`}
            key="2"
            icon={<SearchOutlined />}
          >
            <Link to="/search">Search</Link>
          </Menu.Item>
          <Menu.Item
            className={`${!contextValues?.darkMode ? "hover:!text-black" : ""}`}
            key="3"
            icon={<HeartOutlined />}
          >
            <Link to="/liked">Liked</Link>
          </Menu.Item>
        </Menu>

        <div className="px-1">
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
              allowClear
            />
          )}
        </div>
      </div>
      <div
        className={`Library custom-scrollbar relative overflow-scroll overflow-x-hidden ${
          contextValues?.collapsed
            ? "hide-scrollbar h-[calc(100%-160px)] px-[4px]"
            : "h-[calc(100%-260px)] px-[2px]"
        }`}
      >
        {/* MAPPED DATA */}
        <div className="pr-1">
          {/* <div className="my-4 h-[550px] overflow-scroll overflow-x-hidden pr-1"> */}
          {asideType === "playlist" ? (
            <AsidePlaylists searchValue={searchValue} />
          ) : asideType === "album" ? (
            <AsideAlbums searchValue={searchValue} />
          ) : (
            asideType === "artist" && <AsideArtists searchValue={searchValue} />
          )}
        </div>
      </div>
    </Sider>
  );
};

export default Aside;
