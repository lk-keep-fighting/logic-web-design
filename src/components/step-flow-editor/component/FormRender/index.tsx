import Form from 'form-render';
import { FRProps } from 'form-render';
import JsonEditor from './ItemExt/JsonEditor';
import JsEditor from './ItemExt/JsEditor';
import React from 'react';
type IFormRender = FRProps

const FormRenderWithCustomWidget = (props: IFormRender) => {
  return (
    <Form
      widgets={{
        json: JsonEditor,
        js: JsEditor
      }}
      {...props}
    />
  );
}
const FormRender = FormRenderWithCustomWidget;
export default FormRenderWithCustomWidget || FormRender;
