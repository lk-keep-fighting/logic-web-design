import { Button, Card, Layout, Modal, Space, Table, message } from "antd"
import { Link } from "umi"
import { useCallback, useEffect, useState } from "react"
import { addApi, deleteApi, queryApis } from "@/services/apiSvc"
import { CloseOutlined, DeleteOutlined, EditFilled, EditOutlined, FileAddOutlined, PlusOutlined } from "@ant-design/icons"
import FormRender from "@/components/step-flow-editor/component/FormRender"
import { useForm } from "form-render"


export default function LogicList(props) {
    const [items, setItems] = useState([])
    const [openAdd, setOpenAdd] = useState(false)
    const [loading, setLoading] = useState(false);
    const form = useForm();
    const query = useCallback(() => {
        setLoading(true);
        queryApis().then(res => {
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
                <EditOutlined />
                <CloseOutlined style={{ color: 'red' }} onClick={() => {
                    Modal.confirm({
                        title: '确认删除',
                        content: '确认删除此Api吗？',
                        okText: '确认',
                        cancelText: '取消',
                        onOk: () => {
                            deleteApi(record.id).then((res) => {
                                query()
                            })
                        }
                    }
                    )
                }} />
            </Space>)
        },
        {
            key: 'system',
            title: '系统名',
            width: '200px',
            dataIndex: 'system',
        },
        {
            key: 'path',
            title: '路径',
            width: '300px',
            dataIndex: 'path',
        },
        {
            key: 'method',
            title: 'method',
            width: '100px',
            dataIndex: 'method',
        },
        {
            key: 'swagger_id',
            title: '关联swagger',
            width: '200px',
            dataIndex: 'swagger_id',
            render: (_, record) => (<Space><Link to={`/assets/swagger/i/${record.swaggerId}/ui`} target='_blank'>{record.swagger_id}</Link>
            </Space>)
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
            {/* <Card style={{ marginBottom: '5px' }}>
                <Button type="primary" icon={<PlusOutlined />} style={{ margin: '5px' }}
                    onClick={() => setOpenAdd(true)}
                >新建编排</Button>
            </Card> */}
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
                            "name": {
                                "title": "业务名称",
                                "type": "string",
                                "widget": "input"
                            }
                        },
                        // "displayType": "row"
                    }}
                    footer={() => < Button type="primary" style={{ width: '200px' }} onClick={async () => {
                        const formData = form.getValues();
                        setLoading(true)
                        setOpenAdd(false);
                        const newId = await addApi(formData.id, formData.name)
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