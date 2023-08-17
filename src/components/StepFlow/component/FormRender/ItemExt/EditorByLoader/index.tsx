import { Editor, useMonaco } from '@monaco-editor/react';
import { EditorContext } from '../../../../x6-graph/index';
import { Button } from 'antd';
import Modal from 'antd/es/modal/Modal';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { buildVarExtarLibByObj } from '../../../MonacoHelper';
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
  console.log('render--editorCtx', editorCtx)
  const monaco = useMonaco();
  useEffect(() => {
    const flowVar = editorCtx.flowVar;
    const vars = buildVarExtarLibByObj('_var', editorCtx.flowVar)
    console.log('var lib', vars)
    const input = buildVarExtarLibByObj('_input', editorCtx.flowInput)
    console.log('input lib', input)
    const returnp = buildVarExtarLibByObj('_return', editorCtx.flowReturn)
    console.log('return lib', returnp)

    monaco?.languages.typescript.javascriptDefaults.addExtraLib(vars, 'var.ts');
    monaco?.languages.typescript.javascriptDefaults.addExtraLib(input, 'input.ts');
    monaco?.languages.typescript.javascriptDefaults.addExtraLib(returnp, 'return.ts');
    // editorCtx.jsProvider?.dispose();
    // if (monaco.languages.registerCompletionItemProvider == undefined || !monaco.languages.registerCompletionItemProvider['javascript']) {
    // 在组件渲染时注册自定义的提示项
    // editorCtx.jsProvider = monaco?.languages.registerCompletionItemProvider('javascript', {
    //   triggerCharacters: [' ', '.'],
    //   // @ts-ignore
    //   provideCompletionItems: (model, position) => {
    //     const text = model.getValue()
    //     console.log('text')
    //     console.log(text)
    //     console.log('editorCtx')
    //     console.log(editorCtx)
    //     const wordInfo = model.getWordUntilPosition(position);
    //     const wordRange = new monaco.Range(
    //       position.lineNumber,
    //       wordInfo.startColumn,
    //       position.lineNumber,
    //       wordInfo.endColumn
    //     );
    //     const word = model.getValueInRange(wordRange);
    //     console.log('word', word)
    //     // 构建自定义的提示项（CompletionItems）
    //     if (text.endsWith('_ctx.')) {
    //       const flowVar = editorCtx.flowVar;
    //       if (flowVar) {
    //         const suggestions = flowVar.forEach((value, key) => {
    //           let kind = monaco.languages.CompletionItemKind.Variable;
    //           // if (typeof value === 'function') {
    //           //   kind = monaco.languages.CompletionItemKind.Function;
    //           // } else if (typeof value === 'string') {
    //           //   kind = monaco.languages.CompletionItemKind.Property;
    //           // } else if (Array.isArray(value)) {
    //           //   kind = monaco.languages.CompletionItemKind.Field;
    //           // }
    //           // 添加其他类型的逻辑判断...
    //           return {
    //             label: key,
    //             kind: kind,
    //             insertText: key,
    //           };
    //         });
    //         return { suggestions: suggestions };
    //       }
    //     } else if (text.endsWith('_input.')) {
    //       const flowInput = editorCtx.flowInput;
    //       if (flowInput) {
    //         const suggestions = flowInput.forEach((value, key) => {
    //           let kind = monaco.languages.CompletionItemKind.Variable;
    //           return {
    //             label: key,
    //             kind: kind,
    //             insertText: key,
    //           };
    //         });
    //         return { suggestions: suggestions };
    //       }
    //     }
    //     else if (word == '_') {
    //       return {
    //         suggestions: [
    //           {
    //             label: '_ctx',
    //             kind: monaco.languages.CompletionItemKind.Variable,
    //             insertText: '_ctx',
    //           },
    //           {
    //             label: '_input',
    //             kind: monaco.languages.CompletionItemKind.Variable,
    //             insertText: '_input',
    //           },
    //           // 添加其他自定义的提示项...
    //         ]
    //       }
    //     } else
    //       return undefined;
    //   }
    // })
    // monaco.languages.registerCompletionItemProvider['javascript'] = true;
    return () => {
      console.log('effect dispose')
      // monaco.languages.registerCompletionItemProvider['javascript'] = false;
      // @ts-ignore
      monaco?.current?.dispose();
      // provider?.dispose();
    }
    // }
  }, [editorCtx.flowInput, editorCtx.flowVar, editorCtx.flowReturn])

  const [full, setFull] = useState(false);
  return (
    <div style={{ width: '100%' }}>
      <Button
        size="small"
        type="dashed"
        style={{ float: 'right' }}
        onClick={() => setFull(true)}
      >
        放大编辑
      </Button>
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
          height={500}
          {...props}
        />
      )}
    </div>
  );
};
export default React.memo(EditorByLoader);
