import { ClearOutlined } from '@ant-design/icons';
import { Button, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import LogBox from './log-box';

//react componet to show log info
const LogInfo = ({ data, onClear }) => {
  return (
    <div
      id="scrollableDiv"
      style={{
        overflow: 'auto',
        padding: '0 0px',
        height: '90vh',
        // border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
      <Button
        icon={<ClearOutlined />}
        onClick={() => {
          if (onClear) {
            onClear();
          }
        }}
      >
        清空日志
      </Button>
      <InfiniteScroll
        dataLength={data.length}
        next={() => {}}
        hasMore={false}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        // endMessage={<Divider plain>没有了</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          // style={{ minHeight: '100%' }}
          dataSource={data}
          renderItem={(item: any, i) => (
            <List.Item key={i}>
              <LogBox {...item} />
            </List.Item>
          )}
        />
      </InfiniteScroll>
      <Button
        icon={<ClearOutlined />}
        onClick={() => {
          if (onClear) {
            onClear();
          }
        }}
      >
        清空日志
      </Button>
    </div>
  );
};
export default LogInfo;
