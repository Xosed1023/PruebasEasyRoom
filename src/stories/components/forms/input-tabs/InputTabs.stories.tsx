import { useState } from "react"
import type { StoryObj, Meta } from "@storybook/react"
import InputTabs from "src/shared/components/forms/input-tabs/InputTabs"

export default {
    title: "Componentes/Forms/InputTabs",
    component: InputTabs,
    tags: ["autodocs"],
} as Meta<typeof InputTabs>

export const Example: StoryObj<typeof InputTabs> = (args) => {
    const [value, setValue] = useState<string>("hour")
    return <InputTabs {...args} value={value} onChange={(value) => setValue(value)} />
}

Example.args = {
    className: "",
    containerClassName: "",
    style: {
        width: 300,
    },
    label: "Lorem Lorem",
    items: [
        { label: "Por horas", value: "hour", icon: "timer" },
        { label: "Por noche", value: "night", icon: "calendar" },
    ],
    value: "",
}
