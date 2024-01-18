import { Button, Tabs, TabsProps } from 'antd';
// import NodeData from './step-config';
import NodeData from './node-config';
import { Schema } from 'form-render';

interface IRightToolset {
  editNode: any;
  onSubmit: any;
  onClear: any;
  isStatic?: boolean;
  logs?: any[];
  isCollapsed: boolean,
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
          // configSchemaProvider={props.configSchemaProvider}
          />
        </div>
      ),
    },
    // {
    //   key: '2',
    //   label: '运行日志',
    //   children: (
    //     <div style={{ padding: 5 }}>
    //       <LogInfo data={props.logs} onClear={props.onClear} />
    //     </div>
    //   ),
    // },
  ];
  return (
    <div style={{ margin: 0, height: '95vh', overflowY: 'scroll' }}>
      <NodeData
        isStatic={props.isStatic}
        editNode={props.editNode}
        onSubmit={props.onSubmit} />
      {props?.isCollapsed ? '' : <Button
        type="text"
        style={{ position: 'absolute', top: 10, right: 15, fontSize: 20, textAlign: 'center' }}
        onClick={() => {
          props?.onClose();
        }}
      >
        x
      </Button>}
    </div>
  );
}

export default RightToolset;
