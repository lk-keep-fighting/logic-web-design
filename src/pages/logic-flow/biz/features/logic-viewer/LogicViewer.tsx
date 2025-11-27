// 逻辑查看器主组件
import React, { useEffect, useState } from 'react';
import { useParams } from 'umi';
import { Graph } from '@antv/x6';
import { Spin, Typography } from 'antd';
import { LogicFlowEditor } from '@/components/logic-editor';
import { PresetShapes } from '@/components/logic-editor/shapes/PresetShapes';
import { RegistShape } from '../../settings/RegistExtShape';
import { ideApiService } from '../../services/api/ideApi';

/**
 * 逻辑查看器组件
 */
const LogicViewer: React.FC = () => {
  const [logicData, setLogicData] = useState<any>({});
  const [graphJson, setGraphJson] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [graph, setGraph] = useState<Graph>();
  const { id, version } = useParams();

  // 注册图形
  useEffect(() => {
    RegistShape([...PresetShapes.values()]);
  }, []);

  // 加载逻辑数据
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    ideApiService.getLogicByBak(id, version as string)
      .then(res => {
        setLogicData(res);
        setGraphJson(res.configJson?.visualConfig || {});
      })
      .catch(err => {
        console.error('加载逻辑失败:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, version]);

  return (
    <div>
      <Spin spinning={loading}>
        <LogicFlowEditor
          showLeft={false}
          graphIns={graph}
          isStatic={true}
          toolElements={[
            <span style={{ marginLeft: '25px', color: 'red' }}>逻辑版本：{version}</span>,
            <span style={{ marginLeft: '10px' }}>更新时间：{logicData?.updateTime}</span>,
            <span style={{ marginLeft: '10px' }}>名称：{logicData?.name}</span>,
          ]}
          graphJson={graphJson}
          onGraphInsChange={setGraph}
        />
      </Spin>
    </div>
  );
};

export default LogicViewer;
