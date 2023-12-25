import React, { useState } from 'react';
import { Input, Modal } from 'antd';
interface IEdgeEditorProps {
  open: boolean,
  label: string,
  onSubmit: any
}
const EdgeEditor: React.FC<IEdgeEditorProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(props.open);
  const [label, setLabel] = useState(props.label);

  const handleOk = () => {
    setIsModalOpen(false);
    props.onSubmit(label);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal title="编辑连接线" open={props.open} onOk={handleOk} onCancel={handleCancel}>
        <Input value={label} onChange={v => setLabel(v.target.value)} />
      </Modal>
    </>
  );
};

export default EdgeEditor;
