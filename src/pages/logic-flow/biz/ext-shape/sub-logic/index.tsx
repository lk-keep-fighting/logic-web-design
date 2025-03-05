import { Input, Popover } from "antd"
import styles from './index.less'
import { Node } from "@antv/x6";
import { ExtShapeReactNode } from "../extShape";

export const SubLogicNode = (props) => {
    const node: Node = props.node;
    const name = node.data.config?.name;
    const async = node.data.config?.async;
    const type = node.data.config?.type;
    const memo = node.data.config?.memo;
    const imgSrc = node.prop('imgSrc') || '/logic/icons/CarbonSubflowLocal.svg';
    const text = node.prop('text') || '复用逻辑';
    const backgroundColor = node.prop('backgroundColor');
    return (
        <Popover content={memo ? <Input.TextArea style={{ width: 300, height: 200 }} readOnly value={memo} ></Input.TextArea> : ''} trigger="click" mouseLeaveDelay={0}>
            <div
                className={styles.subprocess}
                style={{
                    // width: '100%', height: '100%', border: '1px solid #8f8f8f', borderRadius: '5px', position: 'relative',
                }}
            >
                {/* <div style={{ marginTop: 0, whiteSpace: 'pre-wrap', padding: 0, fontSize: '12px', wordWrap: 'break-word', textAlign: 'left', lineHeight: '1.2' }}>
                    <span> {name || text}</span>
                </div> */}
                <div className={styles.left}></div>
                <div className={styles.right}></div>
                <div className={styles.subprocessText}>
                    {name || text}
                    {async ? <div className={styles.async}>异步执行</div> : ''}
                </div>
            </div>
        </Popover >
    )
}
