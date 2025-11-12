import { Meta, StoryFn } from "@storybook/react"

import { InputText } from "../../../../shared/components/forms"
import "../../../../variables.css"
import { IconTrash } from "src/shared/icons"

export default {
    title: "Componentes/Forms/InputText",
    component: InputText,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {
        value: {
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
            control: { type: "text" },
        },
        className: {
            control: { type: "text" },
        },
    },
} as Meta<typeof InputText>

const Template: StoryFn<typeof InputText> = (args) => <InputText {...args} />

// Historias
export const Basic = Template.bind({})
Basic.args = {
    placeholder: "ejemplo@ejemplo.com",
    label: "Email",
    hinttext: "Descripción",
}

export const TooltipInput = Template.bind({})
TooltipInput.args = {
    placeholder: "ejemplo@ejemplo.com",
    label: "Email",
    tooltipInput: {
        title: "This is a tooltip",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
        theme: "light",
        placement: "top",
    },
    hinttext: "Descripción",
}

export const TooltipLabel = Template.bind({})
TooltipLabel.args = {
    placeholder: "ejemplo@ejemplo.com",
    label: "Email",
    tooltipLabel: {
        title: "This is a tooltip",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
        theme: "light",
        placement: "top",
    },
    hinttext: "Descripción",
}

export const Icon = Template.bind({})
Icon.args = {
    placeholder: "ejemplo@ejemplo.com",
    label: "Email",
    hinttext: "Descripción",
    icon: IconTrash,
}

export const Disabled = Template.bind({})
Disabled.args = {
    placeholder: "ejemplo@ejemplo.com",
    label: "Email",
    hinttext: "Descripción",
    disabled: true,
}

export const Filled = Template.bind({})
Filled.args = {
    value: "Hola hola",
    placeholder: "ejemplo@ejemplo.com",
    label: "Email",
    hinttext: "Descripción",
    onChange: () => {
        return
    },
}

export const Error = Template.bind({})
Error.args = {
    placeholder: "ejemplo@ejemplo.com",
    label: "Email",
    errorhinttext: "El campo es requerido",
    error: true,
}

export const MuchoTexto = Template.bind({})
MuchoTexto.args = {
    value: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, non similique?",
    placeholder: "ejemplo@ejemplo.com",
    label: "Email",
    hinttext: "Email del usuario",
    onChange: () => {
        return
    },
}

export const MuchoTextoError = Template.bind({})
MuchoTextoError.args = {
    value: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, non similique?",
    placeholder: "ejemplo@ejemplo.com",
    label: "Email",
    errorhinttext: "El límite de caracteres es de 20",
    onChange: () => {
        return
    },
    error: true,
}

export const EstilosPersonalizados = Template.bind({})
EstilosPersonalizados.args = {
    value: "non similique?",
    placeholder: "ejemplo@ejemplo.com",
    label: "Email",
    errorhinttext: "Estilos personalizados en value",
    onChange: () => {
        return
    },
    error: true,
    style: { color: "red" },
}
