import { Input } from "antd"
import styles from '../default.less'
import { Node } from "@antv/x6";

export const SwitchCaseNode = (props) => {
    const node: Node = props.node;
    const name = node.data.config?.name;
    const label = name ? name : 'case';
    return (
        <div className={styles.customNode}>
            <span>{'case'}</span>
            <Input addonAfter={name} className="input" value={node?.data?.config?.case} width={150}
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
