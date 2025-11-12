import { Meta, StoryFn } from "@storybook/react"
import { useEffect, useState } from "react"
import LoaderComponent from "src/shared/components/layout/loader/Loader"

export default {
    title: "Componentes/Layout/Loader",
    component: LoaderComponent,
    // genera el archivo Docs
    tags: ["autodocs"],
} as Meta<typeof LoaderComponent>

// Define el story para el componente LoaderComponent
const Template: StoryFn<typeof LoaderComponent> = (args) => {
    const [visible, setVisible] = useState<boolean>(true)
    useEffect(() => {
        setTimeout(() => {
            setVisible(false)
        }, 5000)
    })
    return (
        <>
            <LoaderComponent {...args} visible={visible} />
        </>
    )
}

export const Default = Template.bind({})
