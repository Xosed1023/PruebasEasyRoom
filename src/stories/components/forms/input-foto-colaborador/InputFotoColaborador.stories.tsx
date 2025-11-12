import React from "react"
import { Meta, StoryFn } from "@storybook/react"
import { InputFoto } from "src/shared/components/forms/input-foto/InputFoto"

export default {
    title: "Componentes/Forms/ProfilePictureUpload",
    component: InputFoto,
    tags: ['autodocs'],
} as Meta<typeof InputFoto>

const Template: StoryFn<typeof InputFoto> = (args) => <InputFoto {...args} />

export const Basic = Template.bind({})

Basic.args = {
    onPictureChange: (file: File | null) => {
        console.log("Imagen seleccionada:", file)
    },
}
