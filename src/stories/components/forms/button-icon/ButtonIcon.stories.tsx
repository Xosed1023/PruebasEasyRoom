import { Meta, StoryFn } from "@storybook/react"

// IMPORTANTES: si no se aplican las variables y estilos globales que utiliza el componente
import "../../../../variables.css"
import { ButtonIcon } from "src/shared/components/forms/button-icon/ButtonIcon"

export default {
    title: "Componentes/Forms/ButtonIcon",
    component: ButtonIcon,
    // genera el archivo Docs
    tags: ["autodocs"],
} as Meta<typeof ButtonIcon>

const Template: StoryFn<typeof ButtonIcon> = (args) => <ButtonIcon {...args} />

// Historias
export const Normal = Template.bind({})
Normal.args = {
}

export const Large = Template.bind({})
Large.args = {
}
