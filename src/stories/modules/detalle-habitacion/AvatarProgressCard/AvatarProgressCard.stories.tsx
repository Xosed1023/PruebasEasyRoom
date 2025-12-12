import { Meta, StoryFn } from "@storybook/react"
import AvatarProgressCard from "src/shared/components/data-display/AvatarProgressCard/AvatarProgressCard"
import "../../../../shared/components/data-display/AvatarProgressCard/AvatarProgressCard.css"
import "../../../../variables.css"

export default {
    title: "DetalleHabitacion/AvatarProgressCard",
    component: AvatarProgressCard,
    // genera el archivo Docs
    tags: ["autodocs"],
    argTypes: {
        style: {
            control: { type: "text" },
        },
        className: {
            control: { type: "text" },
        },
    },
} as Meta<typeof AvatarProgressCard>

const Template: StoryFn<typeof AvatarProgressCard> = (args) => <AvatarProgressCard {...args} />

// Historias
export const Basic = Template.bind({})
Basic.args = {
    // barra morada chica, barra morada clara grande y blanca (hrs extra rergesiva normal 10h)
    timeLimit: new Date("2023-10-10T10:40:00"),
    timeStart: new Date("2023-10-10T07:00:00"),
    extraHours: 1,
    progressbarDescriprionBottom: "Entrada: 05:09 p.m",
}

export const WithAvatar = Template.bind({})
WithAvatar.args = {
    timeLimit: new Date("2023-10-10T13:35:00"),
    timeStart: new Date("2023-10-09T13:35:00"),
    avatarName: "Maria de la concepción Díaz",
    progressbarDescriprionTop: "Tiempo en limpieza",
    avatarSrcs: [
        "https://c4.wallpaperflare.com/wallpaper/108/140/869/digital-digital-art-artwork-fantasy-art-drawing-hd-wallpaper-thumb.jpg",
    ],
}
