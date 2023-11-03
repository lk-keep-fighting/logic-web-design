import { TypeAnnotationParser } from "@/components/step-flow-core/lasl/parser/type-annotation-parser";
import FormRender from "@/components/step-flow-editor/component/FormRender"
import { Modal, Tabs, message } from "antd"
import { useForm } from "form-render"
import { useCallback, useEffect, useState } from "react";
type RunLogicProps = {
    values: {
        params: any,
        envs: any,
    },
    onSubmit: (values: any) => void,
    open: boolean,
    setOpen: (open: boolean) => void,
    children: any
}


// 运行逻辑
const RunLogic = (props: RunLogicProps) => {
    const form = useForm();
    useEffect(() => {
        const { params, envs } = props.values;
        form.setValues({
            params: JSON.stringify(TypeAnnotationParser.getJsonByParams(params)),
            // returns: JSON.stringify(TypeAnnotationParser.getJsonByParams(returns)),
            envs: JSON.stringify(TypeAnnotationParser.getJsonByParams(envs)),
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

    return <span>
        {props.children}
        <Modal open={props.open ?? false}
            title='参数配置（通过json格式声明）'
            width={1000}
            onOk={() => {
                const values = form.getValues()
                let hasError = false;
                Object.keys(values).forEach(key => {
                    const item = values[key];
                    if (['params', 'envs'].indexOf(key) > -1 && !validateJsonString(item)) {
                        const field = key === 'params' ? '入参' : '环境变量'
                        message.error(`${field}json格式错误`)
                        hasError = true;
                        return false;
                    }
                });
                if (!hasError) {
                    if (props?.onSubmit)
                        props.onSubmit(values)
                    props?.setOpen(false)
                }
            }}
            onCancel={() => props?.setOpen(false)}
        >
            <FormRender
                form={form}
                schema={{
                    "type": "object",
                    "properties": {
                        params: {
                            title: '入参',
                            type: 'string',
                            widget: 'json',
                            props: {
                                height: 200,
                            },
                            extra: '编辑器中可通过 _par. 获取'
                        },
                        envs: {
                            title: '环境变量',
                            type: 'string',
                            widget: 'json',
                            props: {
                                height: 200,
                            },
                            extra: '编辑器中可通过 _env. 获取'
                        },
                        bizId: {
                            title: '业务标识',
                            type: 'string',
                            props: {
                            },
                            extra: '根据业务标识跟踪逻辑实例'
                        },
                    },
                    // "displayType": "row",
                    "column": 2,
                    // "maxWidth": "340px"
                }}
            />
        </Modal>
    </span >
}
export default RunLogic;