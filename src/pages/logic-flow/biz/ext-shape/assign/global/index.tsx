import { Flex, Input, Popover, Select } from "antd"
import styles from './index.less'

export const AssignGlobalNode = (props) => {
    const node: Node = props.node;
    const name = node.data.config?.name;
    const body = node.data.config?.body;
    const url = node.data.config?.url;
    const memo = node.data.config?.memo;
    const imgSrc = node.prop('imgSrc');
    const text = node.prop('text');
    return (
        <Popover content={memo ? <Input.TextArea style={{ width: 300, height: 200 }} readOnly value={memo} ></Input.TextArea> : ''} trigger="click" mouseLeaveDelay={0}>
            <div className={styles.customNode} style={{ backgroundColor: 'red' }}>
                {/* {name ? <div style={{ textDecoration: 'underline' }}>{name}</div> : ''} */}
                <Flex justify={'flex-start'} align={'center'}>
                    {props.node.data.selected ?
                        <Input value={url} width={50}
                            placeholder="变量名"
                            style={{ textAlign: 'right', fontWeight: 'bold' }}
                            onChange={
                                (e) => {
                                    const data = node.data;
                                    node.setData({
                                        ...data,
                                        config: {
                                            ...data.config,
                                            url: e.target.value
                                        }
                                    })
                                }}
                        /> : <div style={{ margin: 2, width: '50%', fontWeight: 'bold', textAlign: 'right', color: 'white', fontSize: 15 }} >{url ? url : '变量名'}</div>}
                    <span style={{ margin: 2, color: 'white' }}>=</span>
                    {props.node.data.selected ?
                        <Input value={body} width={50}
                            onChange={
                                (e) => {
                                    const data = node.data;
                                    node.setData({
                                        ...data,
                                        config: {
                                            ...data.config,
                                            body: e.target.value
                                        }
                                    })
                                }}
                        /> : <div style={{ margin: 2, width: '50%', fontWeight: 'bold', textAlign: 'left', color: 'white', fontSize: 15 }} >{body}</div>}
                </Flex>
            </div >
        </Popover>
    )
}
