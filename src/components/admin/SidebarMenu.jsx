import React from 'react';
import { Menu } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  VideoCameraOutlined,
  ShoppingOutlined,
  ShopOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const SidebarMenu = ({ selectedMenuItem, setSelectedMenuItem }) => {
  const menuItems = [
    { key: '1', icon: <UserOutlined />, label: 'User', onClick: () => setSelectedMenuItem('1') },
    { key: '2', icon: <VideoCameraOutlined />, label: 'Movies', onClick: () => setSelectedMenuItem('2') },
    { key: '3', icon: <DesktopOutlined />, label: 'Showtimes', onClick: () => setSelectedMenuItem('3') },
    { key: '4', icon: <ShopOutlined />, label: 'Projection Rooms', onClick: () => setSelectedMenuItem('4') },
    { key: '5', icon: <ShoppingOutlined />, label: 'Theaters', onClick: () => setSelectedMenuItem('5') },
    { key: '6', icon: <FileOutlined />, label: 'Messages', onClick: () => setSelectedMenuItem('6') },
  ];

  return (
    <Menu theme="dark" defaultSelectedKeys={[selectedMenuItem]} mode="inline" items={menuItems} />
  );
};

export default SidebarMenu;