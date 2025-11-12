import { useState } from "react"
import type { StoryObj, Meta } from "@storybook/react"
import Switch from "src/shared/components/forms/switch/Switch"

export default {
    title: "Componentes/Forms/Switch",
    component: Switch,
    tags: ["autodocs"],
} as Meta<typeof Switch>

export const Example: StoryObj<typeof Switch> = (args) => {
    const [value, setValue] = useState<boolean>(false)
    return <Switch {...args} value={value} onChange={(value) => setValue(value)} />
}

Example.args = {
    className: "",
    style: {},
    label: "Lorem",
    description: "Lorem ipsum",
    disabled: false,
}
