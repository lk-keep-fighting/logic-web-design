import { InputNumber } from "antd"
import '../default.less'

export const NumNode = (props) => {
    return (
        <div className="customNode">
            <InputNumber className="input" value={props?.data} width={80} />
        </div>
    )
}
