import * as React from 'react';
import { Renderer } from 'amis';
import { X6Graph } from '@/components/step-flow-editor';


export default class CustomRenderer extends React.Component {
    render() {
        return <X6Graph />
    }
}
Renderer({
    type: 'logic',
    autoVar: true // amis 1.8 之后新增的功能，自动解析出参数里的变量
})(CustomRenderer);
