import FormRender from '@/components/form-render';
import { getFormJson } from '@/services/schemeSvc';
import { Cell } from '@antv/x6';
import { useEffect, useState } from 'react';

interface INodeEditorProps {
    editNode: Cell | undefined;
    onSubmit: any;
    configSchemaProvider?: (type: string) => Promise<Schema>;
}

export default (props: INodeEditorProps) => {
    const [formScheme, setFormScheme] = useState({ type: 'form' })
    const [formData, setFormData] = useState({})
    const onSubmit = (formData: any) => {
        props.editNode?.setAttrByPath('text/text', formData.name);
        const preConfig = props.editNode?.data.config;
        if (props.editNode) {
            console.log('update graph data', formData)
            props.editNode.setData({ config: { ...preConfig, ...formData } }, { overwrite: true })
        }
        // props.editNode.data.config = { ...preConfig, ...formData };
        console.log('submit---props.editNode.data.config');
        console.log(props.editNode?.data.config);
        let newData = { config: { ...preConfig, ...formData } };
        props?.onSubmit(newData);
    };
    const getValuesFromNode = (editNode: any) => {
        if (editNode && editNode.data) {
            const config = editNode.data.config || {};
            let nodeAttr = editNode.attrs;
            config.name = nodeAttr?.text?.text;
            return config;
        } else return { name: '' };
    };
    useEffect(() => {
        if (props.editNode && props.editNode.data) {
            let config = props.editNode.data.config || {};
            getFormJson(props.editNode.data.configSchema || config.type,).then((nodeConfigSchema) => {
                console.log('nodeConfigSchema')
                console.log(nodeConfigSchema)
                setFormScheme(nodeConfigSchema)
            })
        }
    }, [props.editNode]);
    useEffect(() => {
        let config = props.editNode?.data.config || {};
        let formData = { ...config };
        let nodeAttr = props.editNode?.attrs;
        if (nodeAttr && nodeAttr.text && nodeAttr.text.text)
            formData.name = nodeAttr.text.text;
        setFormData(formData)
    }, [formScheme])
    return (
        <FormRender
            config={formScheme}
            values={{ ...formData }}
            onSubmit={onSubmit}
        // onReset={() => {
        //     const initConfig = getValuesFromNode(props.editNode);
        //     form.setValues(initConfig);
        //     return;
        // }}
        // footer={props.onSubmit ? true : false}
        />
    );
};
