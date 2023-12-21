
import axios from 'axios';
import copy from 'copy-to-clipboard';
import { Schema, render as renderAmis } from 'amis';
import { ToastComponent, AlertComponent, alert, confirm, toast } from 'amis-ui';
import { useEffect, useState } from 'react';
import { getFormJson } from '@/services/schemeSvc';
import FormRender from '..';
interface IFormRenderByIdProps {
    formId: string
    values?: any
    onSubmit?: any
}
const FormRenderById = (props: IFormRenderByIdProps) => {
    const [formScheme, setFormScheme] = useState({ type: 'page' });
    useEffect(() => {
        getFormJson(props.formId).then(data => {
            setFormScheme(data);
        })
    }, [props.formId])
    function handleBroadcast(type: string, rawEvent: any, data: any) {
        console.log(type);
        console.log(data);
        if (type === 'formSubmited') {
            console.log('内部表单提交了');
            props.onSubmit(data)
        }
    }

    return (
        <FormRender {...props} config={formScheme} />
    );
}

export default FormRenderById;