import { Link, Outlet, history, useParams } from 'umi';
import styles from './index.less';
import { ProLayout } from '@ant-design/pro-components';
import { Affix, Button, Layout, Menu, MenuProps, Space, Typography, theme } from 'antd';
import { useEffect, useState } from 'react';
import { EditOutlined, FileAddOutlined } from '@ant-design/icons';
import { initApp } from '@/services/appSvr';
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
export default function DefaultLayout(props) {
  const [collapsed, setCollapsed] = useState(false);
  const [meuns, setMenus] = useState<MenuProps[]>([])
  const { pageId } = useParams('');
  const [title, setTitle] = useState('x');
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    initApp().then(res => {
      setMenus(res.menus);
      setTitle(res.title);
    })
  }, [])
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div className={styles.navs}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={meuns} onClick={(m) => {
            history.push(`/page/amis/${m.key}`)
          }} />
        </Sider>
        <Layout>
          {/* <Header style={{ backgroundColor: 'white', height: '50px' }}><Space><Button icon={<EditOutlined />}></Button></Space></Header> */}
          <Content style={{ margin: '10px 16px' }} ref={setContainer}>
            <Outlet />
            <Affix offsetBottom={2} target={() => container} style={{ position: 'absolute', right: 16 }}>
              <Link to={`/set/page/amis/${pageId}`} target='_blank' >{<EditOutlined />}</Link>
            </Affix>
          </Content>
          {/* <Footer style={{ textAlign: 'center' }}></Footer> */}
        </Layout>
      </Layout>
    </div>
  );
}
