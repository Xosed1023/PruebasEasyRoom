import { Meta, StoryFn } from "@storybook/react"
import MiniRoomTypeCard from "src/shared/components/data-display/tooltip/MiniRoomTypeCard/MiniRoomTypeCard"
import "../../../../shared/components/forms/button/Button.css"
import "../../../../variables.css"

export default {
    title: "Componentes/Data Display/MiniRoomTypeCard",
    component: MiniRoomTypeCard,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {
        people: {
            control: { type: "number" },
        },
    },
} as Meta<typeof MiniRoomTypeCard>

const Template: StoryFn<typeof MiniRoomTypeCard> = (args) => <MiniRoomTypeCard {...args} />

// Historias
export const Basic = Template.bind({})
Basic.args = {
    people: 2,
    selected: false,
    roomTypeName: "Sencilla con jacuzzi",
    setSelected: () => 1,
}
