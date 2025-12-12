import { Meta, StoryFn } from "@storybook/react"
import "../../../../shared/components/forms/button/Button.css"
import "../../../../variables.css"
import { incidenciasItems } from "./incidencias.constant"
import { reservasItems } from "./reservas.constant"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"

export default {
    title: "Componentes/Data Display/FlexibleTable",
    component: FlexibleTable,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {},
} as Meta<typeof FlexibleTable>

const Template: StoryFn<typeof FlexibleTable> = (args) => <FlexibleTable {...args} />

// Historias
export const Reservaciones = Template.bind({})
Reservaciones.args = { ...reservasItems }

export const Incidencias = Template.bind({})
Incidencias.args = {
    ...incidenciasItems, onSelectedFilters: (f) => console.log({ f })
}
