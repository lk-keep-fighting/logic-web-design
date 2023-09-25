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
        {/* <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}> */}
        <Header title='业务编排工具' style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}>
          <img
            style={{ marginRight: '20px', width: '60x', height: '60px' }}
            src='/logo.png' />
          <div style={{ color: 'ButtonFace', fontSize: '18px', fontFamily: '黑体', fontWeight: 'bolder' }}>{title}</div>
          <Menu mode="horizontal" theme="dark" defaultSelectedKeys={['1']} items={meuns}
            style={{ marginLeft: '100px', color: 'whitesmoke', fontSize: '16px', fontFamily: '黑体' }}
            onClick={(m) => {
              history.push(`/page/amis/${m.key}`)
            }} />
          {/* </Sider> */}
        </Header>
        <Layout>
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
