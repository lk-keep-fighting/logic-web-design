import { ports } from '@/components/logic-editor/settings/Consts';
const width = 50;
const height = 50;
const commonAttrs = {
    body: {
        // fill: '#fff',
        // stroke: '#8f8f8f',
        // strokeWidth: 1,
    },
};
export const LogicItemSharpMapping = {
    "wati-for-continu": {
        shape: 'circle',
        // label: 'wait-for-continue',
        ports,
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
        data: {
            config: {
                type: 'wait-for-continue',
            },
        },
    },
    "js": {
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
        }
    },
    "java": {
        shape: 'ExtSharp',
        ports,
        attrs: {
            image: {
                width: 15,
                x: 2,
                y: 2,
                'xlink:href': '/logic/icons/java.svg',
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
    },
    "switch": {
        shape: 'ExtSharp',
        width: 50,
        height,
        ports,
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
        }
    }
}