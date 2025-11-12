import { Meta, StoryFn } from "@storybook/react"
import IconSuccess from "src/shared/icons/IconSuccess"
import IconTrash from "src/shared/icons/IconTrash"
import { ModalConfirm } from "../../../../shared/components/layout"
import "../../../../variables.css"

export default {
    title: "Componentes/Layout/ModalConfirm",
    component: ModalConfirm,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {
        style: {
            control: { type: "text" },
        },
        className: {
            control: { type: "text" },
        },
        cancelButtonTheme: {
            control: { type: ["primary", "secondary", "secondary-gray", "tertiary", "tertiary-gray"] },
        },
        confirmButtonTheme: {
            control: { type: ["primary", "secondary", "secondary-gray", "tertiary", "tertiary-gray"] },
        },
    },
} as Meta<typeof ModalConfirm>

const Template: StoryFn<typeof ModalConfirm> = (args) => <ModalConfirm {...args} />

// Historias
export const Basic = Template.bind({})
Basic.args = {
    title: "Lorem Ipsum",
    description:
        "This blog post has been published. Team members will be able to edit this post and republish changes.",
    iconTheme: "success",
    icon: <IconSuccess color="var(--green-success)" />,
}

export const Delete = Template.bind({})
Delete.args = {
    title: "Lorem Ipsum",
    description:
        "This blog post has been published. Team members will be able to edit this post and republish changes.",
    iconTheme: "danger",
    icon: <IconTrash color="var(--red-alert)" />,
    cancelButtonTheme: "secondary-gray",
    confirmButtonStyle: {
        background: "var(--red-alert)",
    },
}
