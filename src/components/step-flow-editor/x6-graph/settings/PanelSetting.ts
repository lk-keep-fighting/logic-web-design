import { ports } from '@/components/logic-editor/settings/Consts';
import { DefaultShapeExt } from './DefaultSharpExt';
export function InitPanelData(
  customNodes?: any[],
  customGroup?: any[],
  customSharps?: any[],
) {
  const width = 50;
  const height = 50;
  const commonAttrs = {
    body: {
      // fill: '#fff',
      // stroke: '#8f8f8f',
      // strokeWidth: 1,
    },
  };

  const Nodes: any[] = [
    {
      shape: 'circle',
      // label: 'wait-for-continue',
      width,
      height,
      attrs: {
        body: {
          ...commonAttrs.body,
          // fill: '#d9d9d9',
          fill: 'white',
        },
        text: {
          text: '交互点',
          // 'font-weight': 'bolder',
        },
      },
      markup: [
        {
          tagName: 'circle',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'label',
        }],
      ports,
      data: {
        config: {
          type: 'wait-for-continue',
        },
      },
      // tools: ['node-editor'],
      groups: ['global'],
    },
    {
      shape: 'circle',
      label: 'end',
      width,
      height,
      attrs: {
        body: {
          ...commonAttrs.body,
          fill: '#d9d9d9',
        },
        text: {
          text: 'end',
          // 'font-weight': 'bolder',
        },
      },
      markup: [
        {
          tagName: 'circle',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'label',
        }],
      ports,
      data: {
        config: {
          type: 'end',
        },
      },
      // tools: ['node-editor'],
      groups: ['global'],
    },
    // {
    //   sharp: 'rect',
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
    //       text: '分组',
    //       refX: 0,
    //       refY: 10,
    //       'text-anchor': 'start',
    //       // 'font-weight': 'bolder',
    //     },
    //   },
    //   data: {
    //     configSchema: 'group',
    //     parent: true,
    //   },
    //   groups: ['global']
    // },
    // {
    //   shape: 'ExtSharp',
    //   width,
    //   height,
    //   ports,
    //   attrs: {
    //     body: {
    //       // rx: 6,
    //       // ry: 6,
    //       // fill: 'red',
    //       stroke: 'red',
    //       strokeWidth: 3,
    //     },
    //     // image: {
    //     //   x: 10,
    //     //   y: 10,
    //     //   width: 30,
    //     //   height: 30,
    //     //   'xlink:href': '/icons/warning.svg'
    //     // },
    //     text: {
    //       x: 5,
    //       y: 0,
    //       text: '异常\n处理',
    //       fontSize: 15,
    //       // fontWeight: 500,
    //       // textLength: '80',
    //       // lengthAdjust: 'spacing',
    //     },
    //   },
    //   data: {
    //     config: {
    //       type: StepTypeEnum.errorHandler,
    //     },
    //   },
    //   groups: ['global'],
    // },
    {
      shape: 'ExtSharp',
      // label: 'http请求',
      attrs: {
        text: {
          text: 'http请求',
          fontSize: 14,
        },
        image: {
          'xlink:href': '/logic/icons/http.svg',
          width: 20,
          x: 2,
          y: 2,
        },
      },
      data: {
        config: {
          type: 'http',
          method: 'POST',
        },
      },
      ports,
      // tools: ['node-editor'],
      groups: ['biz'],
    },
    {
      shape: 'ExtSharp',
      ports,
      attrs: {
        image: {
          width: 15,
          x: 2,
          y: 2,
          'xlink:href': '/logic/icons/code.svg',
        },
        text: {
          text: 'js脚本',
          fontSize: 14,
        },
      },
      data: {
        config: {
          type: 'js',
        },
      },
      // tools: ['node-editor'],
      groups: ['biz'],
    },
    {
      shape: 'ExtSharp',
      ports,
      attrs: {
        image: {
          width: 15,
          x: 2,
          y: 2,
          'xlink:href': '/logic/icons/code.svg',
        },
        text: {
          text: 'java方法',
          fontSize: 14,
        },
      },
      data: {
        config: {
          type: 'java',
        },
      },
      // tools: ['node-editor'],
      groups: ['biz'],
    },
    {
      shape: 'ExtSharp',
      ports,
      attrs: {
        image: {
          width: 15,
          x: 2,
          y: 2,
          'xlink:href': '/logic/icons/CarbonSubflowLocal.svg',
        },
        text: {
          text: '复用逻辑',
          fontSize: 14,
        },
      },
      data: {
        config: {
          type: 'sub-logic',
        },
      },
      // tools: ['node-editor'],
      groups: ['biz'],
    },
    {
      shape: 'ExtSharp',
      width: 50,
      height,
      label: 'switch',
      attrs: {
        // body: {
        //   refPoints: '0,10 10,0 20,10 10,20',
        //   strokeWidth: 1,
        //   stroke: '#5F95FF',
        //   fill: '#EFF4FF',
        // },
        image: {
          'xlink:href': '/logic/icons/switch.svg',
          width: 45,
          x: 1,
          y: 2,
        },
        text: {
          text: 'switch',
          fontSize: 14,
          // fill: '#5F95FF',
          refX: 0.5,
          refY: '100%',
          refY2: 4,
          textAnchor: 'middle',
          textVerticalAnchor: 'top',
        },
      },
      data: {
        config: {
          type: 'switch',
        },
      },
      ports,
      // tools: ['node-editor'],
      groups: ['ctrl'],
    },
    {
      shape: 'ExtSharp',
      width,
      height,
      attrs: {
        // body: {
        //   refPoints: '0,10 10,0 20,10 10,20',
        //   strokeWidth: 1,
        //   stroke: '#5F95FF',
        //   fill: '#EFF4FF',
        // },
        image: {
          'xlink:href': '/logic/icons/text.svg',
          width: 30,
          x: 8,
          y: 10
        },
        text: {
          text: 'case',
          fontSize: 14,
          // fill: '#5F95FF',
          refX: 0.5,
          refY: '100%',
          refY2: 4,
          textAnchor: 'middle',
          textVerticalAnchor: 'top',
        },
      },
      data: {
        config: {
          type: 'switch-case',
        },
      },
      ports,
      // tools: ['node-editor'],
      groups: ['ctrl'],
    },
    {
      shape: 'ExtSharp',
      width: 50,
      height,
      attrs: {
        // body: {
        //   refPoints: '0,10 10,0 20,10 10,20',
        //   strokeWidth: 1,
        //   stroke: '#5F95FF',
        //   fill: '#EFF4FF',
        // },
        image: {
          'xlink:href': '/logic/icons/text.svg',
          width: 30,
          x: 8,
          y: 10
        },
        text: {
          text: 'default',
          fontSize: 14,
          // fill: '#5F95FF',
          refX: 0.5,
          refY: '100%',
          refY2: 4,
          textAnchor: 'middle',
          textVerticalAnchor: 'top',
        },
      },
      data: {
        config: {
          type: 'switch-default',
        },
      },
      ports,
      // tools: ['node-editor'],
      groups: ['ctrl'],
    },
    {
      shape: 'polygon',
      x: 600,
      y: 70,
      width,
      height,
      points: '0,10 10,0 20,10 10,20',
      attrs: {
        body: {
          ...commonAttrs.body,
        },
        text: {
          text: 'if判断',
          fontSize: 14,
          // fill: '#5F95FF',
          refX: 0.5,
          refY: '100%',
          refY2: 4,
          textAnchor: 'middle',
          textVerticalAnchor: 'top',
        },
      },
      ports,
      data: {
        config: {
          type: 'if',
        },
      },
      groups: ['ctrl'],
    },
    {
      shape: 'ExtSharp',
      width,
      height,
      attrs: {
        // body: {
        //   refPoints: '0,10 10,0 20,10 10,20',
        //   strokeWidth: 1,
        //   stroke: '#5F95FF',
        //   fill: '#EFF4FF',
        // },
        image: {
          'xlink:href': '/logic/icons/delay.svg',
          width: 30,
          x: 8,
          y: 10
        },
        text: {
          text: '等待',
          fontSize: 14,
          // fill: '#5F95FF',
          refX: 0.5,
          refY: '100%',
          refY2: 4,
          textAnchor: 'middle',
          textVerticalAnchor: 'top',
        },
      },
      data: {
        config: {
          type: 'wait',
          timeout: '2000',
        },
      },
      ports,
      // tools: ['node-editor'],
      groups: ['ctrl'],
    },
    // {
    //   shape: 'ExtSharp',
    //   attrs: {
    //     text: {
    //       text: '变量',
    //     },
    //     image: {
    //       'xlink:href': '/icons/text.svg',
    //       width: 12,
    //       x: 3,
    //       y: 3,
    //     },
    //   },
    //   data: {
    //     config: {
    //       type: 'var',
    //     },
    //   },
    //   ports,
    //   groups: ['var'],
    // },
    // {
    //   shape: 'ExtSharp',
    //   attrs: {
    //     text: {
    //       text: '字符串',
    //     },
    //     image: {
    //       'xlink:href': '/icons/text.svg',
    //       width: 12,
    //       x: 3,
    //       y: 3,
    //     },
    //   },
    //   data: {
    //     config: {
    //       type: 'string',
    //     },
    //   },
    //   ports,
    //   groups: ['var'],
    // },
    // {
    //   shape: 'ExtSharp',
    //   attrs: {
    //     text: {
    //       text: '数字',
    //     },
    //     image: {
    //       'xlink:href': '/icons/num.svg',
    //       width: 12,
    //       x: 3,
    //       y: 3,
    //     },
    //   },
    //   data: {
    //     config: {
    //       type: 'num',
    //     },
    //   },
    //   ports,
    //   groups: ['var'],
    // },
  ];
  // let groupNode = getPresetNode('group');
  // groupNode.setGroups(['global']);
  // groupNode.setLabel('分组');
  // groupNode.setConfigSchemel('group');
  // Nodes.push(groupNode)
  if (customNodes && customNodes.length > 0)
    Array.prototype.push.apply(Nodes, customNodes);
  const Groups: any[] = [
    {
      name: 'global',
      title: '全局节点',
      graphHeight: 110,
    },
    // {
    //   name: 'var',
    //   title: '变量声明',
    //   graphHeight: 180,
    // },
    {
      name: 'ctrl',
      title: '逻辑控制',
      graphHeight: 330,
    },
    {
      name: 'biz',
      title: '业务调用',
      graphHeight: 220,
    },
    // {
    //   name: 'def',
    //   title: '其他',
    //   graphHeight: 300,
    // },
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
