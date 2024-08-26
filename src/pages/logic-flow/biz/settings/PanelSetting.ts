import { ports } from '@/components/logic-editor/settings/Consts';
import { PresetShapes } from '@/components/logic-editor/shapes/PresetShapes';
import LogicNodeConfig from '@/components/logic-editor/types/LogicNodeConfig';
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
    new LogicNodeConfig(
      {
        shape: 'circle',
        width,
        height,
        attrs: {
          body: {
            ...commonAttrs.body,
            fill: 'white',
          },
          text: {
            text: '开始',
            fontSize: 12,
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
            type: 'start',
          },
        },
        // tools: ['node-editor'],
        _groups: ['ctrl'],
      }),
    new LogicNodeConfig(
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
            fontSize: 12,
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
        _groups: ['ctrl'],
      }),
    new LogicNodeConfig(
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
            'xlink:href': '/icons/switch.svg',
            width: 45,
            x: 1,
            y: 2,
          },
          text: {
            text: 'switch',
            // fontSize: 14,
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
        _groups: ['ctrl'],
      }),
    new LogicNodeConfig(
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
            'xlink:href': '/icons/text.svg',
            width: 30,
            x: 8,
            y: 10
          },
          text: {
            text: 'case',
            // fontSize: 14,
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
        _groups: ['ctrl'],
      }),
    new LogicNodeConfig(
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
            'xlink:href': '/icons/text.svg',
            width: 30,
            x: 8,
            y: 10
          },
          text: {
            text: 'default',
            // fontSize: 14,
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
        _groups: ['ctrl'],
      }),
    new LogicNodeConfig(
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
            'xlink:href': '/icons/delay.svg',
            width: 30,
            x: 8,
            y: 10
          },
          text: {
            text: '等待',
            // fontSize: 14,
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
        _groups: ['ctrl'],
      }),
    // new LogicNodeConfig(
    //   {
    //     shape: 'circle',
    //     label: 'end',
    //     width,
    //     height,
    //     attrs: {
    //       body: {
    //         ...commonAttrs.body,
    //         fill: '#d9d9d9',
    //       },
    //       text: {
    //         text: 'end',
    //         // 'font-weight': 'bolder',
    //       },
    //     },
    //     markup: [
    //       {
    //         tagName: 'circle',
    //         selector: 'body',
    //       },
    //       {
    //         tagName: 'text',
    //         selector: 'label',
    //       }],
    //     ports,
    //     data: {
    //       config: {
    //         type: 'end',
    //       },
    //     },
    //     // tools: ['node-editor'],
    //     _groups: ['global'],
    //   }),
    new LogicNodeConfig(
      {
        shape: 'ExtSharp',
        body: {
          rx: 6,
          ry: 6,
          fill: '#0484fb',
          stroke: '#0484fb',
          strokeWidth: 1,
          // stroke: '#5F95FF',
          // strokeWidth: 1,
          // fill: 'rgba(95,149,255,0.05)',
          refWidth: 1,
          refHeight: 1,
        },
        // label: 'http请求',
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
        // tools: ['node-editor'],
        _groups: ['ctrl'],
      }),
    new LogicNodeConfig({
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
          text: 'js脚本',
        },
      },
      data: {
        config: {
          type: 'js',
        },
      },
      // tools: ['node-editor'],
      _groups: ['ctrl'],
    }),
    new LogicNodeConfig(
      {
        shape: 'ExtSharp',
        ports,
        attrs: {
          image: {
            width: 15,
            x: 2,
            y: 2,
            'xlink:href': '/icons/java.svg',
          },
          text: {
            text: 'java方法',
          },
        },
        data: {
          config: {
            type: 'java',
          },
        },
        // tools: ['node-editor'],
        _groups: ['ctrl'],
      }),
    new LogicNodeConfig(
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
            text: '复用逻辑',
          },
        },
        data: {
          config: {
            type: 'sub-logic',
          },
        },
        // tools: ['node-editor'],
        _groups: ['ctrl'],
      }),
  ];
  // let groupNode = getPresetNode('group');
  // groupNode.setGroups(['global']);
  // groupNode.setLabel('分组');
  // groupNode.setConfigSchemel('group');
  // Nodes.push(groupNode)

  if (customNodes && customNodes.length > 0)
    Array.prototype.push.apply(Nodes, customNodes);
  const Shapes = [...PresetShapes.values()]
  return {
    Nodes,
    Shapes
    // Groups,
  };
}
