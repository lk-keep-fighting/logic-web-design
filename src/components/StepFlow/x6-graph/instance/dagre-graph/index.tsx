import { forwardRef } from "react";
import './index.css'

const DagreGraph = forwardRef((props, ref) => {
    return (<div className='drag-graph' ref={ref}>
    </div>)
})
export default DagreGraph;