import { Input } from "antd"
import styles from '../default.less'
import { Node } from "@antv/x6";
import CasesInput from "./cases-input";
import React, { useEffect, useState } from "react";

export const SwitchCasesNode = (props) => {
    const node: Node = props.node;
    const name = node.data.config?.name;
    const [cases, setCases] = useState(node?.data?.config?.cases);
    useEffect(() => {
        setCases(node?.data?.config?.cases);
    }, [node?.data?.config?.cases]);
    return (
        <div className={styles.customNode}>
            {name ? name : 'cases'}
            <CasesInput className="input" cases={cases} editable={props.node.data.selected} width={150}
                onChange={
                    (values) => {
                        const data = node.data;
                        node.setData({
                            ...data,
                            config: {
                                ...data.config,
                                cases: values
                            }
                        })
                    }}
            />
        </div>
    )
}

