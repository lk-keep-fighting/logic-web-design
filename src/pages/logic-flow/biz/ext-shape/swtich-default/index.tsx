import { Input, Popover } from "antd"
import styles from '../default.less'
import TranRibbon from "../../components/ribbon";


export const SwitchDefaultNode = (props) => {
    const node = props.node;
    const memo = node.data.config?.memo;
    return (
        <Popover content={memo ? <Input.TextArea style={{ width: 300, height: 200 }} readOnly value={memo} ></Input.TextArea> : ''} trigger="click" mouseLeaveDelay={0}>
            <TranRibbon text={node.data.config?.tranGroupId}>
                <div className={styles.customNode}>
                    <div style={{ textAlign: 'center', fontSize: '15px' }}>默认分支</div>
                </div>
            </TranRibbon>
        </Popover>
    )
}
