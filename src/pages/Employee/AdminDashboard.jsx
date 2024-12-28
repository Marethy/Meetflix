import React, { useEffect, useState } from "react";
import { Layout, Menu, Breadcrumb, Input, Button, Spin, message } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  VideoCameraOutlined,
  ShoppingOutlined,
  ShopOutlined,
  DollarOutlined,
  PieChartOutlined,
  DesktopOutlined,
  TeamOutlined,
  FileOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import UserApi from "../../api/userApi";
import MovieApi from "../../api/movieApi";
import MovieList from "../../components/movie/MovieList";
import useFetchMovies from "../../hooks/useFetchMovies";
import UserManagement from "../../components/admin/User/UserManagement";
import TheaterManagement from "../../components/admin/Theater/TheaterManagement";
import ShowtimeManagement from "../../components/admin/Showtime/ShowtimeManagement";
import MovieManagement from "../../components/admin/Movie/MovieManagement";

import { TokenManager } from "../../api/apiClient";
import { useNavigate } from "react-router-dom";
import UserProfileButton from "../../components/UserProfileButton";

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const { trendingMovies, isLoading: isLoadingMovies } = useFetchMovies();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await TokenManager.getAccessToken();
        const userData = await UserApi.getAllUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        message.error("Failed to load user data");
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchMovies = async () => {
      try {
        await TokenManager.getAccessToken();
        await MovieApi.getMovies();
      } catch (error) {
        console.error("Error fetching movie data:", error);
        message.error("Failed to load movie data");
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchUsers();
    fetchMovies();
  }, []);

  const onCollapse = (collapsed) => setCollapsed(collapsed);

  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: "Home" },
    { key: "2", icon: <UserOutlined />, label: "User" },
    { key: "3", icon: <VideoCameraOutlined />, label: "Movies" },
    { key: "4", icon: <ShoppingOutlined />, label: "Products" },
    { key: "5", icon: <ShopOutlined />, label: "Theaters" },
    { key: "6", icon: <ClockCircleOutlined />, label: "Showtimes" },
    { key: "7", icon: <PieChartOutlined />, label: "Dashboard" },
    { key: "8", icon: <DesktopOutlined />, label: "Option 2" },
    { key: "9", icon: <DollarOutlined />, label: "Receipts" },
  ];

  // Cập nhật breadcrumb items
  const breadcrumbItems = [
    { key: '1', label: 'Dashboard' },
    {
      key: '2',
      label: selectedMenuItem === "5" ? "Theater"
            : selectedMenuItem === "3" ? "Movies"
            : selectedMenuItem === "2" ? "User"
            : selectedMenuItem === "6" ? "Showtimes"
            : "Home",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          {menuItems.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={() => setSelectedMenuItem(item.key)}
            >
              {item.label}
            </Menu.Item>
          ))}
          <Menu.SubMenu key="sub1" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="10">Team 1</Menu.Item>
            <Menu.Item key="11">Team 2</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="12" icon={<FileOutlined />}>Files</Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <UserProfileButton />
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb items={breadcrumbItems} style={{ margin: "16px 0" }} />

          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {selectedMenuItem === "2" && <UserManagement />}
            {selectedMenuItem === "3" && <MovieManagement/>}
            {selectedMenuItem === "5" && <TheaterManagement />}
            {selectedMenuItem === "6" && <ShowtimeManagement />}
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>Ticket Booking ©2024 Created by Khiem and Khanh</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
