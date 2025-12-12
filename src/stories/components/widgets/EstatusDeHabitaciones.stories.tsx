import { Meta, StoryFn } from "@storybook/react"
import EstatusDeHabitaciones from "src/shared/widgets/estatusDeHabitaciones/EstatusDeHabitaciones"

export default {
    title: "Componentes/Widtgets/Estatus de habitacion",
    component: EstatusDeHabitaciones,
    // genera el archivo Docs
    tags: ["autodocs"],
} as Meta<typeof EstatusDeHabitaciones>

// Define el story para el componente LoaderComponent
const Template: StoryFn<typeof EstatusDeHabitaciones> = () => <EstatusDeHabitaciones />

export const Default = Template.bind({})
