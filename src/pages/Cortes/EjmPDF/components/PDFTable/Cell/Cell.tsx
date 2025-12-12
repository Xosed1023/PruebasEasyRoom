import { Text, View } from "@react-pdf/renderer"
import React, { CSSProperties } from "react"

export interface CellProps {
    wrapperStyle?: CSSProperties
    width?: string
    textStyle?: CSSProperties
    children?: string | JSX.Element | string[] | number
    backgroundColor?: string
}

const Cell = ({ wrapperStyle, width, textStyle, children, backgroundColor }: CellProps) => {
    return (
        <View style={{ width, ...{ wrapperStyle } }}>
            <Text
                style={{
                    fontWeight: 400,
                    fontSize: 10,
                    fontFamily: "Roboto",
                    paddingTop: 3.5,
                    paddingBottom: 3.5,
                    paddingLeft: 5,
                    paddingRight: 5,
                    backgroundColor,
                    color: "#303030",
                    ...(textStyle as any),
                }}
            >
                {children}
            </Text>
        </View>
    )
}

export default Cell
