import { Button, Tabs, TabsProps } from 'antd';
// import NodeData from './step-config';
import NodeData from './node-config';

interface IRightToolset {
  editNode: any;
  onSubmit: any;
  onClear: any;
  isStatic?: boolean;
  logs?: any[];
  jsTipMap?: Map<string, object>;
  isCollapsed: boolean,
}
function RightToolset(props: IRightToolset) {
  return (
    <div style={{ margin: 0, height: '95vh', overflowY: 'scroll' }}>
      <NodeData
        isStatic={props.isStatic}
        editNode={props.editNode}
        jsTipMap={props.jsTipMap}
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
