import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Layout, theme } from "antd";
import { SpotifyContext } from "../../context/SpotifyContext";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "../header/Header";
import Liked from "../../pages/Liked";
import Aside from "../aside/Aside";
import Search from "../../pages/Search";
import Home from "../../pages/Home";
import Genre from "../../pages/Genre";
import Album from "../../pages/Album";

const Main: React.FC = () => {
  const contextValues = SpotifyContext();

  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { Content } = Layout;

  useEffect(() => {
    // save the selected key based on the current location
    const path = location.pathname;
    if (path === "/") localStorage.setItem("selectedKey", "1");
    else if (path === "/search") localStorage.setItem("selectedKey", "2");
    else if (path === "/liked") localStorage.setItem("selectedKey", "3");
  }, [location]);

  return (
    <Layout
      className={`container min-h-[100vh] ${
        contextValues?.darkMode ? "text-white" : "text-black"
      }`}
    >
      <Aside />
      <Layout>
        <motion.div
          initial={{
            marginLeft: contextValues?.collapsed ? 100 : 200,
          }}
          animate={{
            marginLeft: contextValues?.collapsed ? 100 : 200,
          }}
          // className={contextValues?.collapsed ? "ml-[100px]" : "ml-[200px]"}
        >
          {/* ----------- HEADER ----------- */}
          <Header />
          {/* ----------- CONTENT ----------- */}
          <Content
            style={{
              margin: "24px 16px",
              padding: "8px",
              minHeight: 280,
              background: colorBgContainer,
            }}
            className="relative"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/liked" element={<Liked />} />
              <Route path="/genre/:id" element={<Genre />} />
              <Route path="/album/:id" element={<Album />} />
            </Routes>
          </Content>
        </motion.div>
      </Layout>
    </Layout>
  );
};

export default Main;
