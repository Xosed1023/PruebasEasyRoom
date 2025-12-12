import type { StoryObj, Meta } from "@storybook/react"
import { useState } from "react"
import RoomTabs from "src/shared/components/data-display/room-tabs/RoomTabs"

export default {
    title: "Componentes/Data Display/RoomTabs",
    component: RoomTabs,
    tags: ["autodocs"],
} as Meta<typeof RoomTabs>

export const Example: StoryObj<typeof RoomTabs> = (args) => {
    const [value, setValue] = useState<string>("")
    return (
        <div
            style={{
                height: 300,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EDF0F7",
            }}
        >
            <RoomTabs {...args} value={value} onChange={(value) => setValue(value)} />
        </div>
    )
}

Example.args = {
    className: "",
    style: {
        width: 300,
    },
    items: [
        { label: "501", timer: "48 horas", value: "501" },
        { label: "502", timer: "18 horas", value: "502" },
        { label: "503", timer: "24 horas", value: "503" },
    ],
    value: "",
    onChange: () => null,
}
