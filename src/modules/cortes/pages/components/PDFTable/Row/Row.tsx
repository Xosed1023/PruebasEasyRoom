import { View } from "@react-pdf/renderer"
import { CSSProperties } from "react"
import { CellProps } from "../Cell/Cell"

export interface RowProps {
    children: React.ReactElement<CellProps>[] | React.ReactElement<CellProps>
    border?: string
    backgroundColor?: string
    width?: string
    style?: CSSProperties
}

const Row = ({ children, border, width, backgroundColor, style }: RowProps) => {
    return (
        <View
            style={{
                width: width ? width : "100%",
                backgroundColor,
                display: "flex",
                border,
                flexDirection: "row",
                ...(style as any),
            }}
        >
            {children}
        </View>
    )
}

export default Row
