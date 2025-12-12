import { Meta, StoryFn } from "@storybook/react"
import { SecurityCode } from "src/shared/components/forms/security-code/SecurityCode"

export default {
    title: "Componentes/Forms/SecurityCode",
    component: SecurityCode,
    // genera el archivo Docs
    tags: ["autodocs"],
    layout: "fullscreen",
    parameters: {
        controls: { hideNoControlsWarning: true },
        docs: {
            description: {
                component: "Componente para ingresar pin de seguridad",
            },
        },
    },
    argTypes: {
        title: {
            description: "Título del modal del componente",
            control: {
                type: "text",
                required: true,
                defaultValue: "Ingresa tu cédula",
            },
        },
        disabled: {
            description: "Deshabilita el componente",
            control: {
                type: "boolean",
                required: false,
                defaultValue: false,
                options: [true, false],
                table: {
                    type: {
                        summary: "boolean",
                        detail: "true | false",
                        required: true,
                        defaultValue: false,
                    },
                },
            },
        },
        onConfirm: {
            description: "Función que se ejecuta al confirmar el pin",
            control: {
                type: "function",
                required: false,
                defaultValue: null,
                table: {
                    type: {
                        summary: "function",
                        detail: "() => void",
                        required: false,
                        defaultValue: null,
                        category: "Functions",
                        subcategory: "Functions",
                    },
                },
            },
        },
        returnValue: {
            description: "funciuon retorna numeros ",
            control: {
                type: "function",
                required: false,
                defaultValue: null,
                table: {
                    type: {
                        summary: "function",
                        detail: "() => void",
                        required: false,
                        defaultValue: null,
                        category: "Functions",
                        subcategory: "Functions",
                    },
                },
            },
        },
        password: {
            description: "Muestra el pin como password",
            control: {
                type: "boolean",
                required: false,
                defaultValue: false,
                options: [true, false],
                table: {
                    type: {
                        summary: "boolean",
                        detail: "true | false",
                    },
                },
            },
        },
    },
} as Meta<typeof SecurityCode>

const Template: StoryFn<typeof SecurityCode> = (args) => (
    <div style={{ height: "400px", contentVisibility: "auto" }}>
        <SecurityCode {...args} />
    </div>
)

export const Default = Template.bind({})
Default.args = {
    title: "Ingresa tu código de seguridad",
}

export const Deseable = Template.bind({})
Deseable.args = {
    title: "No cuentas con los permisos necesarios",
    disabled: true,
}

export const Password = Template.bind({})
Password.args = {
    title: "No cuentas con los permisos necesarios",
    password: true,
    returnValue: (value) => console.log(value),
}
