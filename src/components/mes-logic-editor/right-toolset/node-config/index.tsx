import FormRender from '@/components/form-render';
import FormRenderById from '@/components/form-render/render-by-form-id';
import { getFormJson } from '@/services/schemeSvc';
import { Cell } from '@antv/x6';
import { useEffect, useState } from 'react';

interface INodeEditorProps {
    editNode: Cell | undefined;
    onSubmit: any;
    isStatic?: boolean;
    configSchemaProvider?: (type: string) => Promise<Schema>;
}

export default (props: INodeEditorProps) => {
    const [formScheme, setFormScheme] = useState({ type: 'form' })
    const [configSchema, setConfigSchema] = useState('');
    const [formData, setFormData] = useState({})
    const onSubmit = (formData: any) => {
        props.editNode?.setAttrByPath('text/text', formData.name);
        const preConfig = props.editNode?.data.config;
        if (props.editNode) {
            console.log('update graph data', formData)
            props.editNode.setData({ ...props.editNode.data, config: { ...preConfig, ...formData } }, { overwrite: true })
        }
        // props.editNode.data.config = { ...preConfig, ...formData };
        console.log('submit---props.editNode.data.config');
        console.log(props.editNode?.data.config);
        props?.onSubmit();
    };
    // const getValuesFromNode = (editNode: any) => {
    //     if (editNode && editNode.data) {
    //         const config = editNode.data.config || {};
    //         let nodeAttr = editNode.attrs;
    //         config.name = nodeAttr?.text?.text;
    //         return config;
    //     } else return { name: '' };
    // };
    useEffect(() => {
        if (props.editNode && props.editNode.data) {
            let config = props.editNode.data.config || {};
            setConfigSchema(props.editNode.data.configSchema || config.type);

        }
    }, [props.editNode]);

    // useEffect(() => {
    //     getFormJson(configSchema).then((nodeConfigSchema) => {
    //         console.log('nodeConfigSchemaChange')
    //         console.log(nodeConfigSchema)
    //         setFormScheme(nodeConfigSchema)
    //     })
    // }, [configSchema])

    useEffect(() => {
        let config = props.editNode?.data.config || {};
        let formData = { ...config };
        let nodeAttr = props.editNode?.attrs;
        if (nodeAttr && nodeAttr.text && nodeAttr.text.text)
            formData.name = nodeAttr.text.text;
        setFormData(formData)
    }, [props.editNode?.data])
    return (
        <FormRenderById
            // config={formScheme}
            isStatic={props.isStatic}
            formId={configSchema}
            values={{ ...formData }}
            onSubmit={onSubmit}
        />
        // <FormRender
        //     config={formScheme}
        //     values={{ ...formData }}
        //     onSubmit={onSubmit}
        // />
    );
};
