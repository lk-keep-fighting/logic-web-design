import React from 'react';

const styles: any = {
    log: {
        padding: '1px',
        marginBottom: '1px',
        // border: '0.5px solid #ddd',
        // borderRadius: '5px',
        // backgroundColor: '#f9f9f9',
        fontFamily: 'monospace',
        // whiteSpace: 'pre-wrap',
        // wordWrap: 'break-word',
    },
};

function LogBox({ type, data }) {
    let content = null;
    switch (type) {
        case 'axioError':
            content = <span>
                <pre style={{ color: 'red' }}>{data.message}</pre>
                <pre>{data.stack}</pre>
                <pre>config:{JSON.stringify(data.config, null, 2)}</pre>
            </span>;
            break;
        case 'err':
            content = <span>
                <pre style={{ color: 'red' }}>{data.message}</pre>
                <pre>{data.stack}</pre>
            </span>;
            break;
        case 'json':
            content = <pre>{JSON.stringify(data, null, 2)}</pre>;
            break;
        default:
            content = <span>{data}</span>;
            break;
    }

    return <div style={styles.log}>{content}</div>;
}

export default LogBox;