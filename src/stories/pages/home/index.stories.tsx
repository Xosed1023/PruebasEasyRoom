import { Meta, StoryFn } from "@storybook/react"

import "../../../variables.css"
import Home from "src/pages/home"

export default {
    title: "Habitaciones/Home",
    component: Home,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {},
} as Meta<typeof Home>

// roomStatus, extraTime, gestIn, limit, value, details, startDate, endDate

const Template: StoryFn<typeof Home> = (args) => <Home />

// Historias
export const Default = Template.bind({})
Default.args = {}
