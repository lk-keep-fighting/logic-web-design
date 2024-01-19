
import { useEffect, useState } from 'react';
import { getFormJson } from '@/services/schemeSvc';
import FormRender from '..';
interface IFormRenderByIdProps {
    formId: string
    values?: any
    onSubmit?: any
    isStatic?: boolean
}
const FormRenderById = (props: IFormRenderByIdProps) => {
    const [formScheme, setFormScheme] = useState({ type: 'page' });
    useEffect(() => {
        if (props.formId) {
            let formId = props.isStatic ? props.formId + '-static' : props.formId;
            getFormJson(formId).then(data => {
                setFormScheme(data);
            })
        }
    }, [props.formId])

    return (
        <div>
            <FormRender {...props} config={formScheme} />
        </div>
    );
}

export default FormRenderById;