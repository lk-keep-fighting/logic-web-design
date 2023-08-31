import { Table } from "antd"
import { Link } from "umi"
import axios from "axios"
import { useEffect, useState } from "react"

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
        axios.post('/api/form/logic/query', {}).then(res => {
            setItems(res.data.result.items)
        })
    }, [])
    return <Table columns={columns} dataSource={items} />
}