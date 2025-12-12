import type { StoryObj, Meta } from "@storybook/react"
import SnackBar from "src/shared/components/data-display/SnackBar/SnackBar"

export default {
    title: "Componentes/Data Display/Toast",
    component: SnackBar,
    tags: ["autodocs"],
} as Meta<typeof SnackBar>

export const Example: StoryObj<typeof SnackBar> = (args) => {
    return (
        <SnackBar {...args}>
            <span>This is an example of Toast.</span>
        </SnackBar>
    )
}

Example.args = {
    title: "This is a toast",
    isOpen: true,
    status: "success",
    onClose: () => null,
}
