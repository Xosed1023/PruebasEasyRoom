import { Meta, StoryFn } from "@storybook/react"

import "../../../../variables.css"
import { TextBox } from "../../../../shared/components/forms"

export default {
    title: "Componentes/Forms/TextBox",
    component: TextBox,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {
        placeholder: {
            control: { type: "text" },
        },
        description: {
            control: { type: "text" },
        },
        hinttext: {
            control: { type: "text" },
        },
        disabled: {
            control: { type: "boolean" },
        },
        style: {
            control: { type: "text" },
        },
        className: {
            control: { type: "text" },
        },
        characterLimit: {
            control: { type: "number" },
        },
    },
} as Meta<typeof TextBox>

const Template: StoryFn<typeof TextBox> = (args) => <TextBox {...args} />

// Historias
export const Basic = Template.bind({})
Basic.args = {
    description: "Descripción",
    placeholder: "Placeholder...",
    hinttext: "Texto de ayuda",
    errorHintText: "Texto de error",
    onChange: (e) => {
        e
    },
}

export const Filled = Template.bind({})
Filled.args = {
    description: "Descripción",
    placeholder: "Placeholder...",
    hinttext: "Texto de ayuda",
    value: "Texto",
    onChange: (e) => {
        if (!Filled.args) {
            return
        }
        Filled.args = { ...Filled.args, value: e.target.value }
    },
}

export const Disabled = Template.bind({})
Disabled.args = {
    description: "Descripción",
    placeholder: "Placeholder...",
    hinttext: "Texto de ayuda",
    disabled: true,
}

export const Error = Template.bind({})
Error.args = {
    description: "Descripción",
    placeholder: "Placeholder...",
    errorHintText: "Texto de ayuda",
    error: true,
    onChange: (e) => {
        e
    },
}

export const ErrorLimited = Template.bind({})
ErrorLimited.args = {
    description: "Descripción",
    placeholder: "Placeholder...",
    errorHintText: "Mensaje de error",
    value: "Texto de ayuda Texto de ayuda Texto de ayuda Texto de ayuda Texto de ayuda Texto de ayuda Texto de ayuda Texto de ayuda Texto de ayuda Texto de ayuda Texto de ayuda Texto de ayuda Texto de ayuda asdas",
    error: true,
    onChange: (e) => {
        e
    },
}

export const EstilosPersonalizados = Template.bind({})
EstilosPersonalizados.args = {
    description: "Descripción",
    placeholder: "Placeholder...",
    hinttext: "Texto de ayuda",
    style: {
        color: "red",
    },
}
