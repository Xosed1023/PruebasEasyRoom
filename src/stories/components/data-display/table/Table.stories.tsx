import { Meta, StoryFn } from "@storybook/react"
import Table from "src/shared/components/data-display/table/Table"
import "../../../../shared/components/forms/button/Button.css"
import "../../../../variables.css"
import { incidenciasItems } from "./incidencias.constant"
import { reservasItems } from "./reservas.constant"

export default {
    title: "Componentes/Data Display/Table",
    component: Table,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {},
} as Meta<typeof Table>

const Template: StoryFn<typeof Table> = (args) => <Table {...args} />

// Historias
export const Reservaciones = Template.bind({})
Reservaciones.args = { ...reservasItems }

export const Incidencias = Template.bind({})
Incidencias.args = {
    ...incidenciasItems, onSelectedFilters: (f) => console.log({ f })
}
