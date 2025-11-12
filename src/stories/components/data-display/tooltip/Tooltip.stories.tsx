import type { StoryObj, Meta } from "@storybook/react"
import Tooltip from "src/shared/components/data-display/tooltip/Tooltip"

export default {
    title: "Componentes/Data Display/Tooltip",
    component: Tooltip,
    tags: ["autodocs"],
} as Meta<typeof Tooltip>

export const Example: StoryObj<typeof Tooltip> = (args) => {
    return (
        <div
            style={{
                height: 300,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Tooltip {...args}>
                <span>Tooltip will show on mouse enter.</span>
            </Tooltip>
        </div>
    )
}

Example.args = {
    className: "",
    style: {},
    title: "This is a tooltip",
    description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    theme: "light",
    placement: "top",
}
