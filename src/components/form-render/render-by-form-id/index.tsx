
import axios from 'axios';
import copy from 'copy-to-clipboard';
import { Schema, render as renderAmis } from 'amis';
import { ToastComponent, AlertComponent, alert, confirm, toast } from 'amis-ui';
import { useEffect, useState } from 'react';
import { getFormJson } from '@/services/schemeSvc';
import FormRender from '..';
import { Affix } from 'antd';
import { Link } from 'umi';
import { EditOutlined } from '@ant-design/icons'
interface IFormRenderByIdProps {
    formId: string
    values?: any
    onSubmit?: any
}
const FormRenderById = (props: IFormRenderByIdProps) => {
    const [formScheme, setFormScheme] = useState({ type: 'page' });
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    useEffect(() => {
        getFormJson(props.formId).then(data => {
            setFormScheme(data);
        })
    }, [props.formId])

    return (
        <div>
            <FormRender {...props} config={formScheme} />
            <Affix offsetBottom={2} target={() => container} style={{ position: 'absolute', right: 16 }}>
                <Link to={`/set/design/form/${props.formId}`} target='_blank' >{<EditOutlined />}</Link>
            </Affix>
        </div>
    );
}

export default FormRenderById;