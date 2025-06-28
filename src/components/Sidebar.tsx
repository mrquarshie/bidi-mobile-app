import React, { useState } from 'react';
import { Layout, Menu, Button, Tooltip } from 'antd';
import { MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import './Sidebar.css';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

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
    },
  ];

  // Toggle sidebar collapse
  // const toggleCollapse = () => {
  //   setCollapsed(!collapsed);
  // };

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
        items={menuItems.map((item) => ({
          key: item.key,
            icon: (
          <div className="flex justify-center items-center">
            {item.key === '1' ? (
              item.icon
            ) : (
              <img
                src={item.key === '2' ? '/register-icon.svg' : '/registered-icon.svg'}
                alt={item.key === '2' ? 'Register OMC Icon' : 'Registered OMC Icon'}
                className="sidebar-icon larger-icon"
              />
            )}
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
        className="flex items-center gap-2 md:gap-3 logout-button px-4 py-2 rounded-[5px] border-[#a9a7a7] text-white bg-transparent hover:bg-[#064021f1] hover:text-white hover:border-[#a9a7a7]"
      >
        <LogoutOutlined className="sidebar-icon" />
        {!collapsed && (
          <span className="font-medium text-sm truncate">Logout</span>
        )}
      </Button>
    </Sider>
  );
};

export default Sidebar;