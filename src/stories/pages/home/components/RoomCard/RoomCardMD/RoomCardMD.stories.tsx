import { Meta, StoryFn } from "@storybook/react"

import "../../../../../../variables.css"
import { RoomStatus } from "src/pages/home/components/RoomCard/enums/RoomStatus.enum"
import RoomCard from "src/pages/home/components/RoomCard/RoomCard"

export default {
    title: "Habitaciones/RoomCard/MD",
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
    },
} as Meta<typeof RoomCard>

// roomStatus, extraTime, gestIn, limit, value, details, startDate, endDate

const Template: StoryFn<typeof RoomCard> = (args) => <RoomCard {...args} />

// Historias
export const Disponible = Template.bind({})
Disponible.args = {
    size: "md",
    roomStatus: RoomStatus.available,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const EntradaAPie = Template.bind({})
EntradaAPie.args = {
    size: "md",
    roomStatus: RoomStatus.walkingEntrance,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const EntradaCarro = Template.bind({})
EntradaCarro.args = {
    size: "md",
    roomStatus: RoomStatus.carEntrance,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const OcupadaLimpieza = Template.bind({})
OcupadaLimpieza.args = {
    size: "md",
    roomStatus: RoomStatus.occupiedCleaning,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
    cleaningTimeEnd: "2023-11-09T03:48:32.804Z",
}

export const Sucia = Template.bind({})
Sucia.args = {
    size: "md",
    roomStatus: RoomStatus.unclean,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const RoomService = Template.bind({})
RoomService.args = {
    size: "md",
    roomStatus: RoomStatus.roomService,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
    roomServiceTimeEnd: "2023-11-09T03:48:32.804Z",
}

export const Maintenance = Template.bind({})
Maintenance.args = {
    size: "md",
    roomStatus: RoomStatus.maintenance,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const Limpieza = Template.bind({})
Limpieza.args = {
    size: "md",
    roomStatus: RoomStatus.cleaning,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
    cleaningTimeEnd: "2023-11-09T03:48:32.804Z",
}

export const Blocked = Template.bind({})
Blocked.args = {
    size: "md",
    roomStatus: RoomStatus.blocked,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const Reserved = Template.bind({})
Reserved.args = {
    size: "md",
    roomStatus: RoomStatus.reserved,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const Ocupada = Template.bind({})
Ocupada.args = {
    size: "md",
    roomStatus: RoomStatus.occupied,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}
