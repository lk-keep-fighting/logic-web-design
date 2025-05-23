import { Badge } from "antd"
import React from "react"
interface TranRibbonProps {
    text?: React.ReactNode;
    children: React.ReactNode;
}

const TranRibbon: React.FC<TranRibbonProps> = ({ text, children }) => {
    return (
        <div style={{ }}>
            {text ? (
                <Badge.Ribbon text={text}>
                    {children}
                </Badge.Ribbon>
            ) : children}
        </div>
    );
}
export default TranRibbon;