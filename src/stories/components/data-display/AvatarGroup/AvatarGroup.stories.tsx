import { Meta, StoryFn } from "@storybook/react"
import AvatarGroup from "src/shared/components/data-display/avatarGroup/AvatarGroup"
import { AvatarIconState, AvatarState } from "src/shared/components/data-display/avatar/avatar"
export default {
    title: "Componentes/Widtgets/AvatarGroupe",
    component: AvatarGroup,
    // genera el archivo Docs
    tags: ["autodocs"],
} as Meta<typeof AvatarGroup>

// Define el story para el componente LoaderComponent
const Template: StoryFn<typeof AvatarGroup> = (props) => <AvatarGroup {...props} />

export const Default = Template.bind({})

Default.args = {
    avatarList: [
        {
            name: ["Juan Perez"],
            src: "https://picsum.photos/200/300",
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            size: "lg",
            marco: true,
        },
        {
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            name: ["Juan Perez"],
            src: "https://picsum.photos/200/300",
            size: "lg",
            marco: true,
        },
        {
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            name: ["Juan Perez"],
            src: "https://picsum.photos/200/300",
            size: "lg",
            marco: true,
        },
        {
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            name: ["Juan Perez"],
            src: "https://picsum.photos/200/300",
            size: "lg",
            marco: true,
        },
    ],
    maxAvatars: 3,
}
