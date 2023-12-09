import React, { useEffect } from "react";

import { Layout, theme } from "antd";
import { SpotifyContext } from "../../context/SpotifyContext";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "../header/Header";
import Liked from "../../pages/Liked";
import Aside from "../aside/Aside";
import Search from "../../pages/Search";

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
            <Route path="/" element={<div>home</div>} />
            <Route path="/search" element={<Search />} />
            <Route path="/liked" element={<Liked />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Main;
