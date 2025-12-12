import { Meta, StoryFn } from "@storybook/react"
import { Modal } from "src/shared/components/layout/modal/Modal"
import IconSuccess from "src/shared/icons/IconSuccess"
import "../../../../variables.css"

export default {
    title: "Componentes/Layout/Modal",
    component: Modal,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {},
} as Meta<typeof Modal>

const Template: StoryFn<typeof Modal> = (args) => <Modal {...args} />

// Historias
export const Basic = Template.bind({})
Basic.args = {
    children: <IconSuccess color="var(--green-success)" />,
    withCloseButton: true,
    isCancelableOnClickOutside: false,
    width: 100,
    height: 100,
}
