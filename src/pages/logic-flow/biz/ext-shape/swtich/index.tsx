import { Input, Popover } from "antd"
import styles from '../default.less'
import { Node } from "@antv/x6";

export const SwitchNode = (props) => {
    const node: Node = props.node;
    const data = node.data;
    const name = node.data.config?.name || 'switch';
    const memo = data.config?.memo;
    return (
        <Popover content={memo ? <Input.TextArea style={{ width: 300, height: 200 }} readOnly value={memo} ></Input.TextArea> : ''} trigger="click" mouseLeaveDelay={0}>
            {/* <div>{data.config.name}</div> */}
            <div
                // className={styles.customNode}
                style={{ padding: '0px' }}
            >
                < Input addonBefore={name} className="input"
                    value={node.data?.config.condition}
                    onChange={
                        (e) => {
                            node.setData({
                                ...data,
                                config: {
                                    ...data.config,
                                    condition: e.target.value
                                }
                            })
                        }}
                    width={100} />
            </div >
        </Popover >
    )
}
