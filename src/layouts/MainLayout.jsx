import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
const { Sider } = Layout;

const items = [
  {
    key: '1',
    icon: <UserOutlined />,
    label: 'nav 1',
  },
  {
    key: '2',
    icon: <VideoCameraOutlined />,
    label: 'nav 2',
  },
  {
    key: '3',
    icon: <UploadOutlined />,
    label: 'nav 3',
  },
];

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ minHeight: '100vh' }}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={items}
        />
      </Sider>
      <Layout>
        <Outlet />
        <footer>footer</footer>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
