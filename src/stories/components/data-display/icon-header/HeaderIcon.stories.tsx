import type { StoryObj, Meta } from "@storybook/react"
import HeaderIcon from "src/shared/components/data-display/header-icon/HeaderIcon"

export default {
    title: "Componentes/Data Display/Header Icon",
    component: HeaderIcon,
    tags: ["autodocs"],
} as Meta<typeof HeaderIcon>

export const Example: StoryObj<typeof HeaderIcon> = (args) => {
    return <HeaderIcon {...args} />
}

Example.args = {
    icon: "coinsFill",
}
