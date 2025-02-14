import { Input, Popover } from "antd"
import styles from '../default.less'
import { Node } from "@antv/x6";
import { ExtShapeReactNode } from "../extShape";

export const HttpNode = (props) => {
    const node: Node = props.node;
    return (
        <ExtShapeReactNode node={node} />
    )
}
