import { AppstoreOutlined, CodeOutlined } from '@ant-design/icons';
import { Graph } from '@antv/x6';
import { Tabs, TabsProps, Tooltip } from 'antd';
import { Logic } from '@/components/step-flow-core/lasl/meta-data';
import { InputJSONSchema } from 'amis-ui';
import { useContext } from 'react';
import { EditorContext } from '../x6-graph';
import FormRenderById from '@/components/form-render/render-by-form-id';
import JsonEditor from '../component/FormRender/ItemExt/JsonEditor';

interface ILeftToolProps {
  graph?: Graph;
  refStencil: any;
  logic?: Logic;
  onConfigChange: any;
}

function LeftTool(props: ILeftToolProps) {
  // const editorCtx = useContext(EditorContext);
  // const { logic } = editorCtx;
  const items: TabsProps['items'] = [
    {
      key: 'sharps-panel',
      label: <AppstoreOutlined style={{ fontSize: '10px', marginTop: 5 }} />,
      children: (
        <div
          ref={props.refStencil}
          style={{ margin: 0, height: '100vh', width: '100%' }}
        ></div>
      ),
    },
    // {
    //   key: 'logic',
    //   label: <CodeOutlined style={{ fontSize: '20px', marginTop: 10 }} />,
    //   children: (
    //     <div style={{ margin: 0, height: '100vh' }}>
    //       <Tooltip title="用于解析执行编排的逻辑。">
    //         <h3>Logic DSL</h3>
    //       </Tooltip>
    //       <JsonEditor
    //         onChange={null}
    //         shema={null}
    //         value={JSON.stringify(props.logic)}
    //       />
    //     </div>
    //   ),
    // },
  ];
  return (
    <Tabs
      tabPosition="left"
      style={{ margin: 0 }}
      items={items}
      tabBarStyle={{ width: 30, margin: 0 }}
    ></Tabs>
  );
}

export default LeftTool;
