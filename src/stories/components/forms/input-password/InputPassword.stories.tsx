import { Meta, StoryFn } from "@storybook/react"

import { InputPassword } from "../../../../shared/components/forms"
// IMPORTANTES: si no se aplican las variables y estilos globales que utiliza el componente
import "../../../../variables.css"

export default {
    title: "Componentes/Forms/InputPassword",
    component: InputPassword,
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
} as Meta<typeof InputPassword>

const Template: StoryFn<typeof InputPassword> = (args) => <InputPassword {...args} />

// Historias
export const Basic = Template.bind({})
Basic.args = {
    placeholder: "Password",
    label: "Password",
    hinttext: "Contraseña del usuario",
}

export const Filled = Template.bind({})
Filled.args = {
    value: "123456",
    placeholder: "password",
    label: "Password",
    hinttext: "Contraseña del usuario",
    onChange: () => {
        return
    },
}

export const Error = Template.bind({})
Error.args = {
    placeholder: "Password",
    label: "Password",
    errorhinttext: "El campo debe tener 8 o más caracteres, mayúscula y un carácter especial",
    error: true,
}

export const MuchoTexto = Template.bind({})
MuchoTexto.args = {
    value: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, non similique?",
    placeholder: "Password",
    label: "Password",
    hinttext: "Contraseña del usuario",
    onChange: () => {
        return
    },
}

export const MuchoTextoError = Template.bind({})
MuchoTextoError.args = {
    value: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, non similique?",
    placeholder: "Password",
    label: "Password",
    errorhinttext: "El límite de caracteres es de 20",
    onChange: () => {
        return
    },
    error: true,
}

export const EstilosPersonalizados = Template.bind({})
EstilosPersonalizados.args = {
    value: "Lorem",
    placeholder: "Password",
    label: "Password",
    errorhinttext: "Estilos personalizados",
    onChange: () => {
        return
    },
    error: true,
    style: { color: "red" },
}
