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
import defaultUser from "/user.png";
import useScreenWidth from "../../hooks/useScreenWidth";

const Header = () => {
  const contextValues = SpotifyContext();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const smallScreen = useScreenWidth();
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
            if (contextValues?.darkMode === true)
              localStorage.setItem("theme", "light");
            else localStorage.setItem("theme", "dark");
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
      className="relative z-[20000] flex items-center justify-between p-0 pr-5"
      style={{ background: colorBgContainer }}
    >
      {/* close-open menu button */}
      <Button
        type="text"
        id="close-menu-btn"
        onClick={() => contextValues?.setCollapsed(!contextValues?.collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
          marginLeft: smallScreen && !contextValues?.collapsed ? "200px" : 10,
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {contextValues?.collapsed ? (
          <MenuUnfoldOutlined className="pointer-events-none select-none" />
        ) : (
          <MenuFoldOutlined className="pointer-events-none select-none" />
        )}
      </Button>

      <Dropdown
        className={`flex ${
          smallScreen && !contextValues?.collapsed && "hidden"
        } cursor-pointer select-none items-center rounded-full`}
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
                  src={
                    (contextValues?.currentUser?.images &&
                      contextValues.currentUser.images[0].url) ||
                    defaultUser
                  }
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
