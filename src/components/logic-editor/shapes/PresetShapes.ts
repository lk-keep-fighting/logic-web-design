export const PresetShapes = new Map<'ExtSharp', object>();
const width = 50;
const height = 50;
PresetShapes.set('ExtSharp',
    {
        name: 'ExtSharp',
        config: {
            width: 100,
            height,
            attrs: {
                body: {
                    rx: 6,
                    ry: 6,
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: 'rgba(95,149,255,0.05)',
                    refWidth: 1,
                    refHeight: 1,
                },
                image: {
                    // 'xlink:href':
                    //     'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
                    // width: 12,
                    // height: 12,
                    refX: 2,
                    refY: 0,
                },
                text: {
                    refX: 4,
                    refY: 20,
                    fontSize: 12,
                    'text-anchor': 'start',
                },
            },
            markup: [
                {
                    tagName: 'rect',
                    selector: 'body',
                },
                {
                    tagName: 'image',
                    selector: 'image',
                },
                {
                    tagName: 'text',
                    selector: 'label',
                }
            ],
        },
    },)
