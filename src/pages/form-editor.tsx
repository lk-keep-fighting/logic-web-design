import React from 'react';
import SchemaBuilder from '@xrenders/schema-builder';

const FormEditor = () => {
    return (
        <div style={{ height: '80vh' }}>
            <SchemaBuilder importBtn={true} exportBtn={true} pubBtn={false} />
        </div>
    );
};

export default FormEditor;
