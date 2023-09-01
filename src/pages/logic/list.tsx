import { Table } from "antd"
import { Link } from "umi"
import { useEffect, useState } from "react"
import { queryLogics } from "@/services/logicSvc"

const columns = [
    {
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
        width: '10%',
        render: (_, record) => <Link to={`/logic/${record.id}`}>{record.id}</Link>
    },
    {
        key: 'name',
        title: '逻辑名称',
        dataIndex: 'name',
    }
]
export default function LogicList(props) {
    const [items, setItems] = useState([])
    useEffect(() => {
        queryLogics().then(res => {
            setItems(res.data.result.items)
        })
    }, [])
    return <Table columns={columns} dataSource={items} />
}