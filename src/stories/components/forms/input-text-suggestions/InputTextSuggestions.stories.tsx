import { Meta, StoryFn } from "@storybook/react"

import "../../../../variables.css"
import InputTextSuggestions from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"

export default {
    title: "Componentes/Forms/InputTextSuggestions",
    component: InputTextSuggestions,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {
        value: {
            control: { type: "text" },
        },
    },
} as Meta<typeof InputTextSuggestions>

const Template: StoryFn<typeof InputTextSuggestions> = (args) => <InputTextSuggestions {...args} />

// Historias
export const Basic = Template.bind({})
Basic.args = {
    inputTextConfig: {
        placeholder: "Sugerencias ",
        label: "Lorem",
        hinttext: "Lorem itsu",
        type: "text",
    },
    value: "",
    suggestions: ["hola", "adios", "hotel"],
}
