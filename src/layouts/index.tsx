import { Link, Outlet } from 'umi';
import styles from './index.less';
import { ProLayout } from '@ant-design/pro-components';
import { Layout, Menu, MenuProps, theme } from 'antd';
import { useState } from 'react';
import { FileAddOutlined } from '@ant-design/icons';
const { Content, Header, Sider, Footer } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('业务编排', '1', <FileAddOutlined />, [
    getItem('新建', '3'),
    getItem('列表', '4'),
  ]),
];
export default function DefaultLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div className={styles.navs}>
      {/* <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout>
          <Content style={{ margin: '0 16px' }}> */}
            <Outlet />
          {/* </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
        </Layout>
      </Layout> */}
    </div>
  );
}
