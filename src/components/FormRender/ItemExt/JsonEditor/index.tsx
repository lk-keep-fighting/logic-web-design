import EditorByLoader from '../EditorByLoader';

class IJsonEditor {
  value: any;
  onChange: any;
  shema: any;
}
const JsonEditor = (props: IJsonEditor) => {
  return <EditorByLoader {...props} language="json" />;
};
export default JsonEditor;
