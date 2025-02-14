import { Input, Popover } from "antd"
import styles from '../default.less'
import { useEffect } from "react";
import { Node } from "@antv/x6";
import { ExtShapeReactNode } from "../extShape";

export const ExtShape1ReactNode = (props) => {
    const node: Node = props.node;
    useEffect(() => {
        node.prop('backgroundColor', '#ffcc00');
    }, [])
    return (
        <ExtShapeReactNode node={node} />
    )
}
