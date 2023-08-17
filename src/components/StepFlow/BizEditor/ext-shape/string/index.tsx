import { Input } from "antd"
import '../default.less'

export const StringNode = (props) => {
    return (
        <div className="customNode">
            <Input className="input" value={props?.data} width={80} />
        </div>
    )
}
