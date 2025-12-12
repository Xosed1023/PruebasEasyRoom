import React from "react"
import { StoryFn } from "@storybook/react"
import Avatar, { AvatarIconState, AvatarState } from "src/shared/components/data-display/avatar/avatar"
import useRandomUser from "src/shared/hooks/random-person"

export default {
    title: "Componentes/Data Display/Avatar",
    component: Avatar,
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: {
                type: "select",
                options: ["2xl", "xl", "lg", "md", "sm", "xs"],
            },
        },
    },
}

const Template: StoryFn<typeof Avatar> = () => {
    const { user } = useRandomUser()
    const size = ["2xl", "xl", "lg", "md", "sm", "xs"]
    const nameAvatar = [user?.name.first || "", user?.name.last || ""]
    return (
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
            {size.map((item) => (
                <Avatar
                    key={item}
                    src={user?.picture.large || ""}
                    size={item}
                    state={AvatarState.Loaded}
                    avatarIconState={AvatarIconState.verified}
                    name={nameAvatar}
                />
            ))}
        </div>
    )
}

const Template2: StoryFn<typeof Avatar> = (args) => <Avatar {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Loading = Template2.bind({})
Loading.args = {
    size: "2xl",
    state: AvatarState.Loading,
    avatarIconState: AvatarIconState.verified,
    name: ["Max", "Camacho"],
}
export const Error = Template2.bind({})
Error.args = {
    size: "2xl",
    state: AvatarState.Error,
    avatarIconState: AvatarIconState.verified,
    name: ["Max", "Camacho"],
}
