import axios from "axios";
import { InitPanelData } from "../settings/PanelSetting";
import { ports } from "@/components/logic-editor/settings/Consts";
import LogicNodeConfig from "@/components/logic-editor/types/LogicNodeConfig";
import PanelConfigBuilder from "@/components/logic-editor/utils/PanelConfigBuilder";

function autoSplitStrToMultiLine(str: string) {
    if (str.length > 7) {
        return `${str.substring(0, 7)}\r\n${str.substring(7)}`
    } else return str;
}
export async function getPanelData() {
    const customGroups = []
    return Promise.all([
        InitPanelData(),
        axios.get('/api/ide/asset/v1/logic-item/readFromCode'),
    ]).then(res => {
        console.log('getPanelData')
        if (res[1].status == 200) {
            var methodsByGroup = res[1].data.data;
            Object.keys(methodsByGroup).forEach((group, groupIdx) => {
                const groupConfig = PanelConfigBuilder.buildGroup(group, methodsByGroup[group].length, group)
                customGroups.push(groupConfig)
                methodsByGroup[group].sort((a, b) => a.order ? a.order.localeCompare(b.order) : 1).forEach(item => {
                    res[0].Nodes.push(new LogicNodeConfig(
                        {
                            shape: item.shape ? item.shape : ('ExtShape' + (groupIdx % 3 == 0 ? '1' : groupIdx % 3 == 1 ? '2' : '3')),
                            ports,
                            attrs: {
                                image: {
                                    width: 15,
                                    x: 2,
                                    y: 2,
                                    'xlink:href': '/logic/icons/java.svg',
                                },
                                text: {
                                    text: autoSplitStrToMultiLine(item.name),
                                    fontSize: 12,
                                },
                            },
                            data: {
                                config: item.logicItem,
                            },
                            _groups: [item.group],
                        }))
                })
            })
            // res[1].data.data.forEach(item => {
            //     res[0].Nodes.push(new LogicNodeConfig(
            //         {
            //             shape: 'ExtSharp',
            //             ports,
            //             attrs: {
            //                 image: {
            //                     width: 15,
            //                     x: 2,
            //                     y: 2,
            //                     'xlink:href': '/icons/java.svg',
            //                 },
            //                 text: {
            //                     text: autoSplitStrToMultiLine(item.name),
            //                     fontSize: 12,
            //                 },
            //             },
            //             data: {
            //                 config: item.logicItem,
            //             },
            //             // tools: ['node-editor'],
            //             _groups: ['biz-cpm'],
            //         }))
            // })
        }
        return { Nodes: res[0].Nodes, Groups: customGroups }
    })
    // return new Promise((resolve, reject) => {
    //     resolve(InitPanelData());
    // });
}