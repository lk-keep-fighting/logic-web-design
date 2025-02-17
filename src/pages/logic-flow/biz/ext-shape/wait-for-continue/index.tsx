import { Input, Popover } from "antd"
import { Editor } from 'amis-ui'
import styles from '../default.less'
import { Node } from "@antv/x6";

export const WaitForContinueNode = (props) => {
    const node: Node = props.node;
    const memo = node.data.config?.memo;
    // <Editor width='200px' disabled='true' height='200px'
    //     language='markdown'
    //     options={{
    //         lineNumbers: "off"
    //     }}
    //     value={memo} />} trigger="click" mouseLeaveDelay={0} >
    return (
        <Popover content={memo ? <Input.TextArea style={{ width: 300, height: 200 }} readOnly value={memo} ></Input.TextArea> : ''} trigger="click" mouseLeaveDelay={0}>
            <div
                style={{
                    fontSize: '12px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    // backgroundColor: '#95e1d3',
                    border: '2px solid',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {node.data?.config.name || '交互点'}
            </div>
        </Popover >
    )
}
