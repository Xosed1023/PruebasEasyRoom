import { Meta, StoryFn } from "@storybook/react"
import PersonalActivoWidget from "src/shared/widgets/personalActivoWidget/PersonalActivoWidget"

export default {
    title: "Componentes/Widtgets/PersonalActivoRecepción",
    component: PersonalActivoWidget,
    // genera el archivo Docs
    tags: ["autodocs"],
} as Meta<typeof PersonalActivoWidget>

// Define el story para el componente LoaderComponent
const Template: StoryFn<typeof PersonalActivoWidget> = (args) => <PersonalActivoWidget {...args} />

export const ValoresCompletos = Template.bind({})
export const SinValores = Template.bind({})

ValoresCompletos.args = {
    mantenimiento: [],
    camarista: [],
}
SinValores.args = {}
