import { Input } from "antd"
import styles from '../default.less'
import { Node } from "@antv/x6";

export const SwitchCaseNode = (props) => {
    const node: Node = props.node;
    return (
        <div className={styles.customNode}>
            <Input addonBefore='case' className="input" value={node?.data?.config?.case} width={100}
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
    )
}
