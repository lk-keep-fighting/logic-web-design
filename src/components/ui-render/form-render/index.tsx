
import axios from 'axios';
import copy from 'copy-to-clipboard';
import { render as renderAmis } from 'amis';
import { ToastComponent, AlertComponent, toast } from 'amis-ui';
import React, { useContext, useEffect, useState } from 'react';
import { buildVarExtarLibByObj } from '../../monaco-helper';
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import { TokenUtil } from '@/components/ui-render/utils/tokenUtil';
import { LogicEditorContext } from '../../logic-editor/editor';
import { axiosSet } from '../utils/axiosConfig';
interface IFormRenderProps {
    config: any
    values?: any
    onSubmit?: any
    isStatic?: boolean
    // jsTipMap?: Map<string, object>
}
const FormRender = (props: IFormRenderProps) => {
    const logicEditorCtx = useContext(LogicEditorContext);
    const [config, setConfig] = useState(props?.config);
    const [values, setValues] = useState(props?.values);
    const jsTips = logicEditorCtx?.jsTips;
    const [amisScoped, setAmisScoped] = useState();
    function handleBroadcast(type: string, rawEvent: any, data: any) {
        if (type === 'formSubmited') {
            console.log('内部表单提交了', data);
            props.onSubmit(data)
        } else {
            console.log('内部表单触发了Broadcast', data);
        }
    }
    useEffect(() => {
        axiosSet(axios)
    }, [])
    /**
     * 值变更时
     */
    useEffect(() => {
        if (props.config && props.config.body) {
            const formConfig = props.config.body[0];
            formConfig.body?.forEach(element => {
                // console.log('处理Editor自动提示');
                findEditorItem(element)
            });

            const form = amisScoped?.getComponentByName('page1.form1');
            form?.props.store.clear()
            setConfig(props.config);
        }
        // const form = amisScoped?.getComponentByName('page1.form1');
        // form?.props.store.clear()
    }, [props.config])

    useEffect(() => {
        const form = amisScoped?.getComponentByName('page1.form1');
        form?.props.store.clear()
        form?.props.store.setValues(props.values)
    }, [config])
    /**
     * 配置变更时
     */
    useEffect(() => {
        const form = amisScoped?.getComponentByName('page1.form1');
        // console.log('update values', props.values)
        form?.props.store.clear()
        form?.props.store.setValues(props.values)
        setValues(props.values)
    }, [props.values])

    const [monaco, setMonaco] = useState();
    function findEditorItem(element) {
        if (element.type == 'editor' && element.language == 'javascript') {
            element.editorDidMount = (editor, monaco) => {
                setMonaco(monaco);
                if (jsTips) {
                    Object.keys(jsTips).forEach(k => {
                        const tipJson = buildVarExtarLibByObj(k, JSON.parse(jsTips[k]))
                        monaco?.languages.typescript.javascriptDefaults.addExtraLib(tipJson, `${k}.ts`);
                    })
                }
                return () => {
                    try {
                        console.log('effect dispose')
                        // @ts-ignore
                        editor?.dispose();
                        editor?.current?.dispose();
                        monaco?.current?.dispose();
                    } catch (error) {
                        console.error('error in findEditorItem')
                        console.error(error)
                    }
                }
            }
        } else if (element.body) {
            element.body.forEach(v => {
                findEditorItem(v);
            })
        }
    }

    /**
     * 追加全局js编辑器自动提示
     */
    useEffect(() => {
        if (jsTips) {
            Object.keys(jsTips).forEach(k => {
                const tipJson = buildVarExtarLibByObj(k, JSON.parse(jsTips[k]))
                monaco?.languages.typescript.javascriptDefaults.addExtraLib(tipJson, `${k}.ts`);
            })
        }
    }, [jsTips])
    return (
        <div>
            < ToastComponent
                theme={'cxd'}
                key="toast"
                position={'top-right'}
                locale={'zh-CN'}
            />
            <AlertComponent theme={'cxd'} key="alert" locale={'zh-CN'} />
            {
                renderAmis(
                    config,
                    {
                        onBroadcast: handleBroadcast,
                        data: values,
                        // props...
                        // locale: 'en-US' // 请参考「多语言」的文档
                        scopeRef: (ref: any) => (setAmisScoped(ref))  // 功能和前面 SDK 的 amisScoped 一样
                    },
                    {
                        // enableAMISDebug: true,
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
                            if (!config.headers['Authorization'])
                                config.headers['Authorization'] = "Bearer " + TokenUtil.getTokenFormLocal()
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
                        theme: 'cxd',

                        // 后面这些接口可以不用实现

                        // 默认是地址跳转
                        jumpTo: (
                            location: string /*目标地址*/,
                            action: any /* action对象*/
                        ) => {
                            debugger
                            if (action.blank == true) {
                                window.open(window.location.origin + window.location.pathname + '#' + location, '_blank');
                            } else
                                window.location.hash = location;
                            // 用来实现页面跳转, actionType:link、url 都会进来。
                        },

                        // updateLocation: (
                        //     location: any /*目标地址*/,
                        //     replace?: boolean /*是replace，还是push？*/
                        // ) => {
                        //     debugger
                        //     // 地址替换，跟 jumpTo 类似
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
                    }
                )
            }
        </div>
    );
}

export default React.memo(FormRender);