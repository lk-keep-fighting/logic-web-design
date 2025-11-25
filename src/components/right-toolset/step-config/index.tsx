import { Cell } from '@antv/x6';
import { Schema, useForm } from 'form-render';
import { useEffect } from 'react';
import FormRender from '@/components/form-render';

interface INodeEditorProps {
  editNode: Cell | undefined;
  onSubmit: any;
  configSchemaProvider: (type: string) => Promise<Schema>;
}

export default (props: INodeEditorProps) => {
  const form = useForm();
  const formSchemaProvider = props.configSchemaProvider;
  const onFinish = (formData: any) => {
    props.editNode?.setAttrByPath('text/text', formData.name);
    const preConfig = props.editNode?.data.config;
    if (props.editNode) {
      props.editNode.setData({ config: { ...preConfig, ...formData } })
    }
    // props.editNode.data.config = { ...preConfig, ...formData };
    console.log('submit---props.editNode.data.config');
    console.log(props.editNode?.data.config);
    props?.onSubmit();
  };
  const getValuesFromNode = (editNode: any) => {
    if (editNode && editNode.data) {
      const config = editNode.data.config || {};
      const nodeAttr = editNode.attrs;
      config.name = nodeAttr?.text?.text;
      return config;
    } else return { name: '' };
  };
  // const [formSchema, setFormSchema] = useState({});
  useEffect(() => {
    if (props.editNode && props.editNode.data) {
      const config = props.editNode.data.config || {};
      formSchemaProvider(
        props.editNode.data.configSchema || config.type,
      ).then((nodeConfigSchema) => {
        const nodeAttr = props.editNode.attrs;
        config.name = nodeAttr?.text?.text;
        console.log('nodeConfigSchema')
        console.log(nodeConfigSchema)
        // setFormSchema(nodeConfigSchema);
        form.setSchema(nodeConfigSchema, true);
        form.resetFields();
        form.setValues(config);
      })
    }
  }, [props.editNode, props.editNode?.data]);
  return (
    <div>
      <FormRender
        form={form}
        onFinish={onFinish}
        // schema={formSchema}
        onReset={() => {
          const initConfig = getValuesFromNode(props.editNode);
          form.setValues(initConfig);
          return;
        }}
        // watch={{
        //   '#': (allValues, changedValues) => { // '#': () => {} 等同于 onValuesChange
        //     console.log('表单 allValues：', allValues);
        //     console.log('表单 changedValues：', changedValues);
        //   }
        // }}
        footer={props.onSubmit ? true : false}
      // footer={() => <div><Button type='primary' onClick={form.submit()}>提交</Button></div>}
      />
      {/* <Button onClick={() => {
        const sc = form.getSchema();
        navigator.clipboard.writeText(JSON.stringify(sc, null, 2));
      }}>copy</Button> */}
    </div>
  );
};
