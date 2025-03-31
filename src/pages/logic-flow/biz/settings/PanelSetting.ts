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
  const Nodes: any[] = [
    new LogicNodeConfig(
      {
        shape: 'wait-for-continue',
        // label: 'wait-for-continue',
        width,
        height,
        ports,
        data: {
          config: {
            type: 'wait-for-continue',
            name: '交互点'
          },
        },
        _groups: ['ctrl'],
      }),
      new LogicNodeConfig(
        {
          shape: 'wait',
          width,
          height,
          // attrs: {
          //   // body: {
          //   //   refPoints: '0,10 10,0 20,10 10,20',
          //   //   strokeWidth: 1,
          //   //   stroke: '#5F95FF',
          //   //   fill: '#EFF4FF',
          //   // },
          //   image: {
          //     'xlink:href': '/logic/icons/delay.svg',
          //     width: 30,
          //     x: 8,
          //     y: 10
          //   },
          //   text: {
          //     text: '等待',
          //     // fontSize: 14,
          //     // fill: '#5F95FF',
          //     refX: 0.5,
          //     refY: '100%',
          //     refY2: 4,
          //     textAnchor: 'middle',
          //     textVerticalAnchor: 'top',
          //   },
          // },
          data: {
            config: {
              type: 'wait',
              name: '等待',
              timeout: '2000',
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
        label: 'switch',
        attrs: {
          image: {
            'xlink:href': '/logic/icons/switch.svg',
            width: 45,
            x: 1,
            y: 2,
          },
          body: {
            strokeWidth: 0
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
            name: 'switch',
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
          body: {
            strokeWidth: 0
          },
          image: {
            'xlink:href': '/logic/icons/text.svg',
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
            name: 'case',
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
          body: {
            strokeWidth: 0
          },
          image: {
            'xlink:href': '/logic/icons/texts.svg',
            width: 30,
            x: 8,
            y: 10
          },
          text: {
            text: '多值case',
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
            type: 'switch-cases',
            name: '多值case',
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
          body: {
            strokeWidth: 0
          },
          image: {
            'xlink:href': '/logic/icons/text.svg',
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
            name: 'default',
          },
        },
        ports,
        // tools: ['node-editor'],
        _groups: ['ctrl'],
      }),
    new LogicNodeConfig(
      {
        shape: 'http',
        width: 100,
        height,
        text: 'http请求',
        data: {
          config: {
            type: 'http',
            name: 'http请求',
            method: 'POST',
          },
        },
        ports,
        // tools: ['node-editor'],
        _groups: ['ctrl'],
      }),
    new LogicNodeConfig({
      shape: 'js',
      width: 100,
      height,
      ports,
      imgSrc: '/logic/icons/code.svg',
      text: 'js脚本',
      data: {
        config: {
          name: 'js脚本',
          type: 'js',
        },
      },
      // tools: ['node-editor'],
      _groups: ['ctrl'],
    }),
    new LogicNodeConfig(
      {
        shape: 'java',
        ports,
        width: 100,
        height,
        text: 'java方法',
        data: {
          config: {
            name: 'java方法',
            type: 'java',
          },
        },
        _groups: ['ctrl'],
      }),
    new LogicNodeConfig(
      {
        shape: 'sub-logic',
        ports,
        width: 100,
        height,
        data: {
          config: {
            name: '复用逻辑',
            type: 'sub-logic',
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
        attrs: {
          body: {
            // refPoints: '0,10 10,0 20,10 10,20',
            strokeWidth: 1,
            stroke: 'red',
            fill: 'red',
          },
          image: {
            'xlink:href': '/logic/icons/assign-global.svg',
            width: 30,
            x: 8,
            y: 10
          },
          text: {
            text: '全局变量',
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
            name: '全局变量',
            type: 'assign-global',
          }
        },
        ports,
        // tools: ['node-editor'],
        _groups: ['assign'],
      }
    ),
    new LogicNodeConfig(
      {
        shape: 'ExtSharp',
        width: 50,
        height,
        attrs: {
          body: {
            // refPoints: '0,10 10,0 20,10 10,20',
            strokeWidth: 1,
            stroke: '#ff9300',
            fill: '#ff9300',
          },
          image: {
            'xlink:href': '/logic/icons/assign-local.svg',
            width: 30,
            x: 8,
            y: 10
          },
          text: {
            text: '局部变量',
            // fontSize: 14,
            // fill: '#edbc07',
            refX: 0.5,
            refY: '100%',
            refY2: 4,
            textAnchor: 'middle',
            textVerticalAnchor: 'top',
          },
        },
        data: {
          config: {
            name: '局部变量',
            type: 'assign-local',
          }
        },
        ports,
        // tools: ['node-editor'],
        _groups: ['assign'],
      }
    )
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
