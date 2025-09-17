import { Input, Popover } from "antd"
import styles from '../default.less'
import { useEffect } from "react";
import { Node } from "@antv/x6";
import { ExtShapeReactNode } from "../extShape";

export const ExtShape3ReactNode = (props) => {
    const node: Node = props.node;
    node.data.backgroundColor = '#FFF8DC';
    useEffect(() => {
    }, [])
    return (
        <ExtShapeReactNode node={node} />
    )
}
