import { Meta, StoryFn } from "@storybook/react"
import { BooleanButton } from "src/shared/components/forms/boolean-button/BooleanButton"
import "../../../../variables.css"

export default {
    title: "Componentes/Forms/BooleanButton",
    component: BooleanButton,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {
        value: {
            description: "Valor del boton",
            control: {
                type: "boolean",
            },
        },
        onChange: {
            description: "Funcion que se ejecuta cuando el valor cambia",
            control: {
                action: "onChange",
            },
        },
        textTrue: {
            description: "Texto que se muestra cuando el valor es true",
            control: {
                type: "text",
            },
        },
        textFalse: {
            description: "Texto que se muestra cuando el valor es false",
            control: {
                type: "text",
            },
        },
    },
} as Meta<typeof BooleanButton>

const Template: StoryFn<typeof BooleanButton> = (args) => <BooleanButton {...args} />
export const Defauld = Template.bind({})

export const Label = Template.bind({})
Label.args = {
    label: "Texto de los botones ",
}
export const CustomText = Template.bind({})
CustomText.args = {
    textTrue: "Verdadero",
    textFalse: "Falso",
}
