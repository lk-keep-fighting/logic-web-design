import React, { useState, useRef } from 'react';
import './index.css'; // 假设有对应的样式文件
import { Col, Menu, Row, Input, Layout, Button, message } from 'antd';
import { registerRenderer, Renderer } from 'amis';
const ExpressEditor = () => {
  // 状态管理
  const [formula, setFormula] = useState('');
  const [activePanel, setActivePanel] = useState('systemParams');
  const [selectedItem, setSelectedItem] = useState('b_b');
  const formulaInputRef = useRef(null);

  // 数据
  const environmentVariables = [
    { id: 'b_b', name: 'b', type: '字符串' },
    { id: 'c_a', name: 'a', type: '字符串' },
    { id: 'tableOne', name: 'items', type: '数组' },
    { id: 'tableTwo', name: 'success', type: '布尔值' },
  ];

  const textFunctions = [
    { name: 'TXT_CONTRACT', description: '字符串拼接', params: [{ name: 'str1', type: '字符串', description: '字符串1' }, { name: 'str2', type: '字符串', description: '字符串2' }] },
    { name: 'TXT_LEFT', description: '取前缀', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'length', type: '数字', description: '要取的长度' }] },
    { name: 'TXT_RIGHT', description: '去后缀', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'length', type: '数字', description: '要取的长度' }] },
    { name: 'TXT_LOWER', description: '字母转为小写', params: [{ name: 'str', type: '字符串', description: '字符串' }] },
    { name: 'TXT_UPPER', description: '字母转为大写', params: [{ name: 'str', type: '字符串', description: '字符串' }] },
    { name: 'TXT_REPLACE', description: '替换', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'searchValue', type: '字符串', description: '要替换的值' }, { name: 'replaceValue', type: '字符串', description: '替换后的值' }] },
    { name: 'TXT_LEN', description: '获取长度', params: [{ name: 'str', type: '字符串', description: '字符串' }] },
    { name: 'TXT_SUBSTRING', description: '截取字符串', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'start', type: '数字', description: '起始位置' }, { name: 'length', type: '数字', description: '长度' }] },
    { name: 'TXT_CONTAINS', description: '判断字符串是否包含', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'searchValue', type: '字符串', description: '要搜索的值' }] },
    { name: 'TXT_SPLIT', description: '分割字符串', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'separator', type: '字符串', description: '分隔符' }] },
    { name: 'TXT_TRIM', description: '去除首尾空格', params: [{ name: 'str', type: '字符串', description: '字符串' }] },
    { name: 'TXT_STARTS_WITH', description: '判断字符串是否以某个值开头', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'prefix', type: '字符串', description: '前缀' }] },
    { name: 'TXT_ENDS_WITH', description: '判断字符串是否以某个值结尾', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'suffix', type: '字符串', description: '后缀' }] },
    { name: 'TXT_FORMAT', description: '格式化字符串', params: [{ name: 'str', type: '字符串', description: '要格式化的字符串' }, { name: 'args', type: '数组', description: '格式化参数' }] },
    { name: 'TXT_REPLACE_ALL', description: '替换所有匹配的字符串', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'searchValue', type: '字符串', description: '要替换的值' }, { name: 'replaceValue', type: '字符串', description: '替换后的值' }] },
    { name: 'TXT_REPLACE_FIRST', description: '替换第一个匹配的字符串', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'searchValue', type: '字符串', description: '要替换的值' }, { name: 'replaceValue', type: '字符串', description: '替换后的值' }] },
    { name: 'TXT_REPLACE_LAST', description: '替换最后一个匹配的字符串', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'searchValue', type: '字符串', description: '要替换的值' }, { name: 'replaceValue', type: '字符串', description: '替换后的值' }] },
    { name: 'TXT_REPLACE_REGEX', description: '使用正则表达式替换字符串', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'pattern', type: '字符串', description: '正则表达式' }, { name: 'replaceValue', type: '字符串', description: '替换后的值' }] },
    { name: 'TXT_REPLACE_ALL_REGEX', description: '使用正则表达式替换所有匹配的字符串', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'pattern', type: '字符串', description: '正则表达式' }, { name: 'replaceValue', type: '字符串', description: '替换后的值' }] },
    { name: 'TXT_REPLACE_FIRST_REGEX', description: '使用正则表达式替换第一个匹配的字符串', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'pattern', type: '字符串', description: '正则表达式' }, { name: 'replaceValue', type: '字符串', description: '替换后的值' }] },
    { name: 'TXT_REPLACE_LAST_REGEX', description: '使用正则表达式替换最后一个匹配的字符串', params: [{ name: 'str', type: '字符串', description: '字符串' }, { name: 'pattern', type: '字符串', description: '正则表达式' }, { name: 'replaceValue', type: '字符串', description: '替换后的值' }] },
    { name: 'TXT_ESCAPE_HTML', description: '转义HTML字符', params: [{ name: 'str', type: '字符串', description: '字符串' }] },
    { name: 'TXT_UNESCAPE_HTML', description: '取消转义HTML字符', params: [{ name: 'str', type: '字符串', description: '字符串' }] },
    { name: 'TXT_ESCAPE_JSON', description: '转义JSON字符', params: [{ name: 'str', type: '字符串', description: '字符串' }] },
    { name: 'TXT_UNESCAPE_JSON', description: '取消转义JSON字符', params: [{ name: 'str', type: '字符串', description: '字符串' }] },
    { name: 'TXT_ESCAPE_URL', description: '转义URL字符', params: [{ name: 'str', type: '字符串', description: '字符串' }] },
  ];
  const logicFunctions = [
    {
      name: 'TXT_CONTAINS',
      params: [{ name: 'str', type: '字符串', description: '字符串' },]
    },
  ];
  function getParamDes(params: any[]) {
    var description = '';
    if (params != undefined && params.length > 0)
      description = params.map(param => {
        return `${param.description}`;
      }).join(', ');
    return `(${description})`;
  }

  // 在公式中插入选中的项
  const insertToFormula = (item, suffix, offset = 0) => {
    const formulaText = formulaInputRef.current.resizableTextArea.textArea;

    const start = formulaText.selectionStart;
    const end = formulaText.selectionEnd;

    let insertText = item.name + suffix;
    console.log('insertText', insertText);
    console.log('start', start);
    console.log('formulaText', formulaText);
    console.log('formula', formula);
    // 如果有选中内容，则替换选中内容
    if (start !== end) {
      const newText = formula.substring(0, start) + insertText + formula.substring(end);
      setFormula(newText);
    } else {
      // 否则在光标位置插入
      const newText = formula.substring(0, start) + insertText + formula.substring(start);
      setFormula(newText);
    }

    // 将光标移动到插入内容的末尾
    setTimeout(() => {
      formulaText.selectionStart = formulaText.selectionEnd = start + insertText.length - 1;
      formulaInputRef.current.resizableTextArea.textArea.focus();
    }, 0);

    setSelectedItem(item.id);
  };
  // 切换活动面板
  const switchPanel = (panelId) => {
    setActivePanel(panelId);
  };
  function TXT_CONTRACT(str1, str2) {
    return str1 + str2;
  }
  function TXT_LEFT(str, length) {
    return str.substring(0, length);
  }
  function TXT_RIGHT(str, length) {
    return str.substring(str.length - length);
  }

  const menuItems = [
    {
      key: 'systemParams',
      label: '系统参数',
      children: environmentVariables.map(item => ({
        key: item.id,
        label: <span style={{ display: 'flex', justifyContent: 'space-between' }}> {item.name} <span style={{ color: 'gray' }} > {item.type}</ span></span>,
        onClick: () => insertToFormula(item, ''),
      })),
    },
    {
      key: 'textFunctions',
      label: '文字函数',
      children: textFunctions.map(item => ({
        key: item.id,
        label: <span style={{ display: 'flex', justifyContent: 'space-between' }}> {item.name} <span style={{ color: 'gray' }} > {getParamDes(item.params)}</ span></span>,
        onClick: () => insertToFormula(item, getParamDes(item.params), -1),
      })),
    },
    {
      key: 'logicFunctions',
      label: '逻辑判断',
      children: logicFunctions.map(item => ({
        key: item.id,
        label: <span style={{ display: 'flex', justifyContent: 'space-between' }}> {item.name} <span style={{ color: 'gray' }} > {getParamDes(item.params)}</ span></span>,
        description: getParamDes(item.params),
        onClick: () => insertToFormula(item, getParamDes(item.params), -1),
      })),
    },
  ];

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Sider width={500} style={{ background: '#fff' }}>
        <Menu
          style={{ height: '100%', width: '100%' }}
          selectedKeys={[activePanel]}
          mode='inline'
          items={menuItems} onClick={switchPanel} />
      </Layout.Sider>
      <Layout style={{ background: '#fff' }}>
        <Layout.Content style={{ margin: '10px' }}>
          <h2>公式设置</h2>
          {/* 公式编辑区 */}
          <Input.TextArea
            ref={formulaInputRef}
            value={formula}
            style={{ letterSpacing: '0.1em' }}
            onChange={(e) => setFormula(e.target.value)}
          />
          {/* 底部按钮 */}
          <div className="bottom-buttons">
            <Button type='primary' className="confirm-btn" onClick={() => {
              const res = TXT_CONTRACT(TXT_LEFT(TXT_LEFT('Hello', 4), 2), TXT_RIGHT('World', 1));
              message.success(`公式计算结果: ${res}`);
            }}>确定</Button>
            <Button type='primary' className="test-btn">测试</Button>
          </div>
        </Layout.Content>
      </Layout>
    </Layout >
  );
};
export default ExpressEditor;