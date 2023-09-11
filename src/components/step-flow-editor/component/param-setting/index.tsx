import { TypeAnnotationParser } from "@/components/step-flow-core/lasl/parser/type-annotation-parser";
import FormRender from "@/components/step-flow-editor/component/FormRender"
import { Modal, Tabs, message } from "antd"
import { useForm } from "form-render"
import { useCallback, useEffect, useState } from "react";
const ParamSetting = (props) => {
    const form = useForm();
    useEffect(() => {
        const { params, variables, envs, returns } = props.values;
        form.setValues({
            params: JSON.stringify(TypeAnnotationParser.getJsonByParams(params)),
            variables: JSON.stringify(TypeAnnotationParser.getJsonByParams(variables)),
            returns: JSON.stringify(TypeAnnotationParser.getJsonByParams(returns)),
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
                    if (!validateJsonString(item)) {
                        const field = key === 'params' ? '入参' : key === 'variables' ? '局部变量' : key === 'returns' ? '返回参数' : '环境变量'
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
                            title: '入参声明',
                            type: 'string',
                            widget: 'json',
                            props: {
                                height: 200,
                            },
                            extra: '编辑器中可通过 _par. 获取'
                        },
                        returns: {
                            title: '返回参数声明',
                            type: 'string',
                            widget: 'json',
                            props: {
                                height: 200,
                            },
                            extra: '编辑器中可通过 _ret. 获取并赋值'
                        },
                        variables: {
                            title: '局部变量声明',
                            type: 'string',
                            widget: 'json',
                            props: {
                                height: 200,
                            },
                            extra: '编辑器中可通过 _var. 获取'
                        },
                        envs: {
                            title: '环境变量声明',
                            type: 'string',
                            widget: 'json',
                            props: {
                                height: 200,
                            },
                            extra: '编辑器中可通过 _env. 获取'
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
export default ParamSetting;