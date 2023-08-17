import Editor from '@monaco-editor/react';
import React from 'react';

class ICodeEditor {
  value: any;
  language: string = 'json';
  onChange: any;
  shema: any;
}
const CodeEditor = (props: ICodeEditor) => {
  return (
    <Editor
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
  );
};
export default CodeEditor;
