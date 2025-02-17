import { Input, Popover } from "antd"
import styles from '../default.less'
import { Node } from "@antv/x6";
import { ExtShapeReactNode } from "../extShape";

export const SubLogicNode = (props) => {
    const node: Node = props.node;
    node.setProp('imgSrc', '/logic/icons/CarbonSubflowLocal.svg');
    node.setProp('text', '复用逻辑');
    return (
        <ExtShapeReactNode node={node} />
    )
}
