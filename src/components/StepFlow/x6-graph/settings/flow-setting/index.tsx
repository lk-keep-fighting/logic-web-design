import FormRender from "@/components/StepFlow/component/FormRender"
import { Modal, Tabs, message } from "antd"
import { useForm } from "form-render"
import { useCallback, useEffect, useState } from "react";
const FlowSetting = (props) => {
    const form = useForm();
    useEffect(() => {
        form.setValues(props.values)
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
            title='参数配置'
            width={1000}
            onOk={() => {
                const values = form.getValues()
                let hasError = false;
                Object.keys(values).forEach(key => {
                    const item = values[key];
                    if (!validateJsonString(item)) {
                        const field = key === 'input' ? '入参' : key === 'var' ? '全局变量' : '返回参数'
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
                        input: {
                            title: '入参json',
                            type: 'string',
                            widget: 'json',
                            props: {
                                height: 200,
                            },
                            extra: '编辑器中可通过 _input. 获取'
                        },
                        return: {
                            title: '返回参数json',
                            type: 'string',
                            widget: 'json',
                            props: {
                                height: 200,
                            },
                            extra: '编辑器中可通过 _return. 获取并赋值'
                        },
                        var: {
                            title: '局部变量json',
                            type: 'string',
                            widget: 'json',
                            props: {
                                height: 200,
                            },
                            extra: '编辑器中可通过 _var. 获取'
                        },
                        env: {
                            title: '环境变量json',
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
export default FlowSetting;