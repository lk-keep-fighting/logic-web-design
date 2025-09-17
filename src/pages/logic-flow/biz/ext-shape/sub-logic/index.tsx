import { Input, Popover } from "antd"
import styles from './index.less'
import { Node } from "@antv/x6";
import { ExtShapeReactNode } from "../extShape";
import TranRibbon from "../../components/ribbon";

export const SubLogicNode = (props) => {
    const node: Node = props.node;
    const name = node.data.config?.name;
    const async = node.data.config?.async;
    const type = node.data.config?.type;
    const memo = node.data.config?.memo;
    const tranGroupId = node.data.config?.tranGroupId;
    const text = ''//node.prop('text') || '复用逻辑';
    return (
        <Popover content={memo ? <Input.TextArea style={{ width: 300, height: 200 }} readOnly value={memo} ></Input.TextArea> : ''} trigger="click" mouseLeaveDelay={0}>
            <TranRibbon text={tranGroupId}>
                <div style={{
                    width: '100%', minHeight: '50px',
                    minWidth: '90px',
                }}>
                    <div className={styles.subprocess} >
                        <div className={styles.subprocessText}>
                            {name || text}
                            {async ? <div className={styles.async}>异步执行</div> : ''}
                        </div>
                        <div className={styles.left}></div>
                        <div className={styles.right}></div>
                    </div>
                </div>
            </TranRibbon>
        </Popover >

    )
}
