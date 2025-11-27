import { Badge, Input, Popover } from "antd"
import styles from '../default.less'
import { Node } from "@antv/x6";
import { LogicItemTypeEnum } from "@/components/lib/dsl/meta-data/base/ConceptEnum";
import { JavaNode } from "../java/index"
import { JsNode } from "../js/index"
import { HttpNode } from "../http/index"
import { WaitNode } from "../wait/index"
import { WaitForContinueNode } from "../wait-for-continue/index"
import { SwitchNode } from "../swtich/index"
import { SubLogicNode } from "../sub-logic/index"
import { ExtShapeReactNode } from "../extShape/index"
import { ExtShape1ReactNode } from "../extShape1"
import { ExtShape2ReactNode } from "../extShape2"
import { ExtShape3ReactNode } from "../extShape3"

interface NodeProps {
    node: Node;
}

interface CycleStyleProps {
    data: {
        backgroundColor?: string;
        imgSrc?: string;
        config: {
            name: string;
            type: string;
        };
    };
}

interface RectStyleProps {
    node: {
        data: {
            backgroundColor?: string;
            imgSrc?: string;
            config: {
                name: string;
                type: string;
            };
        };
    };
}

const CycleStyle = (props: CycleStyleProps) => {
    const { backgroundColor, imgSrc, config } = props.data;
    let defConfig = { ...config }
    const { name, type } = defConfig
    return <div
        style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            // backgroundColor: '#95e1d3',
            backgroundColor: 'white',
            border: '2px solid',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
    >
        {name}
    </div>
}
const RectStyle = (props: RectStyleProps) => {
    const { backgroundColor, imgSrc, config } = props.node.data;
    let defConfig = { ...config }
    const { name, type } = defConfig
    console.log(defConfig);
    return (
        <div
            style={{
                width: '100px',
                height: '50px',
                border: '1px solid #8f8f8f',
                borderRadius: '5px',
                backgroundColor: backgroundColor ? backgroundColor : 'white',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '8px',
                gap: '8px'
            }}
        >
            <img
                src={imgSrc ? imgSrc : `/logic/icons/${type}.svg`}
                style={{
                    width: '25px',
                    height: '25px',
                    flexShrink: 0
                }}
            />
            <div style={{
                flex: 1,
                fontSize: '12px',
                wordWrap: 'break-word',
                textAlign: 'left',
                // lineHeight: '1.2',
                overflow: 'hidden'
            }}>
                {name}
            </div>
        </div>
    )
}

export const PreviewInPanelReactNode = (props: NodeProps) => {
    const node: Node = props.node;
    const type = node.data.config.type;
    const shape = node.shape
    // const name = node.data.config?.name;
    // const type = node.data.config?.type;
    // const memo = node.data.config?.memo;
    // const tranGroupId = node.data.config?.tranGroupId;
    // const imgSrc = node.data.imgSrc;//node.prop('imgSrc');
    // const text = node.data.text;//node.prop('text');
    // const backgroundColor = node.data.backgroundColor;//node.prop('backgroundColor');
    console.log('props', props);
    switch (shape) {
        case LogicItemTypeEnum.wait:
            return <WaitNode node={props.node} />;
        case LogicItemTypeEnum.waitForContinue:
            return <WaitForContinueNode node={props.node} />;
        case LogicItemTypeEnum.subLogic:
            return <SubLogicNode node={props.node} />;
        case 'ExtShape1':
            return <ExtShape1ReactNode node={props.node} />;
        case 'ExtShape2':
            return <ExtShape2ReactNode node={props.node} />;
        case 'ExtShape3':
            return <ExtShape3ReactNode node={props.node} />;
        // case 'java':
        //     return <JavaNode node={props.node} />;
        // case 'js':
        //     return <JsNode node={props.node} />;
        // case 'http':
        //     return <HttpNode node={props.node} />;
        // case 'swtich':
        //     return <SwitchNode node={props.node} />;
        default:
            return <RectStyle node={props.node} />;

    }

}
