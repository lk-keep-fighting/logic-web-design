import { Button, Tabs, TabsProps } from 'antd';
// import NodeData from './step-config';
import NodeData from './node-config';
import { Schema } from 'form-render';

interface IRightToolset {
  editNode: any;
  onSubmit: any;
  onClear: any;
  logs?: any[];
  isCollapsed: boolean,
  configSchemaProvider?: (type: string) => Promise<Schema>;
}
function RightToolset(props: IRightToolset) {
  return (
    <div style={{ margin: 0, height: '95vh', overflowY: 'scroll' }}>
      <NodeData
        logic={props.logic}
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
