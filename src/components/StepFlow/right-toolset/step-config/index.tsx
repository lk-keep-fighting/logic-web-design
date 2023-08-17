import { Cell } from '@antv/x6';
import { useForm } from 'form-render';
import React, { useContext, useEffect, useState } from 'react';
import FormRender from '../../component/FormRender';
import { ConfigSchemaProvider } from '../../BizEditor/settings/DefaultFormExt';

class INodeEditorProps {
  editNode: Cell | undefined;
  onSubmit: any;
  configSchemaProvider?: (type: string) => any;
}

export default (props: INodeEditorProps) => {
  const form = useForm();
  const formSchemaProvider = props.configSchemaProvider || ConfigSchemaProvider;
  const onFinish = (formData: any) => {
    props.editNode?.setAttrByPath('text/text', formData.name);
    const preConfig = props.editNode?.data.config;
    if (props.editNode)
      props.editNode.data.config = { ...preConfig, ...formData };
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
  const [formSchema, setFormSchema] = useState({});
  useEffect(() => {
    if (props.editNode && props.editNode.data) {
      const config = props.editNode.data.config || {};
      let nodeConfigSchema = formSchemaProvider(
        props.editNode.data.configSchema || config.type,
      );
      const nodeAttr = props.editNode.attrs;
      config.name = nodeAttr?.text?.text;
      setFormSchema(nodeConfigSchema);
      form.setSchema(nodeConfigSchema);
      form.resetFields();
      form.setValues(config);
    }
  }, [props.editNode]);
  return (
    <FormRender
      form={form}
      onFinish={onFinish}
      schema={{
        type: 'object',
        properties: formSchema,
      }}
      onReset={() => {
        const initConfig = getValuesFromNode(props.editNode);
        form.setValues(initConfig);
        return;
      }}
      footer
    // footer={() => <div><Button type='primary' onClick={form.submit()}>提交</Button></div>}
    />
  );
};
