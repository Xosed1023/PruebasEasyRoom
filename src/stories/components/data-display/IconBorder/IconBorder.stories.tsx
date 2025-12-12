import type { StoryObj, Meta } from "@storybook/react"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"

export default {
    title: "Componentes/Data Display/IconBorder",
    component: IconBorder,
    tags: ["autodocs"],
} as Meta<typeof IconBorder>

export const Example: StoryObj<typeof IconBorder> = (args) => {
    return <IconBorder {...args} >
        <Icon name={"LockFill"} height={30} width={30}></Icon>
    </IconBorder>
}

Example.args = {
    secondaryBgColor: "var(--ocupada-card-1)",
    secondaryBgDiameter: 120,
    primaryBgColor: "var(--pink-ocupado)",
    primaryBgDiameter: 50
}
