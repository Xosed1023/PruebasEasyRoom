import { View } from "@react-pdf/renderer"
import { ReactNode } from "react"

const PageCards = ({ children }: { children: ReactNode }) => {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
            {children}
        </View>
    )
}

export default PageCards
