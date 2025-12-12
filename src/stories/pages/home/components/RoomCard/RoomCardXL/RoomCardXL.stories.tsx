import { Meta, StoryFn } from "@storybook/react"

import "../../../../../../variables.css"
import { RoomStatus } from "src/pages/home/components/RoomCard/enums/RoomStatus.enum"
import RoomCard from "src/pages/home/components/RoomCard/RoomCard"

export default {
    title: "Habitaciones/RoomCard/XL",
    component: RoomCard,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {
        roomTypeName: {
            control: { type: "text" },
        },
        roomStatus: {
            control: { ...RoomStatus },
        },
        extraTime: {
            control: { type: "number" },
        },
        startDate: {
            control: { type: "number" },
        },
        endDate: {
            control: { type: "number" },
        },
        timeLimit: {
            control: { type: "number" },
        },
        timeValue: {
            control: { type: "number" },
        },
        cleaningTimeStart: {
            control: { type: "number" },
        },
        cleaningTimeEnd: {
            control: { type: "number" },
        },
        roomServiceTimeStart: {
            control: { type: "number" },
        },
        roomServiceTimeEnd: {
            control: { type: "number" },
        },
        reservedTimeStart: {
            control: { type: "number" },
        },
        reservedTimeEnd: {
            control: { type: "number" },
        },
        gestIn: {
            control: { type: "boolean" },
        },
        reserveDetails: {
            cotrol: { type: "text" },
        },
    },
} as Meta<typeof RoomCard>

// roomStatus, extraTime, gestIn, limit, value, details, startDate, endDate

const Template: StoryFn<typeof RoomCard> = (args) => <RoomCard {...args} />

// Historias
export const Disponible = Template.bind({})
Disponible.args = {
    size: "xl",
    roomStatus: RoomStatus.available,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const EntradaAPie = Template.bind({})
EntradaAPie.args = {
    size: "xl",
    roomStatus: RoomStatus.walkingEntrance,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const EntradaCarro = Template.bind({})
EntradaCarro.args = {
    size: "xl",
    roomStatus: RoomStatus.carEntrance,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const OcupadaLimpieza = Template.bind({})
OcupadaLimpieza.args = {
    size: "xl",
    roomStatus: RoomStatus.occupiedCleaning,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
    cleaningTimeEnd: "2023-11-09T03:48:32.804Z",
}

export const Sucia = Template.bind({})
Sucia.args = {
    size: "xl",
    roomStatus: RoomStatus.unclean,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const RoomService = Template.bind({})
RoomService.args = {
    size: "xl",
    roomStatus: RoomStatus.roomService,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
    roomServiceTimeEnd: "2023-11-09T03:48:32.804Z",
}

export const Maintenance = Template.bind({})
Maintenance.args = {
    size: "xl",
    roomStatus: RoomStatus.maintenance,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const Blocked = Template.bind({})
Blocked.args = {
    size: "xl",
    roomStatus: RoomStatus.blocked,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const Reserved = Template.bind({})
Reserved.args = {
    size: "xl",
    roomStatus: RoomStatus.reserved,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
    reservedDetails: "Rosas amarillas en",
}

// limpieza: el tiempo de limpieza avanza automaticamente, por lo tanto se activa la alerta sin querer, para probar su estado normal es necesarioaumentar el valor del attr cleaningTimeEnd
export const Limpieza = Template.bind({})
Limpieza.args = {
    size: "xl",
    roomStatus: RoomStatus.cleaning,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
    cleaningTimeEnd: "2023-11-09T03:48:32.804Z",
}

export const Ocupada = Template.bind({})
// startDate > 0 y endDate > 0 muestra de fecha ... al .... y detalle de reserva
// si gestIn True muestra nombre, num personas y barra de progreso
// si timeValue > 0 y startDate > 0 y gestIn false muestra calendarCross
Ocupada.args = {
    size: "xl",
    roomStatus: RoomStatus.occupied,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}
