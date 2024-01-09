import { Node } from '@antv/x6';
import { ports } from './Consts';
export class LogicNodeConfig {
  constructor(nodeConfig: Node.Config) {
    this.nodeConfig = nodeConfig;
  }
  nodeConfig: Node.Config;
  groups?: any[];
  setLabel(label: string) {
    if (this.nodeConfig.attrs)
      this.nodeConfig.attrs.text.text = label
  }
  setConfigSchemel(type: string) {
    if (this.nodeConfig.data) {
      this.nodeConfig.data.configSchema = type;
      this.nodeConfig.data.config = { type }
    }
    else {
      this.nodeConfig.data = {
        configSchema: type,
        config: { type }
      }
    }
  }
  setConfigData(config: any) {
    if (this.nodeConfig.data) {
      this.nodeConfig.data.config = config;
    }
    else {
      this.nodeConfig.data = {
        config,
      }
    }
  }
}
const width = 80;
const height = 80;
const commonAttrs = {
  body: {
    fill: '#fff',
    stroke: '#8f8f8f',
    strokeWidth: 1
  },
};
const PresetNodes = new Map<'group' | 'end' | 'circle' | 'triangle' | 'triangle2' | 'rhombus' | 'ExtSharp', LogicNodeConfig>();
PresetNodes.set('group', new LogicNodeConfig({
  x: 40,
  y: 40,
  width: 100,
  height: 50,
  ports,
  attrs: {
    body: {
      ...commonAttrs.body,
      stroke: 'black',
      strokeWidth: 1,
      fillOpacity: 0
    },
    text: {
      text: '工序组',
      refX: 0,
      refY: 10,
      'text-anchor': 'start',
      // 'font-weight': 'bolder',
    },
  },
  data: {
    parent: true,
  },
}));
PresetNodes.set('end', new LogicNodeConfig(
  {
    shape: 'circle',
    // label: 'wait-for-continue',
    width: 60,
    height: 60,
    attrs: {
      body: {
        ...commonAttrs.body,
        fill: 'gray',
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
      configScheme: 'end'
    },
    // tools: ['node-editor'],
    // groups: ['process'],
  }));
PresetNodes.set('circle', new LogicNodeConfig(
  {
    shape: 'circle',
    // label: 'wait-for-continue',
    width: 60,
    height: 60,
    attrs: {
      body: {
        ...commonAttrs.body,
        // fill: '#d9d9d9',
        fill: 'white',
      },
      text: {
        text: '',
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
    },
    // tools: ['node-editor'],
    groups: ['process'],
  }));
PresetNodes.set('triangle', new LogicNodeConfig(
  {
    shape: 'path',
    x: 40,
    y: 40,
    width,
    height: 60,
    // 使用 path 属性指定路径的 pathData，相当于指定路径的 refD 属性
    // https://x6.antv.vision/zh/docs/api/registry/attr#refdresetoffset
    path: 'M3,45 C1.9,45 1,44.2 1,43.1 L29,2.9 C30.1,1.3 31.3,1 32.1,1 L32.1,1 C32.1,1 33.8,1.1 35.1,2.9 L63,43.1 C63,44.1 62.1,45 61,45 L3,45 L3,45 Z',
    attrs: {
      body: {
        ...commonAttrs.body,
        // fill: '#d9d9d9',
        fill: 'white',
      },
      text: {
        text: '三角形',
        refY: 50,
        // 'font-weight': 'bolder',
      },
    },
    ports,
    data: {
      config: {
      },
    },
  }));
PresetNodes.set('triangle2', new LogicNodeConfig(
  {
    shape: 'path',
    x: 40,
    y: 40,
    width,
    height: 60,
    // 使用 path 属性指定路径的 pathData，相当于指定路径的 refD 属性
    // https://x6.antv.vision/zh/docs/api/registry/attr#refdresetoffset
    path: 'M3,1 C1.9,1 1,1.8 1,2.9 L29,43.1 C30.1,44.7 31.3,45 32.1,45 L32.1,45 C32.1,45 33.8,44.9 35.1,43.1 L63,2.9 C63,1.9 62.1,1 61,1 L3,1 L3,1 Z',
    attrs: {
      body: {
        ...commonAttrs.body,
        // fill: '#d9d9d9',
        fill: 'white',
      },
      text: {
        text: '配料工序',
        refY: 10,
        // 'font-weight': 'bolder',
      },
    },
    ports,
    data: {
      config: {
        type: 'process',
      },
    },
    groups: ['process'],
  }));
PresetNodes.set('rhombus', new LogicNodeConfig(
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
        text: '检验工序',
        // 'font-weight': 'bolder',
      },
    },
    ports,
    data: {
      config: {
        type: 'process',
      },
    },
    groups: ['process'],
  }));
PresetNodes.set('ExtSharp', new LogicNodeConfig({
  shape: 'ExtSharp',
  // label: 'http请求',
  attrs: {
    text: {
      text: 'http请求',
      fontSize: 14,
    },
    image: {
      // 'xlink:href': '/icons/http.svg',
      width: 20,
      x: 2,
      y: 2,
    },
  },
  ports,
  // tools: ['node-editor'],
}))

export default PresetNodes;