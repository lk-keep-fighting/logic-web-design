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
  if (key?.toString().length > 1)
    label = <Link to={key.toString()}>{label}</Link>
  else key = label?.toString();
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('原子业务资产', '', <FileAddOutlined />, [
    getItem('API清单', '/assets/api/list'),
    getItem('微服务Swagger', '/assets/swagger/list')
  ]),
  getItem('业务编排', '/assets/logic/list', <FileAddOutlined />),
  // getItem('swagger', '/assets/swagger/list', <FileAddOutlined />),
];
export default function DefaultLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div className={styles.navs}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout>
          <Content style={{ margin: '0 16px' }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center' }}></Footer>
        </Layout>
      </Layout>
    </div>
  );
}
