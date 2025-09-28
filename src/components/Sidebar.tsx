import React, { useState } from 'react';
import { Layout, Menu, Button, Tooltip, Modal } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const { Sider } = Layout;
// const apiBase = import.meta.env.VITE_BASE_URL;

const Sidebar: React.FC = () => {
   const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

 const navigate = useNavigate();
  // Navigation menu items data with custom SVG icons
  const menuItems = [
    {
      key: '1',
      icon: (
        <img
          src="/dashboard-icon.svg"
          alt="Dashboard Icon"
          className="sidebar-icon"
        />
      ),
      label: 'Dashboard',
      isActive: true,
       path: '/',
    },
    {
      key: '2',
      icon: (
        <img
          src="/register-icon.svg"
          alt="Register OMC Icon"
          className="sidebar-icon"
        />
      ),
      label: 'Register OMC',
      isActive: false,
      path: '/register-omc',
    },
    {
      key: '3',
      icon: (
        <img
          src="/registered-icon.svg"
          alt="Registered OMC Icon"
          className="sidebar-icon"
        />
      ),
      label: 'Registered OMC',
      isActive: false,
      path: '/registered-omc',
    },
    {
      key: '4',
      icon: (
        <img
          src="/stations.svg"
          alt="Stations Icon"
          className="sidebar-icon"
        />
      ),
      label: 'Stations',
      isActive: false,
      path: '/stations',
    },
    {
      key: '5',
      icon: (
        <img
          src="/attendants.svg"
          alt="Attendants Icon"
          className="sidebar-icon"
        />
      ),
      label: 'Fuel Attendants',
      isActive: false,
      path: '/attendants',
    },
        {
      key: '7',
      icon: (
        <img
          src="/membership.svg"
          alt="Membership Icon"
          className="sidebar-icon"
        />
      ),
      label: 'Membership',
      isActive: false,
      path: '/',
    },
        {
      key: '8',
      icon: (
        <img
          src="/register.svg"
          alt="Register Icon"
          className="sidebar-icon"
        />
      ),
      label: 'Register Card',
      isActive: false,
      path: '/',
    },
  ];

  // Toggle sidebar collapse
  // const toggleCollapse = () => {
  //   setCollapsed(!collapsed);
  // };

   // Handle menu item click
  const handleMenuClick = ({ key }: { key: string }) => {
    const item = menuItems.find((menuItem) => menuItem.key === key);
    if (item?.path) {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    console.log('handleLogout triggered');
    setIsLogoutModalVisible(true);
  };

  const handleModalOk = () => {
    console.log('Modal confirmed, calling logout');
    logout();
    setIsLogoutModalVisible(false);
  };

  const handleModalCancel = () => {
    console.log('Modal cancelled');
    setIsLogoutModalVisible(false);
  };

  return (
    <Sider
      width={240}
      collapsedWidth={80}
      collapsible
      collapsed={collapsed}
      trigger={null}
      className="sidebar-container bg-[#064021] overflow-hidden z-40"
      breakpoint="lg"
      onBreakpoint={(broken) => setCollapsed(broken)}
    >
      {/* Header with Logo */}
      <header className="flex flex-col items-center pt-4 px-4">
        <img
          src="/bidi-logo-white.svg"
          alt="Bidi Logo"
          className={`w-[120px] h-[80px] mb-2 ${collapsed ? 'w-[80px] h-[80px] mx-auto' : ''}`}
        />
         <div className="w-full border-b border-white/20 mb-4"></div>
        <div className="flex justify-between items-center w-full"></div>
        {/* {!collapsed && (
          <div className="w-full border-b border-white/20 mb-4"></div>
        )} */}
        {/* <div className="flex justify-between items-center w-full">
          <Button
            type="text"
            icon={<MenuOutlined className="text-lg" style={{ color: '#FFFFFF' }} />}
            onClick={toggleCollapse}
            className="text-white"
          />
        </div> */}
      </header>

      {/* Navigation Menu */}
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        onClick={handleMenuClick}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: (
            <div className="flex justify-center items-center">
              {item.icon}
            </div>
          ),
          label: (
            <Tooltip title={item.label} placement="right">
              <span className="font-medium text-white text-sm truncate">
                {item.label}
              </span>
            </Tooltip>
          ),
        }))}
        className="bg-transparent border-0 nav-menu"
      />

      {/* Logout Button */}
      <Button
        type="default"
        onClick={handleLogout}
        className="flex items-center gap-2 md:gap-3 logout-button px-4 py-2 rounded-[5px] border-[#a9a7a7] text-white bg-transparent hover:bg-[#064021f1] hover:text-white hover:border-[#a9a7a7]"
      >
        <LogoutOutlined className="sidebar-icon" />
        {!collapsed && (
          <span className="font-medium text-sm truncate">Logout</span>
        )}
      </Button>
      <Modal
        title="Confirm Logout"
        open={isLogoutModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Logout"
        cancelText="Cancel"
        okButtonProps={{ danger: true,
    style: { 
        backgroundColor: '#dc2626',
        border: 'none'
    } 
}}
        cancelButtonProps={{ className: 'text-white !border-0 !bg-gray-600' }}
        zIndex={10000}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </Sider>
  );
};

export default Sidebar;