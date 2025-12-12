import { Meta, StoryFn } from "@storybook/react"
import OcupacionWidget from "src/shared/widgets/Ocupación/OcupacionWidget"

export default {
    title: "Componentes/Widtgets/Ocupación",
    component: OcupacionWidget,
    // genera el archivo Docs
    tags: ["autodocs"],
} as Meta<typeof OcupacionWidget>

// Define el story para el componente LoaderComponent
const Template: StoryFn<typeof OcupacionWidget> = (props) => <OcupacionWidget {...props} />

export const ValoresCompletos = Template.bind({})
export const SinValores = Template.bind({})

ValoresCompletos.args = {
    percent: 10,
    reachedPercent: 30,
    expectedPercent: 10,
    monthPercent: 10,
}
SinValores.args = {
    percent: 0,
    reachedPercent: 0,
    expectedPercent: 0,
    monthPercent: 0,
}
