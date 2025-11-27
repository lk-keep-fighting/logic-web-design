import FormRenderById from "@/components/ui-render/form-render/render-by-form-id";
import { TypeAnnotationParser } from "@/components/lib/dsl/parser/type-annotation-parser";
import { Button, Modal, Tabs, message } from "antd"
import { useForm } from "form-render"
import { useCallback, useEffect, useState } from "react";
type RunLogicProps = {
    values: {
        params: any,
    },
    onSubmit: (values: any, model: string) => void,
    open: boolean,
    setOpen: (open: boolean) => void,
    children: any
}


// 运行逻辑
const RunLogic = (props: RunLogicProps) => {
    const form = useForm();
    useEffect(() => {
        const { params } = props.values;
        form.setValues({
            params: JSON.stringify(TypeAnnotationParser.getJsonByParams(params)),
            // returns: JSON.stringify(TypeAnnotationParser.getJsonByParams(returns)),
        })
    }, [props.values])
    const validateJsonString = useCallback((jsonString: string) => {
        try {
            JSON.parse(jsonString)
            return true;
        } catch (e) {
            return false;
        }
    }, []);
    function handleSubmit(values) {
        let hasError = false;
        Object.keys(values).forEach(key => {
            const item = values[key];
            if (['params', 'headers'].indexOf(key) > -1 && !validateJsonString(item)) {
                const field = key === 'params' ? '入参' : '请求头'
                message.error(`${field}json格式错误`)
                hasError = true;
                return false;
            }
        });
        if (!hasError) {
            if (props?.onSubmit)
                props.onSubmit(values, values.debugType)
            props?.setOpen(false)
        }
    }

    return <span>
        {props.children}
        <Modal open={props.open ?? false}
            title='调试参数配置'
            width={1000}
            // footer={
            //     <>
            //         <Button type='primary' onClick={() => {
            //             handleSubmit('');
            //         }}>运行</Button>
            //         <Button type='primary' onClick={() => {
            //             handleSubmit('bizStepByStep');
            //         }}>bizStep模式</Button>
            //         <Button onClick={() => props?.setOpen(false)}>取消</Button>
            //     </>
            // }
            footer={false}
            onCancel={() => props?.setOpen(false)}
        >
            <FormRenderById formId="logic-debug-input" onSubmit={handleSubmit} />
        </Modal>
    </span >
}
export default RunLogic;