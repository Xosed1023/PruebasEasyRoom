import type { StoryObj, Meta } from "@storybook/react"
import { MemoryRouter } from "react-router-dom"
import Screen from "src/shared/components/layout/screen/Screen"

export default {
    title: "Componentes/Layout/Screen",
    component: Screen,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
} as Meta<typeof Screen>

export const Example: StoryObj<typeof Screen> = (args) => {
    return <Screen {...args} />
}

Example.args = {
    className: "",
    contentClassName: "",
    style: {},
    title: "Nombre",
    close: true,
    back: true,
    children: null,
    headerRight: null,
}
