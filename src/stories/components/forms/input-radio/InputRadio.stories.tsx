import { Meta, StoryFn } from "@storybook/react"

import "../../../../variables.css"
import { InputRadio } from "../../../../shared/components/forms"

export default {
    title: "Componentes/Forms/InputRadio",
    component: InputRadio,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {
        style: {
            control: { type: "object" },
        },
        className: {
            control: { type: "text" },
        },
        title: {
            control: { type: "text" },
        },
        subtitle: {
            control: { type: "text" },
        },
        disabled: {
            control: { type: "boolean" },
        },
    },
} as Meta<typeof InputRadio>

const Template: StoryFn<typeof InputRadio> = (args) => <InputRadio {...args} />

// Historias
export const Basic = Template.bind({})
Basic.args = {
    title: "Este es un radio",
    subtitle: "Esta es una descripcion",
    value: "value1",
}

export const Disabled = Template.bind({})
Disabled.args = {
    disabled: true,
    title: "Este es un radio disabled",
    subtitle: "Esta es una descripcion",
}

export const CustomStyles = Template.bind({})
CustomStyles.args = {
    style: {
        backgroundColor: "black",
    },
}
