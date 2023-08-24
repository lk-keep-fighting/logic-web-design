import { Editor, useMonaco } from '@monaco-editor/react';
import { EditorContext } from '../../../../x6-graph/index';
import { Button } from 'antd';
import Modal from 'antd/es/modal/Modal';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { buildVarExtarLibByObj } from '../../../MonacoHelper';
import './index.css'
import { ArrowsAltOutlined } from '@ant-design/icons';
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

class ICodeEditor {
  value: any;
  language: string | undefined;
  onChange: any;
  shema: any;
  height?: number;
}

const EditorByLoader = (props: ICodeEditor) => {
  const editorCtx = useContext(EditorContext);
  const monaco = useMonaco();
  useEffect(() => {
    const flowVar = editorCtx.flowVar;
    const vars = buildVarExtarLibByObj('_var', editorCtx.flowVar)
    const input = buildVarExtarLibByObj('_input', editorCtx.flowInput)
    const returnp = buildVarExtarLibByObj('_return', editorCtx.flowReturn)
    const env = buildVarExtarLibByObj('_env', editorCtx.flowEnv)

    monaco?.languages.typescript.javascriptDefaults.addExtraLib(vars, 'var.ts');
    monaco?.languages.typescript.javascriptDefaults.addExtraLib(input, 'input.ts');
    monaco?.languages.typescript.javascriptDefaults.addExtraLib(returnp, 'return.ts');
    monaco?.languages.typescript.javascriptDefaults.addExtraLib(env, 'env.ts');
    return () => {
      console.log('effect dispose')
      // @ts-ignore
      monaco?.current?.dispose();
    }
    // }
  }, [editorCtx.flowInput, editorCtx.flowVar, editorCtx.flowReturn])

  const [full, setFull] = useState(false);
  return (
    <div style={{ width: '100%' }}>
      {full ? (
        <Modal
          title="js编辑器"
          centered
          width={1200}
          bodyStyle={{ height: '80vh' }}
          open={full}
          footer={null}
          onCancel={() => setFull(false)}
        >
          <Editor
            theme="vs-dark"
            defaultValue={props.value}
            defaultLanguage={props.language}
            options={{
              // lineNumbers: 'off',
              minimap: {
                enabled: false,
              },
            }}
            {...props}
            height={'100%'}
          />
        </Modal>
      ) : (
        <div>
          <Editor
            className='editorByLoader'
            theme="vs-dark"
            defaultValue={props.value}
            defaultLanguage={props.language}
            options={{
              // lineNumbers: 'off',
              minimap: {
                enabled: false,
              },
            }}
            height={500}
            {...props}
          />
          <Button
            size="small"
            type="text"
            icon={<ArrowsAltOutlined />}
            style={{ position: 'absolute', top: 0, right: 0, margin: '10px', color: 'whitesmoke' }}
            onClick={() => setFull(true)}
          >
          </Button>
        </div>
      )}
    </div>
  );
};
export default React.memo(EditorByLoader);
