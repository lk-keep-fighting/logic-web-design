import { useParams, useSearchParams } from "umi";
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { querySwaggers, getSwagger } from "@/services/swaggerSvc";
import { useEffect, useState } from "react";
import { Spin } from "antd";

const SwaggerUIPage = (props) => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false)
    const [tag, setTag] = useState('')
    const [swaggerJsonUrl, setSwaggerJsonUrl] = useState('');
    useEffect(() => {
        setLoading(true)
        getSwagger(id).then(res => {
            console.log('sw res')
            console.log(res)
            const fileInfo: string = res.jsonFile
            const infos = fileInfo.split('|');
            setSwaggerJsonUrl('/file/' + infos[2])
            setLoading(false)
        })
    }, [id]);
    useEffect(() => {
        setTag(searchParams.get('tag'));
    }, [])
    return <div>
        <Spin spinning={loading}>
            <SwaggerUI url={swaggerJsonUrl}
                // filter={tag} 
                />
        </Spin>
    </div >

}
export default SwaggerUIPage;