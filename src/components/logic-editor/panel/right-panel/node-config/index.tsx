import FormRenderById from '@/components/ui-render/form-render/render-by-form-id';
import { Cell } from '@antv/x6';
import { useEffect, useState } from 'react';

interface INodeEditorProps {
    editNode: Cell | undefined;
    onSubmit: any;
    isStatic?: boolean;
    jsTipMap?: Map<string, object>
}

export default (props: INodeEditorProps) => {
    const [configSchema, setConfigSchema] = useState('');
    const [formData, setFormData] = useState({})
    const onSubmit = (formData: any) => {
        props.editNode?.setAttrByPath('text/text', formData.name);
        const preConfig = props.editNode?.data.config;
        if (formData.type == 'switch-cases' && formData.caseItems) {
            formData.cases = formData.caseItems.map(i => i.value)
        }
        if (props.editNode) {
            console.log('update graph data', formData)
            props.editNode.setData({ ...props.editNode.data, config: { ...preConfig, ...formData } }, { overwrite: true })
        }
        console.log('submit---props.editNode.data.config');
        console.log(props.editNode?.data.config);
        props?.onSubmit();
    };
    useEffect(() => {
        if (props.editNode && props.editNode.data) {
            let config = props.editNode.data.config || {};
            setConfigSchema(props.editNode.data.configSchema || config.type);
        }
    }, [props.editNode]);

    useEffect(() => {
        if (props.editNode?.data) {
            let config = props.editNode?.data.config || {};
            let formData = { ...config };
            let nodeAttr = props.editNode?.attrs;
            if (nodeAttr && nodeAttr.text && nodeAttr.text.text)
                formData.name = nodeAttr.text.text;
            // if (formData.type == 'switch-cases' && formData.cases) {
            //     if (!formData.caseItems || formData.caseItems.length == 0)
            //         formData.caseItems = formData.cases.map(i => { return { value: i } })
            // }
            setFormData(formData)
        }
    }, [props.editNode?.data])
    return (
        <FormRenderById
            isStatic={props.isStatic}
            formId={configSchema}
            values={{ ...formData }}
            onSubmit={onSubmit}
            jsTipMap={props.jsTipMap}
        />
    );
};
