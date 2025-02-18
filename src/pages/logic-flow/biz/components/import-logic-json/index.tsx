import { ImportOutlined, SettingTwoTone } from "@ant-design/icons";
import { Editor } from "amis-ui";
import { Button, Input, message, Modal } from "antd";
import { useState } from "react";

const ImportLogicJson = ({ onConfirm, onCancel, isOpen }) => {
    // const [visible, setVisible] = useState(isOpen);
    const [jsonValue, setJsonValue] = useState("");

    const handleOk = () => {
        try {
            onConfirm(jsonValue);
            // setVisible(false);
        } catch (e) {
            message.error(e.message);
        }
    };

    return (
        <>
            {/* <Button
                icon={<ImportOutlined style={{ color: '#1677ff' }} />}
                onClick={() => setVisible(true)}
            >
                导入
            </Button> */}
            <Modal
                title="导入json生成流程图"
                visible={isOpen}
                cancelText="取消"
                okText="确定导入覆盖"
                onOk={handleOk}
                width={800}
                onCancel={() => onCancel()}
            >
                <Editor
                    width={'100%'}
                    height={500}
                    value={jsonValue}
                    allowFullscreen={true}
                    language="json"
                    onChange={(value) => setJsonValue(value)}
                    placeholder="在这里粘贴json"
                />
            </Modal>
        </>
    );
};
export default ImportLogicJson;