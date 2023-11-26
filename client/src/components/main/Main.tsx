import React, { useState } from "react";
import { HomeOutlined, SearchOutlined, HeartOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { SpotifyContext } from "../../context/SpotifyContext";
import { Routes, Route, Link } from "react-router-dom";
import Header from "../header/Header";
import Liked from "../../pages/Liked";

const Main: React.FC = () => {
  const contextValues = SpotifyContext();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { Sider, Content } = Layout;

  return (
    <Layout
      className={`container min-h-[100vh] ${
        contextValues?.darkMode ? "text-white" : "text-black"
      }`}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="relative"
      >
        <div className="demo-logo-vertical" />
        <Menu
          // for sticky menu
          // className="sticky top-0 w-full"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<SearchOutlined />}>
            <Link to="/test">Search</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<HeartOutlined />}>
            <Link to="/liked">Liked</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        {/* ----------- HEADER ----------- */}
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        {/* ----------- CONTENT ----------- */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Routes>
            <Route path="/" element={<div>home</div>} />
            <Route
              path="/test"
              element={
                <div>
                  <p>div</p>
                </div>
              }
            />
            <Route path="/liked" element={<Liked />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Main;
