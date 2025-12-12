import React from "react"
import { StoryFn, Meta } from "@storybook/react"
import NavMenu from "src/shared/components/navigation/nav-menu/NavMenu"
import { action } from "@storybook/addon-actions"
import "./index.utils.css"
import Icon from "src/shared/icons"

export default {
    title: "Componentes/Navigation/NavMenu",
    component: NavMenu,
    tags: ["autodocs"],
    argTypes: {
        onChange: { action: "clicked", description: "Ejecuta el evento onChange", type: "function" },
        value: {
            control: { type: "text" },
            type: { name: "string", required: true },
            description: "Valor del input",
        },
        navFooterItems: {
            control: { type: "object" },
            description: "Array de objetos con los datos de cada item del menu",
            table: {
                type: { summary: "object" },
            },
        },
    },
} as Meta<typeof NavMenu>

const stories = [
    {
        name: "Default",
        args: {
            navFooterItems: [
                {
                    path: "/",
                    label: "Home",
                    icon: "habitacion",
                },
                {
                    path: "/reservas",
                    label: "Reservas",
                    icon: "reservas",
                },
                {
                    path: "/roomservice",
                    label: "roomService",
                    icon: "car",
                },
                {
                    path: "/personal",
                    label: "Personal",
                    icon: "personal",
                },
                {
                    path: "/cortesyfajillas",
                    label: "Cortes y fajillas",
                    icon: "money",
                },
                {
                    path: "/inventario",
                    label: "Inventario",
                    icon: "inventario",
                },
            ],
        },
    },
]

const Template: StoryFn = (args) => {
    const [valuePath, setValuePath] = React.useState<string>(args.value)
    const changePath = (path: string) => {
        setValuePath(path)
        action("onChange")(path)
    }

    const formatJson = JSON.stringify(
        args.navFooterItems.find(({ path }) => path === valuePath),
        null,
        2
    )
    const info = args.navFooterItems.find(({ path }) => path === valuePath)
    return (
        <section className="conteiner-seccion">
            <div className="conteiner-info">
                <div className="info-router">
                    <h2>Path: {info.path}</h2>
                    <h2>Label: {info.label}</h2>
                    <h2>
                        Icon: <Icon name={info.icon} color="#000" height={"24px"} width={"24px"} />
                    </h2>
                </div>
                <pre>
                    <h1>Array:</h1>
                    <code>{formatJson}</code>
                </pre>
            </div>
            <NavMenu
                routes={[]}
                {...args}
                onChange={(path) => {
                    changePath(path)
                }}
                value={valuePath}
            />
        </section>
    )
}

// Exportar cada historia individualmente
export const Default = Template.bind({})
Default.args = stories[0].args
