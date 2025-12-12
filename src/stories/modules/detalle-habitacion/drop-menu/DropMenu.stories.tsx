import React from "react"
import { StoryObj, Meta } from "@storybook/react"
import DropdownMenu from "src/shared/components/data-display/dropdown-menu/DropdownMenu"
import Icon from "src/shared/icons"

export default {
    title: "DetalleHabitacion/DropdownMenu",
    component: DropdownMenu,
    tags: ["autodocs"],
} as Meta<typeof DropdownMenu>

export const Example: StoryObj<typeof DropdownMenu> = (args) => {
    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <DropdownMenu {...args}></DropdownMenu>
        </div>
    )
}

Example.args = {
    items: [
        { label: "Item1", onClick: () => null },
        { label: "Item2", onClick: () => null },
    ],
    children: <Icon className="drawer__menu-button" name={"menuDots"} width={24} height={24} color="black" />,
    config: { top: 1, left: 10 },
}
