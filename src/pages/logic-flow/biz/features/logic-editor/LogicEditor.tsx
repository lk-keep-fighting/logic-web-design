// 逻辑编辑器主组件
import React, { useCallback, useState } from 'react';
import { useParams } from 'umi';
import { Graph, Shape } from '@antv/x6';
import { Button, Modal, Spin, message, Typography, Dropdown, MenuProps, Tooltip, Divider } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, PlayCircleTwoTone, RocketTwoTone, SaveOutlined, SettingTwoTone } from '@ant-design/icons';
import { LogicFlowEditor } from '@/components/logic-editor';
import { PresetShapes } from '@/components/logic-editor/shapes/PresetShapes';
import { RegistShape } from '../../settings/RegistExtShape';
import ParamSetting from '../../components/param-setting';
import RunLogic from '../../components/run-logic';
import ImportLogicJson from '../../components/import-logic-json';
import { LogicEditorProvider } from '../../context/LogicEditorContext';
import { useLogicEditor } from '../../hooks/useLogicEditor';
import { ideApiService } from '../../services/api/ideApi';

/**
 * 逻辑编辑器容器组件
 */
const LogicEditorContainer: React.FC = () => {
  const { id } = useParams();
  const [graph, setGraph] = useState<Graph>();
  const [panleNodes, setPanelNodes] = useState<any[]>([]);
  const [customGroups, setCustomGroups] = useState<any[]>([]);
  const [openParamsSetting, setOpenParamsSetting] = useState(false);
  const [openRunLogic, setOpenRunLogic] = useState(false);
  const [openImportJson, setOpenImportJson] = useState(false);
  
  // 使用自定义Hook
  const logicEditor = useLogicEditor(id as string);
  const { state, dispatch } = logicEditor;

  // 注册图形
  React.useEffect(() => {
    RegistShape([...PresetShapes.values()]);
    
    // 获取面板数据
    ideApiService.getPanelData().then(data => {
      setCustomGroups(data.Groups);
      setPanelNodes(data.Nodes);
    });
  }, []);

  // 创建边
  const createEdge = useCallback(() => {
    return new Shape.Edge({
      attrs: {
        line: {
          targetMarker: 'classic',
          stroke: state.lineStyle === '1' ? '#000000' : '#FF9900'
        },
      },
      zIndex: 0,
      data: {
        type: state.lineStyle
      }
    });
  }, [state.lineStyle]);

  // 菜单点击事件
  const onMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'import') {
      setOpenImportJson(true);
    }
  };

  // 处理保存
  const handleSave = useCallback(async () => {
    try {
      await logicEditor.handleSave(graph);
      message.success('保存成功');
    } catch (error: any) {
      message.error(error.message || '保存失败');
    }
  }, [graph, logicEditor]);

  // 处理运行逻辑
  const handleRunLogic = useCallback(async (values: any, model: any) => {
    try {
      setOpenRunLogic(false);
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { params, bizId, headers, bizStartCode, configModel } = values;
      const res = await ideApiService.runLogicOnServer(
        id as string,
        JSON.parse(params),
        bizId,
        bizStartCode,
        model,
        JSON.parse(headers),
        configModel
      );
      
      dispatch({ type: 'SET_LOADING', payload: false });
      
      if (res.data.code === 0) {
        Modal.success({
          title: '执行成功',
          width: '1000px',
          okText: '关闭',
          closable: true,
          content: <div>
            {/* TODO: 替换为实际的调试信息组件 */}
            <div>执行成功，结果：{JSON.stringify(res.data)}</div>
          </div>,
        });
      } else {
        Modal.error({
          title: <span>{res.data.msg}</span>,
          width: '1200px',
          okText: '关闭',
          closable: true,
          content: <div>
            {/* TODO: 替换为实际的调试信息组件 */}
            <div>执行失败，结果：{JSON.stringify(res.data)}</div>
          </div>,
        });
      }
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      Modal.error({
        title: <span>{error.message}</span>,
        width: '1200px',
        okText: '关闭',
        closable: true,
      });
    }
  }, [id, dispatch]);

  // 处理导入逻辑JSON
  const handleImportJson = useCallback((json: string) => {
    setOpenImportJson(false);
    logicEditor.handleImportLogicJson(json, graph);
  }, [graph, logicEditor]);

  const menuItems: MenuProps['items'] = [
    {
      key: 'import',
      label: '导入Json配置',
    }
  ];

  return (
    <Spin spinning={state.loading}>
      <LogicFlowEditor
        editorCtx={{ jsTips: Object.fromEntries(state.jsTipMap) }}
        panelData={{
          Nodes: [...panleNodes],
          Groups: [
            {
              name: 'ctrl',
              title: '逻辑控制',
              graphHeight: 360
            },
            {
              name: 'assign',
              title: '变量赋值',
              graphHeight: 100
            },
            ...customGroups
          ],
        }}
        showLeft={state.showLeftPanel}
        graphIns={graph}
        toolElements={[
          <Button
            type="text"
            icon={state.showLeftPanel ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            onClick={() => dispatch({ type: 'TOGGLE_LEFT_PANEL' })}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />,
          <Dropdown.Button 
            type='primary' 
            onClick={handleSave} 
            menu={{ items: menuItems, onClick: onMenuClick }}
          >
            <SaveOutlined />保存
          </Dropdown.Button>,
          <ParamSetting 
            open={openParamsSetting}
            values={{ ...state.dsl }}
            setOpen={() => setOpenParamsSetting(!openParamsSetting)}
            onSubmit={logicEditor.saveFlowSettingAndConvertGraphToDsl}
          >
            <Button
              onClick={() => setOpenParamsSetting(true)}
              icon={<SettingTwoTone style={{ color: '#1677ff' }} />}
            >参数</Button>
          </ParamSetting>,
          <RunLogic 
            open={openRunLogic}
            setOpen={() => setOpenRunLogic(!openRunLogic)}
            values={{ params: state.dsl?.params }}
            onSubmit={handleRunLogic}
          >
            <Button
              onClick={() => setOpenRunLogic(true)}
              icon={<PlayCircleTwoTone style={{ color: '#1677ff' }} />}
            >
              调试
            </Button>
          </RunLogic>,
          <ImportLogicJson 
            onConfirm={handleImportJson} 
            onCancel={() => setOpenImportJson(false)} 
            isOpen={openImportJson} 
          />,
          <Button
            icon={<RocketTwoTone style={{ color: '#1677ff' }} />}
            onClick={() => logicEditor.autoDagreLayout(graph)}
          >布局</Button>,
          <Typography.Text strong style={{ fontSize: '18px' }}>[{state.dsl.name}]</Typography.Text>,
          <Typography.Text>版本:{state.dsl.version}</Typography.Text>,
          <Divider type="vertical" />,
          <Typography.Text>配置模式：<Tooltip title="online:保存即生效;offline:发布后生效">
            {state.env.LOGIC_CONFIG_MODEL === "online" ? '保存即生效' : '发布后生效'}
          </Tooltip></Typography.Text>,
        ]}
        graphJson={state.graphJson}
        onGraphJsonEmpty={logicEditor.appendStartNode}
        createEdge={createEdge}
        edgeTools={['button-remove', 'vertices', 'segments']}
        onSave={handleSave}
        jsTipMap={state.jsTipMap}
        autoLayout={(g) => logicEditor.autoDagreLayout(g)}
        onGraphInsChange={setGraph}
      />
    </Spin>
  );
};

/**
 * 逻辑编辑器主组件
 */
const LogicEditor: React.FC = () => {
  return (
    <LogicEditorProvider>
      <LogicEditorContainer />
    </LogicEditorProvider>
  );
};

export default LogicEditor;
