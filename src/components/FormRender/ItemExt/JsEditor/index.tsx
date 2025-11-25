import EditorByLoader from '../EditorByLoader';

class IJsEditor {
  value: any;
  onChange: any;
  shema: any;
}
// const JsEditor = (props: IJsonEditor) => {
//     return <Editor defaultValue={props.value}
//         defaultLanguage="javascript"
//         options={{
//             // lineNumbers: 'off',
//             minimap: {
//                 enabled: false
//             }
//         }} onChange={v => props?.onChange(v)} height={500} {...props} />
// }
const JsEditor = (props: IJsEditor) => {
  return <EditorByLoader {...props}
    language="javascript"
    // language="typescript"
  />;
};
export default JsEditor;
