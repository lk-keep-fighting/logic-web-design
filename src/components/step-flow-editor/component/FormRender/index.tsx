import Form from 'form-render';
import { FRProps } from 'form-render';
import JsonEditor from './ItemExt/JsonEditor';
import JsEditor from './ItemExt/JsEditor';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import React, { useEffect } from 'react';
type IFormRender = FRProps

const FormRenderWithCustomWidget = (props: IFormRender) => {
  useEffect(() => {
    loader.config({ monaco });
  }, [])
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
