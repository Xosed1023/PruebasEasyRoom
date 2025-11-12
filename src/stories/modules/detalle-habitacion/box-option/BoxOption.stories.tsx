import { useState } from "react"
import type { StoryObj, Meta } from "@storybook/react"
import Component, { BoxOptionMask } from "src/shared/components/forms/box-option/BoxOption"
import { Props } from "src/shared/components/forms/box-option/BoxOption.type"

export default {
    title: "DetalleHabitacion/BoxOption",
    component: Component,
    tags: ["autodocs"],
} as Meta<typeof Component>

const BoxOption = (args: Props) => {
    const [active, setActive] = useState<boolean>(false)
    return <Component {...args} active={active} onClick={() => setActive(!active)} />
}

export const Example: StoryObj<typeof BoxOption> = (args) => {
    return (
        <div
            style={{
                height: 300,
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(117deg, #f9f9f9 -38.52%, #fbfbfd 143.35%)",
            }}
        >
            <BoxOption {...args} iconWithCircle={true} />
            <BoxOption {...args}>
                <span>{`Content: Children`}</span>
            </BoxOption>
        </div>
    )
}

Example.args = {
    className: "",
    style: {
        height: 192,
        width: 300,
    },
    label: "Label",
    icon: "trashFilled",
    active: false,
}

export const Mask: StoryObj<typeof BoxOptionMask> = (args) => {
    const [active, setActive] = useState<boolean>(true)
    return (
        <div
            style={{
                height: 300,
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(117deg, #f9f9f9 -38.52%, #fbfbfd 143.35%)",
            }}
        >
            <BoxOptionMask {...args} active={active} onClick={() => setActive(!active)} />
        </div>
    )
}

Mask.args = {
    className: "",
    style: {
        height: 192,
        width: 300,
    },
    active: false,
}
