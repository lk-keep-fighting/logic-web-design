
import axios from 'axios';
import copy from 'copy-to-clipboard';
import { Schema, render as renderAmis } from 'amis';
import { ToastComponent, AlertComponent, alert, confirm, toast } from 'amis-ui';
import { useEffect, useState } from 'react';
import { getPageJson } from '@/services/schemeSvc';
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import { TokenUtil } from '@/utils/tokenUtil';
interface IPageRenderByIdProps {
    pageId: string
    data: any
}
axios.interceptors.response.use(response => {
    console.log('axios response')
    console.log(response)
    if (response && response.data) {
        console.log('--请求未报错，适配status=0');
        if (!response.data.error) response.data.error = { code: 0 };//修复amis会自动取error.code作为status
        response.data.status = 0;
        //适配表格数据源
        if (response.data.data && response.data.data.records) response.data.data.items = response.data.data.records;
        return response
    } else {
        // 数据为空
        console.log('--返回数据为空，判断为异常');
        console.log(response.data);
        return Promise.reject(new Error(response.data.message))
    }
}, error => {
    console.log('捕捉axios error')
    console.log(error);
    if (error.response && error.response.data) {
        // 数据正常，进行的逻辑功能
        const rep = error.response;
        console.log('--data有返回值，判定为业务异常，继续返回response,适配status=500！');
        if (error.response.data.error?.code == 0) error.response.data.error.code = 500
        console.log(rep);
        // 对响应错误做点什么
        return rep;
    }
    // 对响应错误做点什么
    return Promise.reject(error)
})
const PageRenderById = (props: IPageRenderByIdProps) => {
    const [pageScheme, setPageScheme] = useState({ type: 'page' })
    const theme = 'cxd';
    const locale = 'zh-CN';
    useEffect(() => {
        if (props.pageId) {
            getPageJson(props.pageId).then(data => {
                setPageScheme(data);
            })
        }
    }, [props.pageId])
    // 请勿使用 React.StrictMode，目前还不支持
    return (
        <div>
            < ToastComponent
                theme={theme}
                key="toast"
                position={'top-right'}
                locale={locale}
            />
            <AlertComponent theme={theme} key="alert" locale={locale} />
            {
                renderAmis(
                    pageScheme,
                    {
                        data: props.data
                        // props...
                        // locale: 'en-US' // 请参考「多语言」的文档
                        // scopeRef: (ref: any) => (amisScoped = ref)  // 功能和前面 SDK 的 amisScoped 一样
                    },
                    {
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
                        theme,

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
        </div >
    );
}
export default PageRenderById;