import { Input, Popover } from "antd"
import styles from '../default.less'
import { Node } from "@antv/x6";
import { ExtShapeReactNode } from "../extShape";

export const JsNode = (props) => {
    const node: Node = props.node;
    const name = node.data.config?.name;
    const type = node.data.config?.type;
    const memo = node.data.config?.memo;
    const imgSrc = node.prop('imgSrc');
    const text = node.prop('text');
    const backgroundColor = node.prop('backgroundColor');
    return (
        <Popover content={memo ? <Input.TextArea style={{ width: 300, height: 200 }} readOnly value={memo} ></Input.TextArea> : ''} trigger="click" mouseLeaveDelay={0}>
            <div
                className={styles.customNode}
                style={{
                    width: '100%', height: '100%', border: '2px dashed rgb(194, 196, 198)', borderRadius: '5px', position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: backgroundColor?.includes('#') ? backgroundColor : 'white'
                }}
            >
                <img src={imgSrc ? imgSrc : `/logic/icons/${type}.svg`} style={{ width: 20, height: 20, position: 'absolute', top: 0, left: 5, margin: 0 }} />
                <div style={{ marginTop: 12, whiteSpace: 'pre-wrap', padding: 0, fontSize: '12px', wordWrap: 'break-word', textAlign: 'left', lineHeight: '1.2' }}>
                    {name || text}
                </div>
            </div>
        </Popover >
    )
}
