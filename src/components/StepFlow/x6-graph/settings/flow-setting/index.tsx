import FormRender from "@/components/StepFlow/component/FormRender"
import { Modal, Tabs } from "antd"
import { useForm } from "form-render"
import { useEffect, useState } from "react";

const FlowSetting = (props) => {
    const form = useForm();
    console.log(props)
    useEffect(() => {
        form.setValues(props.values)
    }, props.values)
    return <span>
        {props.children}
        <Modal open={props.open ?? false}
            title='参数配置'
            width={1000}
            onOk={() => {
                const values = form.getValues()
                if (props?.onSubmit)
                    props.onSubmit(values)
                props?.setOpen(false)
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
                            extra:'编辑器中可通过 _input. 获取'
                        },
                        return: {
                            title: '返回参数json',
                            type: 'string',
                            widget: 'json',
                            props: {
                                height: 200,
                            },
                            extra:'编辑器中可通过 _return. 获取'
                        },
                        var: {
                            title: '全局变量json',
                            type: 'string',
                            widget: 'json',
                            props: {
                                height: 200,
                            },
                            extra:'编辑器中可通过 _var. 获取'
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