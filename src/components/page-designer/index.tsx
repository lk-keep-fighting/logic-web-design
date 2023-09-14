
import * as React from 'react';
import { Editor } from 'amis-editor';
// import 'amis/lib/themes/cxd.css';
// import 'amis/lib/helper.css';
// import 'amis/sdk/iconfont.css';
import 'amis-editor-core/lib/style.css';
interface IPageDesingerProps {
    preview: boolean;
    isMobile: boolean;
    onChange: any;
    pageSchmea: any;
}
class PageDesinger extends React.Component<IPageDesingerProps, any> {
    render() {
        let amisScoped;
        let theme = 'cxd';
        let locale = 'zh-CN';
        const { pageSchmea, preview, isMobile, onChange } = this.props;
        // 请勿使用 React.StrictMode，目前还不支持
        return (
            <Editor
                value={pageSchmea}
                isMobile={isMobile}
                preview={preview}
                onChange={onChange}
            />
        );
    }
}

export default PageDesinger;