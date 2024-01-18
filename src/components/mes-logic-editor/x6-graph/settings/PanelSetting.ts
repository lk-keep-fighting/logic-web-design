import LogicNodeConfig from '@/components/logic-editor/LogicNodeConfig';
import { StepTypeEnum } from '../../../step-flow-core/types';
import { ports } from './Consts';
import { DefaultShapeExt } from './DefaultSharpExt';
import { PresetNodes } from '@/components/logic-editor/PresetNodes';
export function InitPanelData(
  customNodes?: LogicNodeConfig[],
  customGroup?: any[],
  customSharps?: any[],
) {
  const width = 80;
  const height = 80;
  const commonAttrs = {
    body: {
      fill: '#fff',
      stroke: '#8f8f8f',
      strokeWidth: 1
    },
  };
  const endNode = PresetNodes.get('end');
  const Nodes: LogicNodeConfig[] = [
    endNode,
    // {
    //   shape: 'circle',
    //   // label: 'wait-for-continue',
    //   width: 60,
    //   height: 60,
    //   attrs: {
    //     body: {
    //       ...commonAttrs.body,
    //       // fill: '#d9d9d9',
    //       fill: 'white',
    //     },
    //     text: {
    //       text: '加工工序',
    //       // 'font-weight': 'bolder',
    //     },
    //   },
    //   markup: [
    //     {
    //       tagName: 'circle',
    //       selector: 'body',
    //     },
    //     {
    //       tagName: 'text',
    //       selector: 'label',
    //     }],
    //   ports,
    //   data: {
    //     config: {
    //       type: 'process',
    //       processType: '加工工序'
    //     },
    //   },
    //   // tools: ['node-editor'],
    //   groups: ['process'],
    // },
    // {
    //   shape: 'path',
    //   x: 40,
    //   y: 40,
    //   width,
    //   height: 60,
    //   // 使用 path 属性指定路径的 pathData，相当于指定路径的 refD 属性
    //   // https://x6.antv.vision/zh/docs/api/registry/attr#refdresetoffset
    //   path: 'M3,45 C1.9,45 1,44.2 1,43.1 L29,2.9 C30.1,1.3 31.3,1 32.1,1 L32.1,1 C32.1,1 33.8,1.1 35.1,2.9 L63,43.1 C63,44.1 62.1,45 61,45 L3,45 L3,45 Z',
    //   attrs: {
    //     body: {
    //       ...commonAttrs.body,
    //       // fill: '#d9d9d9',
    //       fill: 'white',
    //     },
    //     text: {
    //       text: '静置工序',
    //       refY: 50,
    //       // 'font-weight': 'bolder',
    //     },
    //   },
    //   ports,
    //   data: {
    //     config: {
    //       type: 'process',
    //       processType: '静置工序'
    //     },
    //   },
    //   groups: ['process'],
    // },
    // {
    //   shape: 'polygon',
    //   x: 600,
    //   y: 70,
    //   width,
    //   height,
    //   points: '0,10 10,0 20,10 10,20',
    //   attrs: {
    //     body: {
    //       ...commonAttrs.body,
    //     },
    //     text: {
    //       text: '检验工序',
    //       // 'font-weight': 'bolder',
    //     },
    //   },
    //   ports,
    //   data: {
    //     config: {
    //       type: 'process',
    //     },
    //   },
    //   groups: ['process'],
    // },
    // {
    //   shape: 'path',
    //   x: 40,
    //   y: 40,
    //   width,
    //   height: 60,
    //   // 使用 path 属性指定路径的 pathData，相当于指定路径的 refD 属性
    //   // https://x6.antv.vision/zh/docs/api/registry/attr#refdresetoffset
    //   path: 'M3,1 C1.9,1 1,1.8 1,2.9 L29,43.1 C30.1,44.7 31.3,45 32.1,45 L32.1,45 C32.1,45 33.8,44.9 35.1,43.1 L63,2.9 C63,1.9 62.1,1 61,1 L3,1 L3,1 Z',
    //   attrs: {
    //     body: {
    //       ...commonAttrs.body,
    //       // fill: '#d9d9d9',
    //       fill: 'white',
    //     },
    //     text: {
    //       text: '配料工序',
    //       refY: 10,
    //       // 'font-weight': 'bolder',
    //     },
    //   },
    //   ports,
    //   data: {
    //     config: {
    //       type: 'process',
    //     },
    //   },
    //   groups: ['process'],
    // },
    // {
    //   x: 40,
    //   y: 40,
    //   width: 100,
    //   height: 50,
    //   ports,
    //   attrs: {
    //     body: {
    //       ...commonAttrs.body,
    //       stroke: 'black',
    //       strokeWidth: 1,
    //       fillOpacity: 0
    //     },
    //     text: {
    //       text: '工序组',
    //       refX: 0,
    //       refY: 10,
    //       'text-anchor': 'start',
    //       // 'font-weight': 'bolder',
    //     },
    //   },
    //   data: {
    //     parent: true,
    //     config: {
    //       type: 'process-group',
    //     },
    //   },
    //   groups: ['process'],
    // }
  ];
  if (customNodes && customNodes.length > 0)
    Array.prototype.push.apply(Nodes, customNodes);
  const Groups: any[] = [
    {
      name: 'process',
      title: '工序',
      graphHeight: 600,
    },
  ];
  if (customGroup && customGroup.length > 0)
    Array.prototype.push.apply(Groups, customGroup);
  const Shapes = DefaultShapeExt;
  if (customSharps && customSharps.length > 0)
    Array.prototype.push.apply(Shapes, customSharps);
  return {
    Shapes,
    Nodes,
    Groups,
  };
}
