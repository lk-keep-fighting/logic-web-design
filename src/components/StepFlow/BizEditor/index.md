# 示例

## 空编辑器

内置了 start、end、http 请求、switch 判断、执行 js 代码等通用能力，可基于通用能力的配置保存为新的节点。

```jsx
import { Editor } from '@stepflow/editor';
export default () => <Editor />;
```

## 内置节点

包含基本变量声明、http 请求、逻辑判断、js 代码执行、获取上一节点返回、打印日志、延时等待的业务编排。

- 试一试：在下面点击【在浏览器运行】

```jsx
import { Editor } from '@stepflow/editor';
const config = {
  steps: [
    {
      type: 'start',
      data: '{\n    "d": 1\n}',
      name: 'start',
      id: '57888774-6a04-4479-accb-dffa84c22488',
      nextStepId: '10debbad-7229-49fa-8f67-0dbbd180706d',
    },
    {
      type: 'http',
      method: 'GET',
      name: 'http请求',
      system: '',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
      timeout: 2000,
      id: '10debbad-7229-49fa-8f67-0dbbd180706d',
      nextStepId: '4365f176-23f7-48fe-836e-41d397bc5062',
    },
    {
      type: 'switch',
      name: 'd是否=1',
      condition: '_ctx.data.d',
      id: '4365f176-23f7-48fe-836e-41d397bc5062',
      branches: [
        { when: '1', nextStepId: '174362e3-f39e-4a6e-a5bd-4152184cb75d' },
        { when: '2', nextStepId: 'aef00410-e9cc-43a3-8985-b025ae7ff3a9' },
      ],
    },
    {
      type: 'js',
      name: '打印上一节点返回',
      script:
        '_ctx.flow.log("执行分支true")\n_ctx.flow.log("打印上一节点返回")\n_ctx.flow.log(_ctx.lastRet)\nreturn _ctx.lastRet;',
      id: '174362e3-f39e-4a6e-a5bd-4152184cb75d',
      nextStepId: 'b4e3f8cd-6f7c-4182-82c5-ed45aa586f15',
    },
    { type: 'end', id: 'b4e3f8cd-6f7c-4182-82c5-ed45aa586f15', name: 'end' },
    {
      type: 'wait',
      timeout: 5000,
      name: '延时',
      id: 'aef00410-e9cc-43a3-8985-b025ae7ff3a9',
      nextStepId: '80c7c37e-fb41-4d5e-8477-0d5e97a5639f',
    },
    {
      type: 'js',
      name: 'js代码块',
      script: '_ctx.flow.log("执行分支false")',
      id: '80c7c37e-fb41-4d5e-8477-0d5e97a5639f',
      nextStepId: 'b4e3f8cd-6f7c-4182-82c5-ed45aa586f15',
    },
  ],
  visualConfig: {
    cells: [
      {
        shape: 'edge',
        attrs: {
          line: {
            stroke: '#A2B1C3',
            targetMarker: { name: 'block', width: 12, height: 8 },
          },
        },
        id: 'd32718d2-8a0f-44f7-849c-6a5f4db29eab',
        router: { name: 'er', args: { offset: 'center' } },
        zIndex: 0,
        source: {
          cell: 'aef00410-e9cc-43a3-8985-b025ae7ff3a9',
          port: '19a158ab-c0a8-4826-9963-1d032eaeb4b8',
        },
        target: {
          cell: '80c7c37e-fb41-4d5e-8477-0d5e97a5639f',
          port: '4555f316-b1e9-453a-874e-cc81af4f59ce',
        },
        tools: {
          items: [
            {
              name: 'edge-editor',
              args: { attrs: { backgroundColor: '#fff' } },
            },
          ],
        },
      },
      {
        shape: 'edge',
        attrs: {
          line: {
            stroke: '#A2B1C3',
            targetMarker: { name: 'block', width: 12, height: 8 },
          },
        },
        id: '1c06d3d3-023d-43af-904b-d0d989878fb5',
        router: { name: 'er', args: { offset: 'center' } },
        zIndex: 0,
        source: {
          cell: '80c7c37e-fb41-4d5e-8477-0d5e97a5639f',
          port: '3f3ede92-bdd1-4028-bcba-1fa87eb5e920',
        },
        target: {
          cell: 'b4e3f8cd-6f7c-4182-82c5-ed45aa586f15',
          port: 'eefbf189-7589-4e35-8fc6-f60ff2ec61f3',
        },
        tools: {
          items: [
            {
              name: 'edge-editor',
              args: { attrs: { backgroundColor: '#fff' } },
            },
          ],
        },
      },
      {
        shape: 'edge',
        attrs: {
          line: {
            stroke: '#A2B1C3',
            targetMarker: { name: 'block', width: 12, height: 8 },
          },
        },
        id: '8b3b34b0-dfd3-4833-b286-f8c86fc8776c',
        router: { name: 'er', args: { offset: 'center' } },
        zIndex: 0,
        labels: [
          {
            position: { distance: 113.98290663647151 },
            attrs: { label: { text: '1' } },
          },
        ],
        source: {
          cell: '4365f176-23f7-48fe-836e-41d397bc5062',
          port: '036035af-f04d-4333-8a45-fad5e6b51933',
        },
        target: {
          cell: '174362e3-f39e-4a6e-a5bd-4152184cb75d',
          port: '4555f316-b1e9-453a-874e-cc81af4f59ce',
        },
        tools: {
          items: [
            {
              name: 'edge-editor',
              args: { attrs: { backgroundColor: '#fff' } },
            },
          ],
        },
      },
      {
        shape: 'edge',
        attrs: {
          line: {
            stroke: '#A2B1C3',
            targetMarker: { name: 'block', width: 12, height: 8 },
          },
        },
        id: 'e21089c6-71fd-4228-bacf-9a6f2f41a094',
        router: { name: 'er', args: { offset: 'center' } },
        zIndex: 0,
        labels: [
          {
            position: { distance: 107.98290663647151 },
            attrs: { label: { text: '2' } },
          },
        ],
        source: {
          cell: '4365f176-23f7-48fe-836e-41d397bc5062',
          port: '036035af-f04d-4333-8a45-fad5e6b51933',
        },
        target: {
          cell: 'aef00410-e9cc-43a3-8985-b025ae7ff3a9',
          port: 'dd61c8d1-ec0e-451a-8da3-b01785ced3a7',
        },
        tools: {
          items: [
            {
              name: 'edge-editor',
              args: { attrs: { backgroundColor: '#fff' } },
            },
          ],
        },
      },
      {
        shape: 'edge',
        attrs: {
          line: {
            stroke: '#A2B1C3',
            targetMarker: { name: 'block', width: 12, height: 8 },
          },
        },
        id: 'bcb0961b-c7d8-4d29-8ebf-72a1945f7333',
        router: { name: 'er', args: { offset: 'center' } },
        zIndex: 0,
        source: {
          cell: '174362e3-f39e-4a6e-a5bd-4152184cb75d',
          port: '3f3ede92-bdd1-4028-bcba-1fa87eb5e920',
        },
        target: {
          cell: 'b4e3f8cd-6f7c-4182-82c5-ed45aa586f15',
          port: 'eefbf189-7589-4e35-8fc6-f60ff2ec61f3',
        },
        tools: {
          items: [
            {
              name: 'edge-editor',
              args: { attrs: { backgroundColor: '#fff' } },
            },
          ],
        },
      },
      {
        shape: 'edge',
        attrs: {
          line: {
            stroke: '#A2B1C3',
            targetMarker: { name: 'block', width: 12, height: 8 },
          },
        },
        id: 'e07471a2-4793-4bf5-b962-31648647b213',
        router: { name: 'er', args: { offset: 'center' } },
        zIndex: 0,
        source: {
          cell: '57888774-6a04-4479-accb-dffa84c22488',
          port: 'aa2d5ed0-5531-4044-9094-37b0278ef3d2',
        },
        target: {
          cell: '10debbad-7229-49fa-8f67-0dbbd180706d',
          port: '66c034e0-1003-4556-b275-797d188ab38a',
        },
        tools: {
          items: [
            {
              name: 'edge-editor',
              args: { attrs: { backgroundColor: '#fff' } },
            },
          ],
        },
      },
      {
        shape: 'edge',
        attrs: {
          line: {
            stroke: '#A2B1C3',
            targetMarker: { name: 'block', width: 12, height: 8 },
          },
        },
        id: '0ae9a1c6-7e02-4a44-9ad0-5a87e72cf11c',
        router: { name: 'er', args: { offset: 'center' } },
        zIndex: 0,
        source: {
          cell: '10debbad-7229-49fa-8f67-0dbbd180706d',
          port: '2c6ff8aa-0be9-413c-9dff-3844b33dc11e',
        },
        target: {
          cell: '4365f176-23f7-48fe-836e-41d397bc5062',
          port: '626b84c6-d4aa-4a1c-9906-003fd53b1a44',
        },
        tools: {
          items: [
            {
              name: 'edge-editor',
              args: { attrs: { backgroundColor: '#fff' } },
            },
          ],
        },
      },
      {
        position: { x: -320, y: -100 },
        size: { width: 50, height: 50 },
        attrs: { text: { fontSize: 12, text: 'start' } },
        visible: true,
        shape: 'circle',
        id: '57888774-6a04-4479-accb-dffa84c22488',
        data: {
          config: { type: 'start', data: '{\n    "d": 1\n}', name: 'start' },
        },
        groups: ['global'],
        zIndex: 1,
        tools: { items: ['node-editor'] },
        ports: {
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
                },
              },
            },
          },
          items: [
            { group: 'top', id: '0716bae2-cba4-4202-b180-28198cf3d80d' },
            { group: 'right', id: '1ab5e233-591e-4eae-ba04-aaaf9298a974' },
            { group: 'bottom', id: 'aa2d5ed0-5531-4044-9094-37b0278ef3d2' },
            { group: 'left', id: 'ceec195a-0fb6-4920-ba27-aac1409d21b9' },
          ],
        },
      },
      {
        position: { x: -320, y: 170 },
        size: { width: 50, height: 50 },
        attrs: {
          text: {
            refY: '100%',
            textVerticalAnchor: 'top',
            refY2: 4,
            text: 'd是否=1',
          },
          body: {
            refPoints: '0,10 10,0 20,10 10,20',
            strokeWidth: 1,
            stroke: '#5F95FF',
            fill: '#EFF4FF',
          },
        },
        visible: true,
        shape: 'polygon',
        id: '4365f176-23f7-48fe-836e-41d397bc5062',
        data: {
          config: { type: 'switch', name: 'd是否=1', condition: '_ctx.data.d' },
        },
        groups: ['def'],
        zIndex: 2,
        tools: { items: ['node-editor'] },
        ports: {
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
                },
              },
            },
          },
          items: [
            { group: 'top', id: '626b84c6-d4aa-4a1c-9906-003fd53b1a44' },
            { group: 'right', id: '5fd7397d-dece-4a5c-8f0b-47b9371821a3' },
            { group: 'bottom', id: '036035af-f04d-4333-8a45-fad5e6b51933' },
            { group: 'left', id: 'd1cf72ec-afc4-4fce-8b8b-1a7538a62f04' },
          ],
        },
      },
      {
        position: { x: -245, y: 352 },
        size: { width: 100, height: 50 },
        attrs: {
          image: { 'xlink:href': '/icons/delay.svg', width: 12, x: 3, y: 3 },
          text: { text: '延时' },
        },
        shape: 'ExtSharp',
        id: 'aef00410-e9cc-43a3-8985-b025ae7ff3a9',
        data: { config: { type: 'wait', timeout: 5000, name: '延时' } },
        groups: ['def'],
        zIndex: 3,
        tools: { items: ['node-editor'] },
        ports: {
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
                },
              },
            },
          },
          items: [
            { group: 'top', id: 'dd61c8d1-ec0e-451a-8da3-b01785ced3a7' },
            { group: 'right', id: 'ee0423f5-e422-419a-8a98-7ec238a7c811' },
            { group: 'bottom', id: '19a158ab-c0a8-4826-9963-1d032eaeb4b8' },
            { group: 'left', id: 'cb706709-f3b1-4294-b8f1-65c554e62b26' },
          ],
        },
      },
      {
        position: { x: -245, y: 466 },
        size: { width: 100, height: 50 },
        attrs: {
          image: { width: 15, x: 2, y: 2, 'xlink:href': '/icons/code.svg' },
          text: { text: 'js代码块' },
        },
        shape: 'ExtSharp',
        id: '80c7c37e-fb41-4d5e-8477-0d5e97a5639f',
        data: {
          config: {
            type: 'js',
            name: 'js代码块',
            script: '_ctx.flow.log("执行分支false")',
          },
        },
        groups: ['def'],
        zIndex: 4,
        tools: { items: ['node-editor'] },
        ports: {
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
                },
              },
            },
          },
          items: [
            { group: 'top', id: '4555f316-b1e9-453a-874e-cc81af4f59ce' },
            { group: 'right', id: '372302ba-dfaa-4695-99c6-6be1aa2c773a' },
            { group: 'bottom', id: '3f3ede92-bdd1-4028-bcba-1fa87eb5e920' },
            { group: 'left', id: '5eb87856-ec51-4b19-b0ba-e8163f4c6c64' },
          ],
        },
      },
      {
        position: { x: -320, y: 627 },
        size: { width: 50, height: 50 },
        attrs: { text: { text: 'end' }, body: { fill: '#d9d9d9' } },
        visible: true,
        shape: 'circle',
        id: 'b4e3f8cd-6f7c-4182-82c5-ed45aa586f15',
        data: { config: { type: 'end' } },
        groups: ['global'],
        zIndex: 5,
        tools: { items: ['node-editor'] },
        ports: {
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
                },
              },
            },
          },
          items: [
            { group: 'top', id: 'eefbf189-7589-4e35-8fc6-f60ff2ec61f3' },
            { group: 'right', id: '2b26dfb5-dd2b-4349-84e7-ecd904f5a7ce' },
            { group: 'bottom', id: '1f010c86-7cee-40d8-a8b2-f7e40498cb66' },
            { group: 'left', id: '55eee17a-2442-4609-ae33-a292e3ce11ea' },
          ],
        },
      },
      {
        position: { x: -455, y: 352 },
        size: { width: 100, height: 50 },
        attrs: {
          image: { width: 15, x: 2, y: 2, 'xlink:href': '/icons/code.svg' },
          text: { text: '打印上一节点返回' },
        },
        shape: 'ExtSharp',
        id: '174362e3-f39e-4a6e-a5bd-4152184cb75d',
        data: {
          config: {
            type: 'js',
            name: '打印上一节点返回',
            script:
              '_ctx.flow.log("执行分支true")\n_ctx.flow.log("打印上一节点返回")\n_ctx.flow.log(_ctx.lastRet)\nreturn _ctx.lastRet;',
          },
        },
        groups: ['def'],
        zIndex: 7,
        tools: { items: ['node-editor'] },
        ports: {
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
                },
              },
            },
          },
          items: [
            { group: 'top', id: '4555f316-b1e9-453a-874e-cc81af4f59ce' },
            { group: 'right', id: '372302ba-dfaa-4695-99c6-6be1aa2c773a' },
            { group: 'bottom', id: '3f3ede92-bdd1-4028-bcba-1fa87eb5e920' },
            { group: 'left', id: '5eb87856-ec51-4b19-b0ba-e8163f4c6c64' },
          ],
        },
      },
      {
        position: { x: -345, y: 53 },
        size: { width: 100, height: 50 },
        attrs: {
          image: { 'xlink:href': '/icons/http.svg', width: 20, x: 2, y: 2 },
          text: { text: 'http请求' },
        },
        shape: 'ExtSharp',
        id: '10debbad-7229-49fa-8f67-0dbbd180706d',
        data: {
          config: {
            type: 'http',
            method: 'GET',
            name: 'http请求',
            system: '',
            url: 'https://jsonplaceholder.typicode.com/todos/1',
            timeout: 2000,
          },
        },
        groups: ['def'],
        zIndex: 8,
        tools: { items: ['node-editor'] },
        ports: {
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
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
                  style: { visibility: 'hidden' },
                },
              },
            },
          },
          items: [
            { group: 'top', id: '66c034e0-1003-4556-b275-797d188ab38a' },
            { group: 'right', id: '5ddb4066-a91e-4152-9aee-fddc4faabc8c' },
            { group: 'bottom', id: '2c6ff8aa-0be9-413c-9dff-3844b33dc11e' },
            { group: 'left', id: 'f5911655-7832-4222-b0b3-546e0820d231' },
          ],
        },
      },
    ],
  },
};
export default () => <Editor config={config} showLeft={false} />;
```

PS：通过\_ctx.lastRet 获取上一节点返回值时，若上一节点为 switch 判断，则继续找上一个节点。

## 内置运行时

- 使用默认运行时

```javascript
import { FlowRunner } from '@stepflow/editor';
const flow = new FlowRunner();
//设计完成后保存的json
const config = {……};
//初始化运行时配置
flow.init(config);
//解释运行，通过回调返回最后一个节点的返回值
flow.invoke({},(res)=>{console.log(res)})
```

- 监听日志

```javascript
//监听log
flow.on('log', (msg, type) => {
  console.log(msg);
});
```
