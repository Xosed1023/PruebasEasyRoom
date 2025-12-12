import { Meta, StoryFn } from "@storybook/react"
import IngresoTotalWithdhet from "src/shared/widgets/ingresoTotalWithdhet/IngresoTotalWithdhet"

export default {
    title: "Componentes/Widtgets/Ingresos Totales",
    component: IngresoTotalWithdhet,
    // genera el archivo Docs
    tags: ["autodocs"],
} as Meta<typeof IngresoTotalWithdhet>

// Define el story para el componente LoaderComponent
const Template: StoryFn<typeof IngresoTotalWithdhet> = (args) => <IngresoTotalWithdhet {...args} />

export const ValoresCompletos = Template.bind({})
export const SinValores = Template.bind({})

ValoresCompletos.args = {
    total: 0,
    data: [],
}

SinValores.args = {
    total: 0,
    data: [],
}
