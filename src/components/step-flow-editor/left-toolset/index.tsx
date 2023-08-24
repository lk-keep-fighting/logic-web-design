import { AppstoreOutlined, CodeOutlined } from '@ant-design/icons';
import { Graph } from '@antv/x6';
import Editor from '@monaco-editor/react';

import { Tabs, TabsProps, Tooltip } from 'antd';
import { StepFlow } from '../../step-flow-core/types';

interface ILeftToolProps {
  graph?: Graph;
  refStencil: any;
  stepFlow?: StepFlow;
  onConfigChange: any;
}
function LeftTool(props: ILeftToolProps) {
  const items: TabsProps['items'] = [
    {
      key: 'sharps-panel',
      label: <AppstoreOutlined style={{ fontSize: '20px', marginTop: 10 }} />,
      children: (
        <div
          ref={props.refStencil}
          style={{ margin: 0, height: '100vh', width: '100%' }}
        ></div>
      ),
    },
    {
      key: 'stepflow',
      label: <CodeOutlined style={{ fontSize: '20px', marginTop: 10 }} />,
      children: (
        <div style={{ margin: 0, height: '100vh' }}>
          <Tooltip title="用于解析执行编排的逻辑。">
            <h3>Stepflow DSL</h3>
          </Tooltip>
          <Editor
            defaultLanguage="json"
            // width={200}
            options={{
              lineNumbers: 'off',
              lineDecorationsWidth: 0,
              minimap: {
                enabled: false,
              },
            }}
            value={JSON.stringify(props.stepFlow)}
            onChange={props.onConfigChange}
          />
        </div>
      ),
    },
  ];
  return (
    <Tabs
      tabPosition="left"
      style={{ margin: 0 }}
      items={items}
      tabBarStyle={{ width: 50, margin: 0 }}
    ></Tabs>
  );
}

export default LeftTool;
