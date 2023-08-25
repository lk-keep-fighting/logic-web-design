import { Tabs, TabsProps } from 'antd';
import LogInfo from './debug-info';
import NodeData from './step-config';
import { Schema } from 'form-render';

interface IRightToolset {
  editNode: any;
  onSubmit: any;
  onClear: any;
  logs?: any[];
  configSchemaProvider?: (type: string) => Promise<Schema>;
}
function RightToolset(props: IRightToolset) {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '节点配置',
      children: (
        <div style={{ padding: 5 }}>
          <NodeData
            editNode={props.editNode}
            onSubmit={props.onSubmit}
            configSchemaProvider={props.configSchemaProvider}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: '运行日志',
      children: (
        <div style={{ padding: 5 }}>
          <LogInfo data={props.logs} onClear={props.onClear} />
        </div>
      ),
    },
  ];
  return (
    <Tabs
      style={{ margin: 0, height: '95vh', overflowY: 'scroll' }}
      items={items}
    ></Tabs>
  );
}

export default RightToolset;
