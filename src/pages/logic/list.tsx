import { Button, Card, Layout, Modal, Space, Table, message } from "antd"
import { Link } from "umi"
import { useCallback, useEffect, useState } from "react"
import { addLogic, deleteLogic, queryLogics } from "@/services/logicSvc"
import { CloseOutlined, CopyOutlined, DeleteOutlined, EditFilled, EditOutlined, FileAddOutlined, PlusOutlined } from "@ant-design/icons"
import FormRender from "@/components/step-flow-editor/component/FormRender"
import { useForm } from "form-render"


export default function LogicList(props) {
    const [items, setItems] = useState([])
    const [openAdd, setOpenAdd] = useState(false)
    const [loading, setLoading] = useState(false);
    const form = useForm();
    const query = useCallback(() => {
        setLoading(true);
        queryLogics().then(res => {
            setItems(res.result.items)
            setLoading(false);
        }).catch(err => {
            message.error(err.message);
            setLoading(false);
        })
    }, [])
    const columns = [
        {
            key: 'btn',
            title: '操作',
            dataIndex: 'id',
            width: '100px',
            render: (_, record) => (<Space>
                <Link to={`/assets/logic/i/${record.id}/edit`} target='_blank'><EditOutlined /></Link >
                <CloseOutlined style={{ color: 'red' }} onClick={() => {
                    Modal.confirm({
                        title: '确认删除',
                        content: '确认删除此业务逻辑吗？',
                        okText: '确认',
                        cancelText: '取消',
                        onOk: () => {
                            deleteLogic(record.id).then((res) => {
                                query()
                            })
                        }
                    }
                    )
                }} />
            </Space>)
        },
        {
            key: 'name',
            title: '业务逻辑名称',
            width: '200px',
            dataIndex: 'name',
        },
        {
            key: 'module',
            title: '模块名',
            width: '200px',
            dataIndex: 'module',
        },
        {
            key: 'path',
            title: 'path',
            dataIndex: 'id',
            render: (_, record) => <span>{`/logic/v1/run-api/${record.id}`}<Button icon={<CopyOutlined />} type='text'
                onClick={() => {
                    navigator.clipboard.writeText(`/logic/v1/run-api/${record.id}`);
                }}></Button></span>
        },
        {
            key: 'id',
            title: 'ID',
            dataIndex: 'id',
            // render: (_, record) => <Link to={`/logic/${record.id}`} target="blank">{record.id}</Link>
        }
    ]
    useEffect(() => {
        query()
    }, [])
    return <Layout>
        <Layout.Content>
            <Card style={{ marginBottom: '5px' }}>
                <Button type="primary" icon={<PlusOutlined />} style={{ margin: '5px' }}
                    onClick={() => setOpenAdd(true)}
                >新建编排</Button>
            </Card>
            <Table
                loading={loading}
                columns={columns}
                dataSource={items}
            />
            <Modal open={openAdd} footer={false} title='新建编排'
                onCancel={() => setOpenAdd(false)}>
                <FormRender
                    style={{ margin: '10px' }}
                    form={form}
                    schema={{
                        "type": "object",
                        "properties": {
                            "id": {
                                "title": "唯一编号",
                                "type": "string",
                                "widget": "input"
                            },
                            "module": {
                                "title": "模块名",
                                "type": "string",
                                "widget": "input"
                            },
                            "name": {
                                "title": "业务名称",
                                "type": "string",
                                "widget": "input"
                            }
                        },
                    }}
                    footer={() => < Button type="primary" style={{ width: '200px' }} onClick={async () => {
                        const formData = form.getValues();
                        setLoading(true)
                        setOpenAdd(false);
                        const newId = await addLogic(formData)
                        setLoading(false)
                        query()
                    }}>保存</Button>}
                // onFinish={async (formData: any) => {

                // }}
                />
            </Modal>
        </Layout.Content>
    </Layout>

}