import { Input } from "antd"
import styles from '../default.less'

export const StringNode = (props) => {
    return (
        <div className={styles.customNode}>
            <Input className="input" value={props?.data} width={80} />
        </div>
    )
}
