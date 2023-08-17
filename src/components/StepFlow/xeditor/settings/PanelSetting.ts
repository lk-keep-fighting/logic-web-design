import { StepTypeEnum } from '../../core/definition/StepFlow';
import { DefaultSharpExt } from './DefaultSharpExt';
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
  const ports = {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
    },
    items: [
      {
        group: 'top',
      },
      {
        group: 'right',
      },
      {
        group: 'bottom',
      },
      {
        group: 'left',
      },
    ],
  };

  const Nodes: any[] = [
    {
      shape: 'circle',
      label: 'start',
      width,
      height,
      attrs: {
        body: {
          ...commonAttrs.body,
        },
        text: {
          fontSize: 12,
        },
      },
      ports,
      data: {
        config: {
          type: 'start',
          parameter: '{\r\n    \r\n}',
          data: '{\r\n    \r\n}',
        },
      },
      tools: ['node-editor'],
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
      },
      ports,
      data: {
        config: {
          type: 'end',
        },
      },
      tools: ['node-editor'],
      groups: ['global'],
    },
    {
      shape: 'ExtSharp',
      ports,
      attrs: {
        body: {
          rx: 6,
          ry: 6,
          stroke: 'red',
          strokeWidth: 1,
        },
        // image: {
        //     x: 4,
        //     y: 4,
        //     width: 16,
        //     height: 16,
        //     'xlink:href': '/icons/warning.svg'
        // },
        text: {
          x: 4,
          text: '全局异常处理',
          fontSize: 12,
          fontWeight: 600,
          textLength: '80',
          lengthAdjust: 'spacing',
        },
      },
      data: {
        config: {
          type: StepTypeEnum.errorHandler,
        },
      },
      groups: ['global'],
    },
    {
      shape: 'ExtSharp',
      attrs: {
        text: {
          text: 'http请求',
        },
        image: {
          'xlink:href': '/icons/http.svg',
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
      tools: ['node-editor'],
      groups: ['def'],
    },
    {
      shape: 'polygon',
      width,
      label: 'switch',
      height,
      attrs: {
        body: {
          refPoints: '0,10 10,0 20,10 10,20',
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
        },
        text: {
          // text: 'switch',
          // fontSize: 12,
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
      tools: ['node-editor'],
      groups: ['def'],
    },
    {
      shape: 'ExtSharp',
      ports,
      attrs: {
        image: {
          width: 15,
          x: 2,
          y: 2,
          'xlink:href': '/icons/code.svg',
        },
        text: {
          text: 'js代码块',
        },
      },
      data: {
        config: {
          type: 'js',
        },
      },
      tools: ['node-editor'],
      groups: ['def'],
    },
    {
      shape: 'ExtSharp',
      ports,
      attrs: {
        image: {
          width: 15,
          x: 2,
          y: 2,
          'xlink:href': '/icons/CarbonSubflowLocal.svg',
        },
        text: {
          text: '引用流程',
        },
      },
      data: {
        config: {
          type: 'process',
        },
      },
      tools: ['node-editor'],
      groups: ['def'],
    },
    {
      shape: 'ExtSharp',
      attrs: {
        text: {
          text: '延时',
        },
        image: {
          'xlink:href': '/icons/delay.svg',
          width: 12,
          x: 3,
          y: 3,
        },
      },
      data: {
        config: {
          type: 'wait',
          timeout: '2000',
        },
      },
      ports,
      tools: ['node-editor'],
      groups: ['def'],
    },
  ];
  if (customNodes && customNodes.length > 0)
    Array.prototype.push.apply(Nodes, customNodes);
  const Groups: any[] = [
    {
      name: 'global',
      title: '全局节点',
      graphHeight: 180,
    },
    {
      name: 'def',
      title: '默认节点',
      graphHeight: 270,
    },
  ];
  if (customGroup && customGroup.length > 0)
    Array.prototype.push.apply(Groups, customGroup);
  const Sharps = DefaultSharpExt;
  if (customSharps && customSharps.length > 0)
    Array.prototype.push.apply(Sharps, customSharps);
  return {
    Sharps,
    Nodes,
    Groups,
  };
}
