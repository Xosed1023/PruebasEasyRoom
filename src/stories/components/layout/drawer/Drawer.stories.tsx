import { useState } from "react"
import type { StoryObj, Meta } from "@storybook/react"
import Drawer from "src/shared/components/layout/drawer/Drawer"
import { Button } from "src/shared/components/forms"

export default {
    title: "Componentes/Layout/Drawer",
    component: Drawer,
    tags: ["autodocs"],
} as Meta<typeof Drawer>

export const Example: StoryObj<typeof Drawer> = (args) => {
    const [visible, setVisible] = useState<boolean>(false)
    return (
        <div style={{ position: "relative" }}>
            <Button text="Open drawer" onClick={() => setVisible(true)} />
            <Drawer {...args} visible={visible} onClose={() => setVisible(false)} />
        </div>
    )
}

Example.args = {
    className: "",
    style: {},
    bgClassName: "",
    bgStyle: {},
    children: <h1>Reservaciones del día</h1>,
    placement: "top",
    bar: true,
    withBackButton: false,
    withCloseButton: false,
    withMenu: false,
    itemsMenu: [],
}
