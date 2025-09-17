import { Flex, Input, Popover, Select } from "antd"
import styles from './index.less'
import TranRibbon from "../../../components/ribbon";

export const AssignGlobalNode = (props) => {
    const node: Node = props.node;
    const name = node.data.config?.name;
    const body = node.data.config?.body;
    const url = node.data.config?.url;
    const memo = node.data.config?.memo;
    const text = node.prop('text');
    return (
        <Popover content={memo ? <Input.TextArea style={{ width: 300, height: 200 }} readOnly value={memo} ></Input.TextArea> : ''} trigger="click" mouseLeaveDelay={0}>
            <TranRibbon text={node.data.config?.tranGroupId}>
                <div className={styles.customNode}>
                    <Flex justify={'flex-start'} align={'center'}>
                        {props.node.data.selected ?
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Input value={url} width={50}
                                    placeholder="变量名"
                                    style={{ fontWeight: 'bold' }}
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
                                />
                                <span style={{ margin: 2 }}>=</span>
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
                                />
                            </div>
                            : <div style={{ textAlign: 'center', margin: 2, width: '100%', fontWeight: 'bold', fontSize: 15 }} >{url ? url : '变量名'}  <span style={{ margin: 2 }}>=</span>{body}</div>}
                    </Flex>
                </div >
            </TranRibbon>
        </Popover>
    )
}
