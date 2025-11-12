import { Meta, StoryFn } from "@storybook/react"

import "../../../../../../variables.css"
import { RoomStatus } from "src/pages/home/components/RoomCard/enums/RoomStatus.enum"
import RoomCard from "src/pages/home/components/RoomCard/RoomCard"

export default {
    title: "Habitaciones/RoomCard/XS",
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
    size: "xs",
    roomStatus: RoomStatus.available,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const OcupadaLimpieza = Template.bind({})
OcupadaLimpieza.args = {
    size: "xs",
    roomStatus: RoomStatus.occupiedCleaning,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
    cleaningTimeEnd: "2023-11-09T03:48:32.804Z",
}

export const Sucia = Template.bind({})
Sucia.args = {
    size: "xs",
    roomStatus: RoomStatus.unclean,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
    timeout: true,
}

export const Limpieza = Template.bind({})
Limpieza.args = {
    size: "xs",
    roomStatus: RoomStatus.cleaning,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
    cleaningTimeEnd: "2023-11-09T03:48:32.804Z",
}

export const RoomService = Template.bind({})
RoomService.args = {
    size: "xs",
    roomStatus: RoomStatus.roomService,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
    roomServiceTimeEnd: "2023-11-09T03:48:32.804Z",
}

export const Maintenance = Template.bind({})
Maintenance.args = {
    size: "xs",
    roomStatus: RoomStatus.maintenance,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const Blocked = Template.bind({})
Blocked.args = {
    size: "xs",
    roomStatus: RoomStatus.blocked,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
}

export const Reserved = Template.bind({})
Reserved.args = {
    size: "xs",
    roomStatus: RoomStatus.reserved,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
    gestIn: false,
    timeValue: 1,
    reservedTimeStart: "2023-11-09T03:48:32.804Z",
    reservedTimeEnd: 14,
}

export const Ocupada = Template.bind({})
Ocupada.args = {
    size: "xs",
    roomStatus: RoomStatus.occupied,
    roomTypeName: "suite sencilla",
    roomNumber: '101',
    timeValue: 0,
    extraTime: 0,
    timeLimit: 1,
}
