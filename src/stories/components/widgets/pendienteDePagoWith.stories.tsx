import { Meta, StoryFn } from "@storybook/react"
import PendientesDePagoWit from "src/shared/widgets/pendientesDePagoWit/PendientesDePagoWit"

export default {
    title: "Componentes/Widtgets/Pendientes de pago",
    component: PendientesDePagoWit,
    // genera el archivo Docs
    tags: ["autodocs"],
} as Meta<typeof PendientesDePagoWit>

// Define el story para el componente LoaderComponent
const Template: StoryFn<typeof PendientesDePagoWit> = () => <PendientesDePagoWit />

export const Default = Template.bind({})
