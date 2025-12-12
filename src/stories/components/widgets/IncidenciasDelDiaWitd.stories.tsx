import { Meta, StoryFn } from "@storybook/react"
import IncidenciasDelDiaWitd from "src/shared/widgets/incidenciasDelDiaWitd"

export default {
    title: "Componentes/Widtgets/IncidenciaDia",
    component: IncidenciasDelDiaWitd,
    // genera el archivo Docs
    tags: ["autodocs"],
} as Meta<typeof IncidenciasDelDiaWitd>

// Define el story para el componente LoaderComponent
const Template: StoryFn<typeof IncidenciasDelDiaWitd> = (args) => <IncidenciasDelDiaWitd {...args} />

export const ValoresCompletos = Template.bind({})
export const SinValores = Template.bind({})

ValoresCompletos.args = {
    abiertas: 2,
    cerradas: 3,
    matutino: 1,
    vespertino: 2,
    nocturno: 2,
    altas: 1,
    medias: 1,
    bajas: 1,
    totalAbiertas: 12,
}
SinValores.args = {
    abiertas: 0,
    cerradas: 0,
    matutino: 0,
    vespertino: 0,
    nocturno: 0,
    altas: 0,
    medias: 0,
    bajas: 0,
    totalAbiertas: 0,
}
