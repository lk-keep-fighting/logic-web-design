import { Input, Popover } from "antd"
import styles from '../default.less'
import { Node } from "@antv/x6";

export const EndNode = (props) => {
    const node: Node = props.node;
    const memo = node.data?.config.memo
    return (
        <Popover content={memo ? <Input.TextArea style={{ width: 300, height: 200 }} readOnly value={memo} ></Input.TextArea> : ''} trigger="click" mouseLeaveDelay={0}>
            <div
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    // backgroundColor: '#95e1d3',
                    backgroundColor: 'white',
                    border: '2px solid',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {node.data?.config.name || '结束'}
            </div>
        </Popover>
    )
}
