import React from "react";
import { motion } from "framer-motion";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { Link } from "react-router-dom";
import logo from "/logo.png";
import "./Header.css";

// HEADER DROPDOWN ITEMS
const items: MenuProps["items"] = [
  {
    label: <Link to="/">account</Link>,
    key: "0",
  },
  {
    label: <Link to="/test">profile</Link>,
    key: "1",
  },
  {
    label: <Link to="/test">settings</Link>,
    key: "2",
  },
];

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -450 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, type: "just" }}
      className="bg-grayRegular"
    >
      <div className="container">
        <div className="Header-wrapper flex h-20 items-center justify-between !py-12">
          {/* HEADER LOGO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="Header-logo flex h-full w-[150px] items-center justify-center"
          >
            <Link to={"/"}>
              <img className="w-full" src={logo} alt="logo" />
            </Link>
          </motion.div>
          {/* PROFILE DROPDOWN */}
          <Dropdown
            className="cursor-pointer select-none"
            menu={{ items }}
            trigger={["click"]}
            overlayClassName={"Header-profile-dropdown"}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <button className="inline-block">
                <Space className="bg-graySecondary flex min-w-[80px] justify-between rounded-full py-1 pl-1 pr-4">
                  <div>
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src="https://picsum.photos/200/300"
                    />
                  </div>
                  <strong className="text-lg">Seed</strong>
                </Space>
              </button>
            </motion.div>
          </Dropdown>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
