import React from "react";
import { Layout, Button, theme, Dropdown, Space, MenuProps } from "antd";
import { motion } from "framer-motion";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BulbOutlined,
  BulbFilled,
} from "@ant-design/icons";
import { SpotifyContext } from "../../context/SpotifyContext";
import { Link } from "react-router-dom";

const Header: React.FC<{
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ collapsed, setCollapsed }) => {
  const contextValues = SpotifyContext();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  // dropdown menu items
  const items: MenuProps["items"] = [
    {
      label: <Link to="/">Account</Link>,
      key: "0",
    },
    {
      label: <Link to="/test">Profile</Link>,
      key: "1",
    },
    {
      label: <Link to="/test">Settings</Link>,
      key: "2",
    },
    {
      label: (
        <button
          onClick={() => {
            contextValues?.setDarkMode(!contextValues.darkMode);
          }}
        >
          Theme {contextValues?.darkMode ? <BulbFilled /> : <BulbOutlined />}
        </button>
      ),
      key: "3",
    },
    {
      type: "divider",
    },
    {
      label: (
        <a
          onClick={(e) => {
            e.preventDefault();
            window.localStorage.removeItem("token");
            location.reload();
          }}
        >
          Log out
        </a>
      ),
      key: "4",
    },
  ];

  return (
    <Layout.Header
      className="flex items-center justify-between p-0 pr-5"
      style={{ background: colorBgContainer }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
      <Dropdown
        className={`flex cursor-pointer select-none items-center rounded-full`}
        menu={{ items }}
        trigger={["click"]}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <button className="">
            <Space className="flex h-[35px] min-w-[80px] items-center justify-between rounded-full px-2 py-5 pr-3">
              <div>
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src="https://picsum.photos/200/300"
                />
              </div>
              <div>
                <strong className="text-lg">
                  {contextValues?.currentUser?.display_name}
                </strong>
              </div>
            </Space>
          </button>
        </motion.div>
      </Dropdown>
    </Layout.Header>
  );
};

export default Header;
