import { Meta, StoryFn } from "@storybook/react"

import "../../../../variables.css"
import CheckCircle from "src/shared/components/forms/check-circle/CheckCircle"
export default {
    title: "Componentes/Forms/CheckCircle",
    component: CheckCircle,
    // genera el archivo Docs
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: "Componente para manejar el formulario de un check circle",
                title: "CheckCircle",
            },
        },
    },
    argTypes: {
        checked: { control: "boolean", description: "Valor del check circle", defaultValue: false, type: "boolean" },
        disabled: {
            control: "boolean",
            description: "Valor del check circle para deshabilitar el formulario ",
            defaultValue: false,
            type: "boolean",
        },
        onChange: { action: "onChange" },
    },
} as Meta<typeof CheckCircle>

const Template: StoryFn<typeof CheckCircle> = (args) => <CheckCircle {...args} />

// Historias
export const Basic = Template.bind({})
Basic.args = {}

export const Disabled = Template.bind({})
Disabled.args = {
    checked: true,
    disabled: true,
    onChange: (check) => {
        console.log(check)
    },
}
