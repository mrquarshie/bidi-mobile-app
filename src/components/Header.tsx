import React from 'react';
import { BellFilled, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Menu, Avatar, Typography, Input } from 'antd';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Header: React.FC = () => {
  const userName = 'Doris Scott';
  const userEmail = 'doris.scott@example.com';
  const userRole = 'Admin';

  const notificationMenu = (
    <div className="w-80 bg-white shadow-lg rounded-lg p-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <Text strong>Notifications</Text>
        <Text type="secondary" className="text-xs cursor-pointer hover:text-blue-500">
          Mark all as read
        </Text>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
          <Avatar
            size={32}
            style={{ backgroundColor: '#e6f7ff' }}
            icon={<BellFilled style={{ color: '#1890ff' }} />}
          />
          <div>
            <Text className="text-sm">New Submission Received</Text>
            <Text type="secondary" className="text-xs block">
              A new onboarding submission from Jane Smith is pending review.
            </Text>
            <Text type="secondary" className="text-xs">5 minutes ago</Text>
          </div>
        </div>
        <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
          <Avatar
            size={32}
            style={{ backgroundColor: '#fff1f0' }}
            icon={<UserOutlined style={{ color: '#f5222d' }} />}
          />
          <div>
            <Text className="text-sm">Profile Update Required</Text>
            <Text type="secondary" className="text-xs block">
              Please update your details in your profile.
            </Text>
            <Text type="secondary" className="text-xs">1 hour ago</Text>
          </div>
        </div>
        <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
          <Avatar
            size={32}
            style={{ backgroundColor: '#f6ffed' }}
            icon={<SettingOutlined style={{ color: '#52c41a' }} />}
          />
          <div>
            <Text className="text-sm">System Maintenance</Text>
            <Text type="secondary" className="text-xs block">
              Scheduled maintenance on June 26, 2025, from 2 AM to 4 AM.
            </Text>
            <Text type="secondary" className="text-xs">Yesterday</Text>
          </div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <Text type="secondary" className="text-xs cursor-pointer hover:text-blue-500">
          View all notifications
        </Text>
      </div>
    </div>
  );

  const profileMenu = (
    <div className="w-64 bg-white shadow-lg rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        <Avatar size={40} icon={<UserOutlined />} />
        <div>
          <Text strong className="text-sm">
            {userName}
          </Text>
          <Text type="secondary" className="text-xs block">
            {userEmail}
          </Text>
          <Text type="secondary" className="text-xs capitalize">
            {userRole}
          </Text>
        </div>
      </div>
      <Menu selectable={false}>
        <Menu.Item key="logout" icon={<LogoutOutlined />}>
          Logout
        </Menu.Item>
      </Menu>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-[#EEFFF6] text-stone-600 font-semibold">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 max-w-7xl mx-auto pl-[260px] md:pl-[100px]">
        {/* Left Side: Search Bar */}
        <div className="sm:ml-16 lg:flex pl-35 items-center w-[350px]">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined className="text-stone-600" />}
            className="rounded-md !border-none"
          />
        </div>

        {/* Right Side: Profile, Name, Notifications */}
        <div className="flex items-center gap-3 sm:gap-5 lg:gap-7">
          <Dropdown overlay={profileMenu} trigger={['click']} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
              <UserOutlined className="text-base sm:text-lg" />
              <span className="hidden sm:inline text-sm">{userName}</span>
            </div>
          </Dropdown>
          <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
            <div className="cursor-pointer hover:bg-gray-100 p-1 rounded">
              <Badge
                count={5}
                offset={[0, 0]}
                className="flex items-center"
                style={{
                  fontSize: '10px',
                  height: '16px',
                  minWidth: '16px',
                  lineHeight: '16px',
                  padding: '0 4px',
                  backgroundColor: '#ff4d4f',
                  color: '#fff',
                }}
              >
                <BellFilled className="text-base sm:text-lg" />
              </Badge>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;