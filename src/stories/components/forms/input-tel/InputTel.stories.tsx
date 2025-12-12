import { Meta, StoryFn } from "@storybook/react"

import { InputTel } from "../../../../shared/components/forms"
import "../../../../variables.css"
import { options } from "src/shared/components/forms/input-tel/constants/options-tel.constant"

export default {
    title: "Componentes/Forms/InputTel",
    component: InputTel,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {
        prefixValue: {
            control: { type: "text" },
        },
        telValue: {
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
} as Meta<typeof InputTel>

const Template: StoryFn<typeof InputTel> = (args) => <InputTel {...args} />

// Historias
export const Basic = Template.bind({})
Basic.args = {
    label: "Número telefónico",
    hinttext: "Descripción",
}

export const Tooltip = Template.bind({})
Tooltip.args = {
    label: "Número telefónico",
    tooltip: "TODO",
    hinttext: "Descripción",
}

export const Disabled = Template.bind({})
Disabled.args = {
    label: "Número telefónico",
    hinttext: "Descripción",
    disabled: true,
}

export const Filled = Template.bind({})
Filled.args = {
    telValue: "11 1111 1111",
    prefixValue: options[1].value,
    label: "Número telefónico",
    hinttext: "Descripción",
    onInputChange: (e) => e,
}

export const Error = Template.bind({})
Error.args = {
    label: "Número telefónico",
    errorhinttext: "El campo es requerido",
    error: true,
}
