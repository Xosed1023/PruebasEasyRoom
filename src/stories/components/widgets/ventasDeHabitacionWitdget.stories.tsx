import { Meta, StoryFn } from "@storybook/react"
import VentasDeHabitacionWidget from "src/shared/widgets/ventasDeHabitacionWitdget/ventasDeHabitacionWitdget"

export default {
    title: "Componentes/Widtgets/Ventas de Habitacion",
    component: VentasDeHabitacionWidget,
    // genera el archivo Docs
    tags: ["autodocs"],
} as Meta<typeof VentasDeHabitacionWidget>

// Define el story para el componente LoaderComponent
const Template: StoryFn<typeof VentasDeHabitacionWidget> = (props) => <VentasDeHabitacionWidget {...props} />

export const ValoresCompletos = Template.bind({})
export const SinValores = Template.bind({})

ValoresCompletos.args = {
    reserva: {
        aPie: 10,
        coche: 15,
        percent: 10,
    },
    mostrador: {
        aPie: 32,
        coche: 44,
        percent: 90,
    },
    rooms: 10,
}

SinValores.args = {
    reserva: {
        aPie: 0,
        coche: 0,
        percent: 0,
    },
    mostrador: {
        aPie: 0,
        coche: 0,
        percent: 0,
    },
    rooms: 0,
}
