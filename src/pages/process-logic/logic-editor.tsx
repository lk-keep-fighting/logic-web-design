import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import { X6Graph } from "@/components/mes-logic-editor";
import { Button, Spin, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "umi";
import { getLogicConfig, saveLogic } from "@/services/ideSvc";
import axios from "axios";
import { TokenUtil } from "@/utils/tokenUtil";


const LogicEditor = () => {
    const { id } = useParams();
    const [config, setConfig] = useState<Logic>();
    const [loading, setLoading] = useState(false);
    const handleSave = useCallback((logic: Logic) => {
        logic.id = id;
        setLoading(true);
        setConfig(logic)
        saveLogic(logic.id, logic.version, JSON.stringify(logic)).then(res => {
            setLoading(false)
            message.success('保存成功')
            console.log('save logic')
            console.log(logic)
        }).catch(err => {
            setLoading(false)
            console.log('err')
            console.log(err)
            message.error('保存失败')
        })
    }, [])
    useEffect(() => {
        setLoading(true);
        getLogicConfig(id).then(res => {
            const configJson = res;
            configJson.id = id;//默认使用当前id作为配置id，用于复用配置时简化更新操作
            setConfig(configJson)
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log('err')
            console.log(err)
        })
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <X6Graph
                    btns={[
                        <Button onClick={() => {
                            axios.post('/api/mes/asm-system/bbs/v1/common/accounts/employee/access-token', {
                                "loginName": "admin",
                                "password": "1234@qwer"
                            }).then(res => {
                                debugger
                                TokenUtil.setTokenToLocal(res.data.data.accessToken);
                                message.success(res.data.data.accessToken)
                            }).catch(err => message.error(err.toString()))
                        }}
                        >获取权限</Button>
                    ]}
                    config={config}
                    onSave={handleSave}
                />
            </Spin>
        </div>
    );
};

export default LogicEditor;
