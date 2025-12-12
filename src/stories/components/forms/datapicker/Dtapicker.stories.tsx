import { Meta, StoryFn } from "@storybook/react"
import { DatePicker } from "src/shared/components/forms/datapicker/DatePicker"

export default {
    title: "Componentes/Forms/DatePicker",
    component: DatePicker,
    // genera el archivo Docs
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component:
                    "Componente para seleccionar una fecha, seleccionar un rango de fechas y que en el mismo calendario marque eventos",
            },
        },
    },
    argTypes: {
        range: {
            control: { type: "boolean" },
            description: "Define si se seleccionará un rango de fechas",
            defaultValue: false,
        },
        placeholder: {
            control: { type: "text" },
            description: "Texto que se muestra en el campo de texto de ayuda",
        },
        label: {
            control: { type: "text" },
            description: "Texto que se muestra en la parte superior del input",
        },
        date: {
            control: { type: "array" },
            description: "Array con las fechas seleccionadas",
        },
        event: {
            control: { type: "diseable" },
        },
    },
} as Meta<typeof DatePicker>

// Define el story para el componente DatePickerComponent
const Template: StoryFn<typeof DatePicker> = (args) => (
    <div style={{ height: "400px" }}>
        <DatePicker {...args} />
    </div>
)

export const Default = Template.bind({})

Default.args = {
    range: false,
    placeholder: "Selecciona una fecha",
}

export const Rango = Template.bind({})

Rango.args = {
    range: true,
    placeholder: "Selecciona una fecha",
}

const currentDate = new Date()
const currentMonth = currentDate.getMonth()
const currentYear = currentDate.getFullYear()

const generateDates = () => {
    const dates: Date[] = []
    for (let i = 0; i < 3; i++) {
        const day = Math.floor(Math.random() * 28) + 1 // Genera un día aleatorio entre 1 y 28
        const date = new Date(currentYear, currentMonth, day)
        dates.push(date)
    }
    return dates
}

const datesArray = generateDates()

export const Eventos = Template.bind({})

Eventos.args = {
    range: true,
    placeholder: "Selecciona una fecha",
    event: datesArray,
}

export const FechasPasadas = Template.bind({})

FechasPasadas.args = {
    range: true,
    placeholder: "Selecciona una fecha",
    event: datesArray,
    passSelect:true
}
