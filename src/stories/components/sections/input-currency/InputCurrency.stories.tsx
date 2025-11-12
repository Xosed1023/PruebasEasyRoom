import { useState } from "react"
import type { StoryObj, Meta } from "@storybook/react"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"

export default {
    title: "Componentes/Sections/InputCurrency",
    component: InputCurrency,
    tags: ["autodocs"],
} as Meta<typeof InputCurrency>

export const Example: StoryObj<typeof InputCurrency> = (args) => {
    const [value, setValue] = useState<number>(0)
    return <InputCurrency {...args} value={value} onChange={(value) => setValue(value)} />
}

Example.args = {
    label: "Lorem Lorem",
    placeholder: "Ingresa el monto",
    value: 0,
    limit: 1000,
    error: false,
    errorhinttext: "Ingresa un monto",
}
