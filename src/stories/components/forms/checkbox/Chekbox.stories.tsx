import { useState } from "react"
import type { StoryObj, Meta } from "@storybook/react"
import Checkbox from "src/shared/components/forms/checkbox/Checkbox"

export default {
    title: "Componentes/Forms/Checkbox",
    component: Checkbox,
    tags: ["autodocs"],
} as Meta<typeof Checkbox>

export const Example: StoryObj<typeof Checkbox> = (args) => {
    const [value, setValue] = useState<boolean>(false)
    return <Checkbox {...args} value={value} onChange={(value) => setValue(value)} />
}

Example.args = {
    className: "",
    style: {},
    label: "Lorem",
    description: "Lorem ipsum",
    disabled: false,
}
