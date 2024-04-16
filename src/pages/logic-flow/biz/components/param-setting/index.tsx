import FormRenderById from "@/components/ui-render/form-render/render-by-form-id";
import { TypeAnnotationParser } from "@/components/step-flow-core/lasl/parser/type-annotation-parser";
import { Modal, Tabs, message } from "antd"
import { useCallback, useEffect, useState } from "react";
const ParamSetting = (props) => {
    const [formData, setFormData] = useState({})
    useEffect(() => {
        const { params, variables, envs, returns, log } = props.values;
        setFormData({
            params: JSON.stringify(TypeAnnotationParser.getJsonByParams(params)),
            variables: JSON.stringify(TypeAnnotationParser.getJsonByParams(variables)),
            returns: JSON.stringify(TypeAnnotationParser.getJsonByParams(returns)),
            envs: JSON.stringify(TypeAnnotationParser.getJsonByParams(envs)),
            log
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
            footer={false}
            onCancel={() => props?.setOpen(false)}
        >
            <FormRenderById formId="logic-setting" values={formData} onSubmit={(values) => {
                console.log('提交参数')
                console.log(values)
                let hasError = false;
                Object.keys(values).forEach(key => {
                    const item = values[key];
                    if (!validateJsonString(item)) {
                        let field = key === 'params' ? '入参' : key === 'variables' ? '局部变量' : key === 'returns' ? '返回参数' : '环境变量'
                        switch (key) {
                            case 'params':
                                message.error(`入参json格式错误`)
                                hasError = true;
                                return false;
                                break;
                            case 'variables':
                                message.error(`局部变量json格式错误`)
                                hasError = true;
                                return false;
                                break;
                            case 'returns':
                                message.error(`返回参数json格式错误`)
                                hasError = true;
                                return false;
                                break;
                            case 'ens':
                                message.error(`环境变量json格式错误`)
                                hasError = true;
                                return false;
                                break;
                            default:
                                break;
                        }

                    }
                });
                if (!hasError) {
                    if (props?.onSubmit)
                        props.onSubmit(values)
                    props?.setOpen(false)
                }
            }} />
        </Modal>
    </span >
}
export default ParamSetting;