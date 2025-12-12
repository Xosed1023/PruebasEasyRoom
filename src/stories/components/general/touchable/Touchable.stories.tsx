import { useState } from "react"
import type { StoryObj, Meta } from "@storybook/react"
import Touchable from "src/shared/components/general/touchable/Touchable"

export default {
    title: "Componentes/General/Touchable",
    component: Touchable,
    tags: ["autodocs"],
} as Meta<typeof Touchable>

export const Example: StoryObj<typeof Touchable> = (args) => {
    const [active, setActive] = useState<boolean>(false)
    return (
        <div
            style={{
                height: 300,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background:
                    args?.theme === "dark"
                        ? "rgba(14, 14, 14, 0.80)"
                        : "linear-gradient(117deg, #f9f9f9 -38.52%, #fbfbfd 143.35%)",
            }}
        >
            <Touchable {...args} active={active} onClick={() => setActive(!active)}>
                <span
                    style={{
                        color: args?.theme === "dark" ? "var(--white)" : "var(--tipografa)",
                    }}
                >
                    Content
                </span>
            </Touchable>
        </div>
    )
}

Example.args = {
    className: "",
    style: {
        width: 400,
        height: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    active: false,
    theme: "dark",
}
