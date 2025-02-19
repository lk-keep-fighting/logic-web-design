import { Input, Popover } from "antd"
import styles from '../default.less'


export const SwitchDefaultNode = (props) => {
    const node = props.node;
    const memo = node.data.config?.memo;
    return (
        <Popover content={memo ? <Input.TextArea style={{ width: 300, height: 200 }} readOnly value={memo} ></Input.TextArea> : ''} trigger="click" mouseLeaveDelay={0}>

            <div className={styles.customNode}>
                <div style={{ textAlign: 'center', fontSize: '15px' }}>default</div>
            </div>
        </Popover>
    )
}
