import { Input, List, Popover } from "antd"
import styles from '../default.less'
import { Node } from "@antv/x6";
import CasesInput from "./cases-input";
import React, { useEffect, useState } from "react";
import TranRibbon from "../../components/ribbon";

export const SwitchCasesNode = (props) => {
    const node: Node = props.node;
    const name = node.data.config?.name;
    const memo = node.data.config?.memo;
    const [caseItems, setCaseItems] = useState(node?.data?.config?.caseItems);
    useEffect(() => {
        setCaseItems(node?.data?.config?.caseItems);
    }, [node?.data?.config?.caseItems]);
    useEffect(() => {
        if (node?.data?.config?.cases && node?.data?.config?.cases.length > 0) {
            // caseItems为空，兼容老数据转换为新数据
            if (node?.data?.config?.caseItems == undefined || node?.data?.config?.caseItems.length == 0) {
                node.setData({
                    ...node.data,
                    config: {
                        ...node.data.config,
                        caseItems: node?.data?.config?.cases.map(i => { return { value: i } })
                    }
                })
                setCaseItems(node?.data?.config?.cases.map(i => { return { value: i } }));
            }
        } else {
            setCaseItems([]);
            node.setData({
                ...node.data,
                config: {
                    ...node.data.config,
                    caseItems: []
                }
            })
        }
    }, [node?.data?.config?.cases]);
    return (
        <Popover content={memo ? <Input.TextArea style={{ width: 300, height: 200 }} readOnly value={memo} ></Input.TextArea> : ''} trigger="click" mouseLeaveDelay={0}>
            <TranRibbon text={node.data.config?.tranGroupId}>
                <div className={styles.customNode}>
                    {name ? name : '多条件分支'}
                    <List
                        size="small"
                        dataSource={caseItems}
                        style={{ padding: '0', backgroundColor: 'white' }}
                        renderItem={(item, index) => (
                            <List.Item style={{ padding: '2px' }}>
                                <Input size='small' addonBefore={item.name} value={item.value} readOnly ></Input>
                            </List.Item>
                        )}
                    >
                    </List>
                    {/* <CasesInput className="input" cases={caseItems} editable={props.node.data.selected} width={150}
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
                /> */}
                </div>
            </TranRibbon>
        </Popover >
    )
}

