
import { useMatch, useParams } from 'umi';
import styles from './index.less';
import PageDesinger from '@/components/page-designer'
import { Button, Divider, Input, Typography, Modal, Space, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Editor, InputJSONSchema, JSONSchemaEditor, toast } from 'amis-ui'
import copy from 'copy-to-clipboard';
import { BulbOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getPageJson } from '@/services/pageSvr';
import 'amis-editor-core/lib/style.css';
axios.interceptors.response.use(response => {
    console.log('axios config')
    console.log(response)
    if (response.data) {
        // 数据正常，进行的逻辑功能
        return response
    } else {
        // 如果返回的 success 是 false，表明业务出错，直接触发 reject
        // 抛出的错误，被 catch 捕获
        return Promise.reject(new Error(response.data.message))
    }
}, error => {
    console.log('axios error')
    if (error.response.data) {
        // 数据正常，进行的逻辑功能
        const rep = error.response;
        console.log('--》data有返回值，判定为业务异常，继续返回response！');
        console.log(rep);
        return rep;
    }
    // 对响应错误做点什么
    return Promise.reject(error)
})
const PageEditor: React.FC = (props) => {
    let theme = 'cxd';
    let locale = 'zh-CN';
    const match = useMatch('/set/page/amis/:id');
    const { pageId } = useParams();
    const [jsonSchema, setJsonSchema] = useState({})
    useEffect(() => {
        getPageJson(pageId).then(res => setJsonSchema(res));
    }, [pageId])
    const [preview, setPreview] = useState(false);
    const [showAssistant, setShowAssistant] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [AIGCJson, setAIGCJson] = useState('');
    const { Text } = Typography;
    return (
        <div className={styles.container}>
            <Space style={{ margin: '5px', float: 'right' }}>
                <Button key={0} onClick={() => setShowAssistant(true)}>小助手</Button>
                <Button key={1} onClick={() => setPreview(!preview)}>{preview ? '编辑' : '预览'}</Button>
                <Button key={2} type='primary' onClick={e => { copy(JSON.stringify(jsonSchema)) }}>复制配置</Button>
            </Space>
            <Divider style={{ margin: '0px' }} />
            <PageDesinger pageSchmea={jsonSchema} preview={preview} onChange={v => setJsonSchema(v)} style={{ height: '100vh' }} />
            <Modal open={showAssistant}
                confirmLoading={isLoading}
                title='配置生成小助手(Beta)'
                cancelText='取消'
                okText='使用配置'
                width={800}
                onOk={() => {
                    setShowAssistant(false);
                    setJsonSchema(JSON.parse(AIGCJson));
                }}
                onCancel={() => setShowAssistant(false)}
            >
                <Input.TextArea style={{ margin: '5px' }} placeholder='输入一段需求，如"生成一个任务管理界面，任务信息包含任务号id、时间time、负责人mgr_user' onChange={v => setPrompt(v.target.value)} />
                <Button
                    loading={isLoading}
                    onClick={() => {
                        if (prompt.length == 0) {
                            message.warning('请输入一段需求提示')
                            return;
                        }
                        setShowAssistant(true)
                        setIsLoading(true);
                        axios.post('/openai/v1/chat/completions', {
                            headers: {
                                Authorization: 'Bearer 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'
                            },
                            data: {
                                "model": "gpt-3.5-turbo",
                                "messages": [
                                    {
                                        "role": "system",
                                        "content": "你是一个amis配置文件生成器，帮我生成json配置文件"
                                    },
                                    {
                                        "role": "user",
                                        "content": prompt
                                    }
                                ]
                            }
                        }).then(res => {
                            let cnt: string = res.choices[0].message.content;
                            setIsLoading(false);
                            let startIdx = cnt.indexOf('```')
                            let endIdx = cnt.lastIndexOf('```')
                            let json = cnt.substring(startIdx + 7, endIdx);
                            console.log(json)
                            setAIGCJson(json)
                        })
                    }}
                    icon={<BulbOutlined />}
                    type='primary'
                    style={{ width: '100%', marginTop: '5px', marginBottom: '5px' }}
                >生成配置↓</Button>
                <Editor
                    value={AIGCJson}
                    onChange={(v) => setAIGCJson(v)} height={300} language='json'
                    options={{
                        // 下面三个接口必须实现
                        fetcher: ({
                            url, // 接口地址
                            method, // 请求方法 get、post、put、delete
                            data, // 请求数据
                            responseType,
                            config, // 其他配置
                            headers // 请求头
                        }: any) => {
                            config = config || {};
                            config.withCredentials = true;
                            responseType && (config.responseType = responseType);

                            if (config.cancelExecutor) {
                                config.cancelToken = new (axios as any).CancelToken(
                                    config.cancelExecutor
                                );
                            }

                            config.headers = headers || {};

                            if (method !== 'post' && method !== 'put' && method !== 'patch') {
                                if (data) {
                                    config.params = data;
                                }

                                return (axios as any)[method](url, config);
                            } else if (data && data instanceof FormData) {
                                config.headers = config.headers || {};
                                config.headers['Content-Type'] = 'multipart/form-data';
                            } else if (
                                data &&
                                typeof data !== 'string' &&
                                !(data instanceof Blob) &&
                                !(data instanceof ArrayBuffer)
                            ) {
                                data = JSON.stringify(data);
                                config.headers = config.headers || {};
                                config.headers['Content-Type'] = 'application/json';
                            }

                            return (axios as any)[method](url, data, config);
                        },
                        isCancel: (value: any) => (axios as any).isCancel(value),
                        copy: content => {
                            copy(content);
                            toast.success('内容已复制到粘贴板');
                        },
                        theme

                        // 后面这些接口可以不用实现

                        // 默认是地址跳转
                        // jumpTo: (
                        //   location: string /*目标地址*/,
                        //   action: any /* action对象*/
                        // ) => {
                        //   // 用来实现页面跳转, actionType:link、url 都会进来。
                        // },

                        // updateLocation: (
                        //   location: string /*目标地址*/,
                        //   replace: boolean /*是replace，还是push？*/
                        // ) => {
                        //   // 地址替换，跟 jumpTo 类似
                        // },

                        // isCurrentUrl: (
                        //   url: string /*url地址*/,
                        // ) => {
                        //   // 用来判断是否目标地址当前地址
                        // },

                        // notify: (
                        //   type: 'error' | 'success' /**/,
                        //   msg: string /*提示内容*/
                        // ) => {
                        //   toast[type]
                        //     ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
                        //     : console.warn('[Notify]', type, msg);
                        // },
                        // alert,
                        // confirm,
                        // tracker: (eventTracke) => {}
                    }}
                />
            </Modal>
        </div>
    );
};

export default PageEditor;
