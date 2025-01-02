import React, { useRef } from "react";
import { Menu, Dropdown, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const UserProfileButton = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const dropdownRef = useRef(null);

  const handleMenuClick = ({ key }) => {
    if (key === "profile") {
      message.info("Redirecting to profile...");
      navigate("user/profile");
    } else if (key === "logout") {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      message.success("Logged out successfully.");
      navigate("/login");
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick} style={{ backgroundColor: "black", color: "white" }}>
      <Menu.Item key="profile" icon={<UserOutlined />} style={{ backgroundColor: "black", color: "white" }}>
        Your Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} style={{ backgroundColor: "black", color: "white" }}>
        Log Out
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} getPopupContainer={() => dropdownRef.current}>
      <div ref={dropdownRef} style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "white" }}>
        <p style={{ margin: "0 10px", color: "white" }}>Hello, {username}</p>
        <UserOutlined style={{ fontSize: "24px", paddingRight: "10px", color: "white" }} />
      </div>
    </Dropdown>
  );
};

export default UserProfileButton;
