import { CSSProperties, ReactNode } from "react"
import "./ReportWrapper.css"

const ReportWrapper = ({
    children,
    height,
}: {
    children: ReactNode | ReactNode[]
    height: CSSProperties["height"]
}) => {
    return (
        <div
            className="report__wrapper"
            style={{
                height,
            }}
        >
            {children}
        </div>
    )
}

export default ReportWrapper
