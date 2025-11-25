import { Editor, useMonaco } from '@monaco-editor/react';
import { Button } from 'antd';
import Modal from 'antd/es/modal/Modal';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import './index.css'
import { ArrowsAltOutlined } from '@ant-design/icons';

class ICodeEditor {
  value: any;
  language?: string = 'json';
  onChange?: any;
  height?: number;
}

const CodeEditor = (props: ICodeEditor) => {
  const monaco = useMonaco();
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
            onMount={(editorIns) => {
              editorIns.getAction('editor.action.formatDocument')?.run();//自动格式化代码
              editorIns.setValue(editorIns.getValue());
            }}
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
export default React.memo(CodeEditor);
