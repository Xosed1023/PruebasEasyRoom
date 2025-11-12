import React, { CSSProperties, ReactNode } from "react"
import { View } from "@react-pdf/renderer"

const Table = ({ children, border, style }: { children?: ReactNode; border?: string; style?: CSSProperties }) => {
    return (
        <View style={{ border: border ? border : "0.5px solid var(--placeholder))", ...(style as any) }}>
            {children}
        </View>
    )
}

export default Table
