import { Meta, StoryFn } from "@storybook/react"

import "../../../../variables.css"
import { InputCurrency } from "src/shared/components/forms"

export default {
    title: "Componentes/Forms/InputCurrency",
    component: InputCurrency,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {
        prefixValue: {
            control: { type: "text" },
        },
        placeholder: {
            control: { type: "text" },
        },
        label: {
            control: { type: "text" },
        },
        hinttext: {
            control: { type: "text" },
        },
        errorhinttext: {
            control: { type: "text" },
        },
        style: {
            control: { type: "object" },
        },
        className: {
            control: { type: "text" },
        },
    },
} as Meta<typeof InputCurrency>

const Template: StoryFn<typeof InputCurrency> = (args) => <InputCurrency {...args} />

// Historias
export const Basic = Template.bind({})
Basic.args = {
    label: "Monto",
    hinttext: "Descripción",
}

export const Tooltip = Template.bind({})
Tooltip.args = {
    label: "Monto",
    tooltip: "TODO",
    hinttext: "Descripción",
}

export const Disabled = Template.bind({})
Disabled.args = {
    label: "Monto",
    hinttext: "Descripción",
    disabled: true,
}

export const Error = Template.bind({})
Error.args = {
    label: "Monto",
    errorhinttext: "El campo es requerido",
    error: true,
}

export const CustomStyles = Template.bind({})
CustomStyles.args = {
    label: "Monto",
    errorhinttext: "El campo es requerido",
    error: true,
    style: {
        color: "red",
    },
}
