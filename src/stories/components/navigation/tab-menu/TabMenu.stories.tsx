import type { StoryObj, Meta } from "@storybook/react"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import { RouterWrapper, TabsWithRouter, TabsWithState, props } from "./Utils"

export default {
    title: "Componentes/Navigation/TabMenu",
    component: TabMenu,
    tags: ["autodocs"],
} as Meta<typeof TabMenu>

type Story = StoryObj<typeof TabMenu>

export const Example: Story = (args) => <TabMenu {...args} />

export const WithState: Story = (args) => <TabsWithState {...args} />

export const WithReactRouter: Story = (args) => (
    <RouterWrapper>
        <TabsWithRouter {...args} />
    </RouterWrapper>
)

Example.args = props

WithState.args = props

WithReactRouter.args = props
