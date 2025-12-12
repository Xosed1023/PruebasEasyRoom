import { Meta, StoryFn } from "@storybook/react"
import { AvatarIconState, AvatarState } from "src/shared/components/data-display/avatar/avatar"
import PersonalActivoEnTUrnoWit from "src/shared/widgets/personalActivoEnTUrnoWit/PersonalActivoEnTUrnoWit"

export default {
    title: "Componentes/Widtgets/PersonalActivo",
    component: PersonalActivoEnTUrnoWit,
    // genera el archivo Docs
    tags: ["autodocs"],
} as Meta<typeof PersonalActivoEnTUrnoWit>

// Define el story para el componente LoaderComponent
const Template: StoryFn<typeof PersonalActivoEnTUrnoWit> = (props) => <PersonalActivoEnTUrnoWit {...props} />

export const ValoresCompletos = Template.bind({})
export const SinValores = Template.bind({})

ValoresCompletos.args = {
    personalAsignado: [
        {
            name: ["Aadi Prajapati"],
            src: "https://randomuser.me/api/portraits/men/7.jpg",
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            size: "lg",
            marco: true,
        },
        {
            name: ["Pinja Honkala"],
            src: "https://randomuser.me/api/portraits/women/1.jpg",
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            size: "lg",
            marco: true,
        },
        {
            name: ["Alonso Murillo"],
            src: "https://randomuser.me/api/portraits/men/46.jpg",
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            size: "lg",
            marco: true,
        },
        {
            name: ["Cindy Romero"],
            src: "https://randomuser.me/api/portraits/women/41.jpg",
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            size: "lg",
            marco: true,
        },
        {
            name: ["Aadi Prajapati"],
            src: "https://randomuser.me/api/portraits/men/7.jpg",
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            size: "lg",
            marco: true,
        },
        {
            name: ["Pinja Honkala"],
            src: "https://randomuser.me/api/portraits/women/1.jpg",
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            size: "lg",
            marco: true,
        },
        {
            name: ["Alonso Murillo"],
            src: "https://randomuser.me/api/portraits/men/46.jpg",
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            size: "lg",
            marco: true,
        },
        {
            name: ["Cindy Romero"],
            src: "https://randomuser.me/api/portraits/women/41.jpg",
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            size: "lg",
            marco: true,
        },
    ],

    personalDisponible: [
        {
            name: ["Aadi Prajapati"],
            src: "https://randomuser.me/api/portraits/men/7.jpg",
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            size: "lg",
            marco: true,
        },
        {
            name: ["Pinja Honkala"],
            src: "https://randomuser.me/api/portraits/women/1.jpg",
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            size: "lg",
            marco: true,
        },
        {
            name: ["Alonso Murillo"],
            src: "https://randomuser.me/api/portraits/men/46.jpg",
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            size: "lg",
            marco: true,
        },
        {
            name: ["Cindy Romero"],
            src: "https://randomuser.me/api/portraits/women/41.jpg",
            state: AvatarState.Loaded,
            avatarIconState: AvatarIconState.none,
            size: "lg",
            marco: true,
        },
    ],
}

SinValores.args = {}
