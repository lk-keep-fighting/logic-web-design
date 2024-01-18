import { Cell, Edge, Graph, Node } from "@antv/x6";
import { ProcessInput } from "../services/dtos/processInput";
export class MESConvert {
    graphToMesDsl(graph: Graph | undefined, presetInput?: ProcessInput): ProcessInput {
        const edges: Edge.Properties[] = [];
        const nodes: Node.Properties[] = [];
        const cells = graph?.getCells();
        const nodesDic: { [Key: string]: Node.Properties } = {};
        let process: ProcessInput = presetInput || {};
        process.routeProductDetailList = [];
        //分组所有的节点与边
        cells.forEach((v) => {
            const id = v.id || '';
            if (v.shape === 'edge') {
                let edge: Edge.Config = v;
                let edgeLabel = edge.labels?.length > 0 ? edge.labels[0].attrs.label.text : '';
                let edgeType = edge.data.type;
                let sourceNode = edge.getSourceNode();
                let targetNode = edge.getTargetNode();
                if (targetNode.getChildCount() > 0) {
                    let childNodes = targetNode.getChildren()
                    childNodes?.forEach(c => {
                        process.routeProductDetailList?.push({
                            fromNode: sourceNode?.id,
                            fromNodeName: sourceNode?.getAttrByPath('text/text'),
                            toNode: c.id,
                            toNodeName: c.getAttrByPath('text/text'),
                            productCode: presetInput?.productCode,
                            productName: presetInput?.productName,
                            routeType: edgeType,
                            routeDetailDto: c.data.config,
                            inputOutputRatio: edgeLabel,
                            groupTag: targetNode?.getAttrByPath('text/text')
                        })
                    })
                } else if (sourceNode?.getChildCount() > 0) {
                    let childNodes = sourceNode?.getChildren()
                    childNodes?.forEach(c => {
                        process.routeProductDetailList?.push({
                            fromNode: c.id,
                            fromNodeName: c.getAttrByPath('text/text'),
                            toNode: targetNode.id,
                            toNodeName: targetNode?.getAttrByPath('text/text'),
                            productCode: presetInput?.productCode,
                            productName: presetInput?.productName,
                            routeType: edgeType,
                            routeDetailDto: c.data.config,
                            inputOutputRatio: edgeLabel,
                            groupTag: sourceNode?.getAttrByPath('text/text')
                        })
                    })
                } else {
                    process.routeProductDetailList?.push({
                        fromNode: sourceNode?.id,
                        fromNodeName: sourceNode?.getAttrByPath('text/text'),
                        toNode: targetNode.id,
                        toNodeName: targetNode?.getAttrByPath('text/text'),
                        routeType: edgeType,
                        productCode: presetInput?.productCode,
                        productName: presetInput?.productName,
                        routeDetailDto: sourceNode?.data.config,
                        inputOutputRatio: edgeLabel
                    })
                }
            }
        });
        return process;
    }
}
