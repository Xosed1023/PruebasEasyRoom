import { Meta, StoryFn } from "@storybook/react"
import PinDescriptionDetail from "src/shared/components/data-display/pin-description-detail/PinDescriptionDetail"
import "../../../../shared/components/data-display/pin-description-detail/PinDescriptionDetail.css"
import "../../../../variables.css"

export default {
    title: "Componentes/Data Display/PinDescriptionDetail",
    component: PinDescriptionDetail,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {
        people: {
            control: { type: "number" },
        },
    },
} as Meta<typeof PinDescriptionDetail>

const Template: StoryFn<typeof PinDescriptionDetail> = (args) =>
    <div style={{ backgroundColor: "black" }}>

        <PinDescriptionDetail {...args} />
    </div>

// Historias
export const Basic = Template.bind({})
Basic.args = {
    title: 'Orden 001',
    price: '$500',
    subtitle: 'Cubetazo de XX Lager',
    onClickActionIcon: () => console.log("TODO"),
    description: 'Sep, 11 2023 02:05 PM',
    icon: "check",
    actionIcon: "printer"
}