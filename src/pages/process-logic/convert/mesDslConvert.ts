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
                //边,当前无自定义边，当有自定义边时这里可能有问题
                edges.push(v);
            } else {
                let config = v.data.config;
                if (config && config.type != 'start') {
                    process.routeProductDetailList?.push({
                        productCode: presetInput?.productCode,
                        productName: presetInput?.productName,
                        routeDetailDto: {
                            ...config
                        }
                    })
                }
            }
        });
        return process;
    }
}
