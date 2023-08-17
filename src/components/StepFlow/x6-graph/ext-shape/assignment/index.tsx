import { Input, Select } from "antd"
import styles from './index.less'

export const AssignmentNode = (props) => {
    return (
        <div className={styles.customNode}>
            <Select></Select >
            <Input className="input" value={props?.data} width={80} />
        </div >
    )
}
