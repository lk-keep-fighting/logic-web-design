import React, { useEffect } from 'react';
import { LineDecoder } from '@/utils/StreamHelper';
// import Markdown from 'react-markdown';
import { Editor } from 'amis-ui';
import { Flex, Input, message, Modal, Spin } from 'antd';
import { line } from '@antv/x6/lib/registry/port-layout/line';
import { AMISRenderer } from 'amis/lib/renderers/AMIS';
import { PageRenderById } from '@/components/ui-render';
import { getSourceCode } from '@/services/ideSvc';
import { XStream } from '@ant-design/x';

const AIDebugLog = ({ logicLog, show, onClose }) => {
  const [content, setContent] = React.useState('')
  const [errItemConfig, setErrItemConfig] = React.useState()
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    if (show && logicLog) {
      setContent('')
      fetchData(logicLog);
    }
  }, [show, logicLog]);
  async function fetchData(logicLog) {
    try {
      setLoading(true);
      console.log('开始获取数据', logicLog);
      var itemLogs = logicLog.itemLogs;
      var errItems = itemLogs.filter(i => i.success == false);
      var errItem = errItems[0];
      if (!errItem) {
        message.error('没有找到错误的组件日志');
        setLoading(false);
        onClose && onClose();
        return;
      }
      var errMsg = errItem.msg;
      var config = errItem.config;
      setErrItemConfig(config);
      var type = config.type;
      if (type == 'java') {
        var res = await getSourceCode(config);
        console.log('获取源码', res);
        var sourceCode = '';
        if (res && res.sourceCode) {
          sourceCode = res.sourceCode;
        }
      }
      else if (type == 'js') {
        sourceCode = config.script;
      }
      setCode(sourceCode);
      // const response = await fetch(`http://192.168.44.151:11434/v1/chat/completions`, {
      const response = await fetch(`/api/ide/ai/chat/completions`, {
        method: 'post',
        body: JSON.stringify({
          "model": "qwen2.5-coder:32b",
          "stream": true,
          "messages": [
            {
              "role": "system",
              "content": `1、报错信息:"${errMsg}";2、报错的${type}组件代码:\`\`\`${sourceCode}\`\`\`;。帮我根据以上信息综合分析报错的原因。\n`
            }
          ]
        }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache'
        },
      })
      let curMsg = '';
      for await (const chunk of XStream({
        readableStream: response.body,
      })) {
        console.log('XStream chunk');
        console.log(chunk);
        var jsonV = JSON.parse(chunk.data);
        if(typeof jsonV === 'string') {
          jsonV = JSON.parse(jsonV);
          console.log(typeof jsonV);
        }

        if (jsonV && jsonV.choices && jsonV.choices.length > 0 && jsonV.choices[0].delta && jsonV.choices[0].delta.content) {
          // 处理流式响应
          // console.log('Received chunk:', jsonV.choices[0].delta.content);
          // 将新内容追加到当前消息中
          const newMsg = jsonV.choices[0].delta.content.toString();
          console.log('newMsg:', newMsg);
          console.log('curMsg:', curMsg);
          curMsg += newMsg;
          setContent(curMsg);
        }
      }

      // if (!response.ok) {
      //   throw new Error('Network response was not ok.');
      // }

      // const reader = response.body.getReader();
      // console.log('response.body.getReader()');
      // let curMsg = '';
      // while (true) {
      //   console.log('before read:');
      //   const { done, value } = await reader.read();
      //   console.log('after read:');
      //   console.log('done:', done, 'value:', value);
      //   if (done) {
      //     reader.releaseLock(); // 确保在完成时释放锁
      //     console.log('Stream processing complete');
      //     setLoading(false);
      //     break;
      //   }

      //   const lineDecoder = new LineDecoder();
      //   // 假设 decode 方法返回字符串数组
      //   const content = lineDecoder.decode(value);
      //   console.log('content:', content);
      //   content.forEach(v => {
      //     try {
      //       if (v.length > 0) {
      //         var jsonV = JSON.parse(v.replace('data:', ''));
      //         console.log(jsonV);
      //         if (typeof jsonV === 'string') {
      //           jsonV = JSON.parse(jsonV);
      //           console.log(typeof jsonV);
      //         }
      //         if (jsonV && jsonV.choices && jsonV.choices.length > 0 && jsonV.choices[0].delta && jsonV.choices[0].delta.content) {
      //           // 处理流式响应
      //           // console.log('Received chunk:', jsonV.choices[0].delta.content);
      //           // 将新内容追加到当前消息中
      //           const newMsg = jsonV.choices[0].delta.content
      //           console.log('newMsg:', newMsg);
      //           console.log('curMsg:', curMsg);
      //           curMsg += newMsg;
      //         }
      //       }
      //     } catch (error) {
      //       console.error('Error parsing JSON:', error);
      //     }
      //   });
      //   setContent(curMsg);
      // }
    } catch (error) {
      console.error('请求失败:', error);
      setLoading(false);
    }
  }


  return (
    <Modal open={show} title="AI辅助分析(Beta)"
      width={1000}
      footer={null}
      onCancel={() => {
        onClose && onClose();
      }} >
      <div>
        <PageRenderById pageId='ai-debug-log' data={{ message: logicLog?.message, content, code, config: errItemConfig }} />
        <Spin style={{ marginLeft: '10px' }} spinning={loading} />
      </div >
    </Modal >

  );
};
export default AIDebugLog;