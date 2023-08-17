import { Card, Input, Select, TreeSelect } from "antd"
import styles from '../default.less'
import { ReactComponent as SvgSwitch } from '@/../public/icons/switch.svg'
import { useState } from "react";
import { useContext } from "react";
import { EditorContext } from "@/components/StepFlow/xeditor/editor";
import { Node } from "@antv/x6";

export const SwitchNode = (props) => {
    const node: Node = props.node;
    const { stepFlow } = useContext(EditorContext);
    return (
        <div className={styles.customNode}>
            {/* <Card style={{ width: 500 }}> */}

                {/* <Input addonBefore={<SvgSwitch width={20} height={20}/>} className="input" value={props?.data} width={100} /> */}
                <Input addonBefore='switch' className="input" value={node.data?.config.condition}
                    onChange={
                        (e) => {
                            const data = node.data;
                            node.setData({
                                ...data,
                                config: {
                                    ...data.config,
                                    condition: e.target.value
                                }
                            })
                        }}
                    width={100} />
            {/* </Card> */}
            {/* <TreeSelect
                style={{ width: '100px' }}
                value={value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                placeholder="请选择变量"
                treeDefaultExpandAll
                onChange={onChange}
            /> */}

        </div>
    )
}
