import { Schema } from "form-render";
// import { StepTypeEnum } from "../../../step-flow-core/types";

const common = {
  name: {
    title: '名称',
    type: 'string',
    widget: 'textArea',
    props: {
      rows: 1,
    },
  },
};
export function ConfigSchemaProvider(tplOrType: string) {
  let schema: Schema = {
    type: 'object',
    properties: {},
    column: 1
  }
  switch (tplOrType) {
    case 'switch':
      schema.properties = {
        ...common,
        condition: {
          title: '条件表达式 ',
          type: 'string',
          widget: 'js',
          props: {
            height: 100,
          },
          extra: "直接填写表达式或变量名，如_par.outType"
        },
      };
      break;
    case 'switch-case':
      schema.properties = {
        ...common,
        case: {
          title: 'case值 ',
          type: 'string',
          extra: '值会转换为字符串进行匹配'
        },
      };
      break;
    case 'js':
      schema.properties = {
        ...common,
        script: {
          title: 'js脚本 ',
          type: 'string',
          widget: 'js',
          props: {
            height: 500,
          },
          extra: 'js代码块，可用于简单的逻辑定制，变量赋值等'
        },
      };

      break;
    // case StepTypeEnum.errorHandler:
    //   schema.properties = {
    //     ...common,
    //     script: {
    //       title: '捕获异常时执行的js',
    //       type: 'string',
    //       widget: 'js',
    //       props: {
    //         height: 500,
    //       },
    //     },
    //   };
    //   break;
    case 'http':
      schema.properties = {
        ...common,
        system: {
          title: '系统名 ',
          type: 'string',
          defaultValue: '',
        },
        url: {
          title: '请求URL： ',
          type: 'string',
          widget: 'js',
          props: {
            height: 50,
          },
          extra: 'js代码块，需返回URL字符串'
        },
        method: {
          title: '请求类型：',
          type: 'string',
          props: {
            options: [
              { label: 'POST', value: 'POST' },
              { label: 'GET', value: 'GET' },
              { label: 'PUT', value: 'PUT' },
              { label: 'DELETE', value: 'DELETE' },
            ],
          },
          widget: 'radio',
        },
        headers: {
          title: '请求头(headers) ',
          type: 'string',
          widget: 'js',
          props: {
            height: 200,
          },
          extra: 'js代码块，需返回请求头对象'
        },
        body: {
          title: 'body请求参数',
          type: 'string',
          widget: 'js',
          props: {
            height: 200,
          },
          extra: 'js代码块，需返回body对象'
        },
        return: {
          title: '将response.data赋值给哪个参数？',
          type: 'string',
          widget: 'js',
          props: {
            height: 100,
          },
          extra: '输入局部变量的完整引用，如_var.repData'
        },
        queryParams: {
          title: 'url参数',
          type: 'string',
          widget: 'js',
          props: {
            height: 100,
          },
          extra: 'js代码块，需返回对象，会转换为键值对追加在url中'
        },
        timeout: {
          title: '执行超时时长(ms)',
          defaultValue: 2000,
          type: 'number',
        },
      };
      schema.column = 2;
      break;
    case 'start':
      schema.properties = {
        name: {
          title: '名称',
          type: 'string',
          widget: 'textArea',
          props: {
            rows: 1,
          },
        },
      }
      break;
    // case 'start':
    //   return {
    //     name: {
    //       title: '名称',
    //       type: 'string',
    //       widget: 'textArea',
    //       props: {
    //         rows: 1,
    //       },
    //     },
    //     parames: {
    //       "title": "全局变量",
    //       "description": "类型声明及默认值",
    //       "type": "array",
    //       "items": {
    //         "column": 4,
    //         "type": "object",
    //         "widget": "collapse",
    //         "properties": {
    //           "type": {
    //             "title": "类型",
    //             "type": "string",
    //             "props": {
    //               "options": [
    //                 {
    //                   "label": "文本",
    //                   "value": "string"
    //                 },
    //                 {
    //                   "label": "数值",
    //                   "value": "num"
    //                 },
    //                 {
    //                   "label": "是否",
    //                   "value": "bool"
    //                 },
    //                 {
    //                   "label": "日期",
    //                   "value": "date"
    //                 },
    //                 {
    //                   "label": "List",
    //                   "value": "list"
    //                 },
    //                 {
    //                   "label": "对象",
    //                   "value": "object"
    //                 }
    //               ],
    //               "placeholder": "请选择"
    //             },
    //             "defaultValue": "string",
    //             "maxWidth": "100px",
    //             "span": 8,
    //             "widget": "select"
    //           },
    //           "typeParam": {
    //             "title": "T参数",
    //             "type": "string",
    //             "props": {
    //               "options": [
    //                 {
    //                   "label": "文本",
    //                   "value": "string"
    //                 },
    //                 {
    //                   "label": "数值",
    //                   "value": "num"
    //                 },
    //                 {
    //                   "label": "是否",
    //                   "value": "bool"
    //                 },
    //                 {
    //                   "label": "日期",
    //                   "value": "date"
    //                 },
    //                 {
    //                   "label": "对象",
    //                   "value": "object"
    //                 }
    //               ],
    //               "placeholder": "请选择"
    //             },
    //             "defaultValue": "string",
    //             "maxWidth": "100px",
    //             "span": 8,
    //             "hidden": "{{rootValue.type!='list'}}",
    //             "widget": "select"
    //           },
    //           "name": {
    //             "title": "变量名",
    //             "type": "string",
    //             "maxWidth": "80px",
    //             "span": 8,
    //             "widget": "input"
    //           },
    //           "format": {
    //             "title": "格式化",
    //             "type": "string",
    //             "props": {
    //               "options": [
    //                 {
    //                   "label": "yyyy-MM-dd",
    //                   "value": "yyyy-MM-dd"
    //                 },
    //                 {
    //                   "label": "yy-MM-dd",
    //                   "value": "yy-MM-dd"
    //                 },
    //                 {
    //                   "label": "MM-dd",
    //                   "value": "MM-dd"
    //                 }
    //               ],
    //               "placeholder": "请选择"
    //             },
    //             "maxWidth": "150px",
    //             "hidden": "{{rootValue.type!='date'}}",
    //             "span": 8,
    //             "widget": "select"
    //           },
    //           "default": {
    //             "title": "默认值",
    //             "type": "string",
    //             "hidden": "{{rootValue.type==\"bool\"}}",
    //             "maxWidth": "100px",
    //             "span": 8,
    //             "widget": "input"
    //           },
    //           "switch": {
    //             "title": "是否",
    //             "type": "boolean",
    //             "props": {
    //               "checkedChildren": "true",
    //               "unCheckedChildren": "false"
    //             },
    //             "hidden": "{{rootValue.type!='bool'}}",
    //             "span": 8,
    //             "maxWidth": "340px",
    //             "widget": "switch"
    //           },
    //           "fr-5719": {
    //             "title": "对象定义",
    //             "type": "string",
    //             "hidden": "{{rootValue.type!='object'}}",
    //             "span": 8,
    //             "widget": "json",
    //             "props":{
    //               "height": "100px"
    //             }
    //           }
    //         }
    //       },
    //       "widget": "cardList",
    //       "labelCol": {
    //         "span": 8
    //       },
    //       "wrapperCol": {
    //         "span": 16
    //       }
    //     },
    //     returns: {
    //       "title": "出参声明",
    //       "description": "类型声明及默认值",
    //       "type": "array",
    //       "items": {
    //         "type": "object",
    //         "properties": {
    //           "type": {
    //             "title": "类型",
    //             "type": "string",
    //             "props": {
    //               "options": [
    //                 {
    //                   "label": "文本",
    //                   "value": "string"
    //                 },
    //                 {
    //                   "label": "数值",
    //                   "value": "num"
    //                 }
    //               ],
    //               "placeholder": "请选择"
    //             },
    //             "defaultValue": "string",
    //             "maxWidth": "100px",
    //             "widget": "select"
    //           },
    //           "name": {
    //             "title": "变量名",
    //             "type": "string",
    //             "maxWidth": "80px",
    //             "widget": "input"
    //           },
    //           "default": {
    //             "title": "默认值",
    //             "type": "string",
    //             "maxWidth": "100px",
    //             "widget": "input"
    //           }
    //         }
    //       },
    //       "widget": "tableList"
    //     },
    //     vars: {
    //       "title": "全局变量声明",
    //       "description": "类型声明及默认值",
    //       "type": "array",
    //       "items": {
    //         "type": "object",
    //         "properties": {
    //           "type": {
    //             "title": "类型",
    //             "type": "string",
    //             "props": {
    //               "options": [
    //                 {
    //                   "label": "文本",
    //                   "value": "string"
    //                 },
    //                 {
    //                   "label": "数值",
    //                   "value": "num"
    //                 }
    //               ],
    //               "placeholder": "请选择"
    //             },
    //             "defaultValue": "string",
    //             "maxWidth": "100px",
    //             "widget": "select"
    //           },
    //           "name": {
    //             "title": "变量名",
    //             "type": "string",
    //             "maxWidth": "80px",
    //             "widget": "input"
    //           },
    //           "default": {
    //             "title": "默认值",
    //             "type": "string",
    //             "maxWidth": "100px",
    //             "widget": "input"
    //           }
    //         }
    //       },
    //       "widget": "tableList"
    //     },
    //     // parameter: {
    //     //   title: '入参声明（Json）',
    //     //   type: 'string',
    //     //   widget: 'json',
    //     //   props: {
    //     //     height: 300,
    //     //     // defaultValue: JSON.stringify({ _par: {} }),
    //     //   },

    //     // },
    //     // data: {
    //     //   title: '全局变量声明（Json）',
    //     //   type: 'string',
    //     //   widget: 'json',
    //     //   props: {
    //     //     height: 300,
    //     //     // defaultValue: JSON.stringify({ _par: {} }),
    //     //   },
    //     // },
    //   };
    case 'end':
      schema.properties = {
        name: {
          title: '名称',
          type: 'string',
          widget: 'textArea',
          props: {
            rows: 1,
          },
        },
      };
      break;
    case 'wait':
      schema.properties = {
        name: {
          title: '名称',
          type: 'string',
          widget: 'textArea',
          props: {
            rows: 1,
          },
        },
        timeout: {
          title: '延时设置(ms)',
          defaultValue: 2000,
          type: 'number',
        },
      };
      break;
    // case StepTypeEnum.process:
    //   schema.properties = {
    //     name: {
    //       title: '名称',
    //       type: 'string',
    //       widget: 'textArea',
    //       props: {
    //         rows: 1,
    //       },
    //     },
    //     subProcessName: {
    //       title: '子流程名称',
    //       type: 'string',
    //     },
    //     parameter: {
    //       title: '入参声明(json)',
    //       type: 'string',
    //       widget: 'js',
    //       props: {
    //         height: 200,
    //       },
    //       extra: 'js代码块，返回子流程的入参对象，作为子流程的_par传入'
    //     },
    //     return: {
    //       title: '指定子流程的返回_ret，赋值给哪个参数？',
    //       type: 'string',
    //       widget: 'js',
    //       props: {
    //         height: 100,
    //       },
    //       extra: '输入局部变量的完整引用，如_var.repData'
    //     },
    //   };
    //   break;
    default:
      schema.properties = common;
  }
  return schema;
}
