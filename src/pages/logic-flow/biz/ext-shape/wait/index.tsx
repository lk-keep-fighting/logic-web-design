import { Input, Popover } from "antd"
import styles from '../default.less'
import { Node } from "@antv/x6";

export const WaitNode = (props) => {
    const node: Node = props.node;
    const name = node.data.config?.name;
    const memo = node.data.config?.memo;
    const imgSrc = ''//node.prop('imgSrc');
    const text = ''//node.prop('text');
    const backgroundColor = ''//node.prop('backgroundColor');
    return (
        <Popover content={memo ? <Input.TextArea style={{ width: 300, height: 200 }} readOnly value={memo} ></Input.TextArea> : ''} trigger="click" mouseLeaveDelay={0}>
            <div
                className={styles.customNode}
                style={{
                    width: '100%', height: '100%', border: '1px solid #8f8f8f', borderRadius: '5px',
                    backgroundColor: backgroundColor?.includes('#') ? backgroundColor : '',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                }}
            >
                <img src={imgSrc ? imgSrc : `/logic/icons/delay.svg`} style={{ width: '30px', height: '30px', margin: 0 }} />
            </div>
            <div style={{ fontSize: '12px', marginTop: '1px', textAlign: 'center' }}>{text ? text : ''}</div>
        </Popover >
    )
}
