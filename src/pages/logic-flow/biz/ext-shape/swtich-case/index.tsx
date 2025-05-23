import { Input, Popover } from "antd"
import styles from '../default.less'
import { Node } from "@antv/x6";
import TranRibbon from "../../components/ribbon";

export const SwitchCaseNode = (props) => {
    const node: Node = props.node;
    const name = node.data.config?.name;
    const memo = node.data.config?.memo;
    return (
        <Popover content={memo ? <Input.TextArea style={{ width: 300, height: 200 }} readOnly value={memo} ></Input.TextArea> : ''} trigger="click" mouseLeaveDelay={0}>
            <TranRibbon text={node.data.config?.tranGroupId}>
                <div className={styles.customNode}>
                    <Input addonBefore={name ? name : 'case'} className="input" value={node?.data?.config?.case} width={150}
                        onChange={
                            (e) => {
                                const data = node.data;
                                node.setData({
                                    ...data,
                                    config: {
                                        ...data.config,
                                        case: e.target.value
                                    }
                                })
                            }}
                    />
                </div>
            </TranRibbon>
        </Popover>
    )
}
