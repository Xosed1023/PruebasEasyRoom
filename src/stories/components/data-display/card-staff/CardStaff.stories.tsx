import type { StoryObj, Meta } from "@storybook/react"
import { useState } from "react"
import CardStaff from "src/shared/components/data-display/card-staff/CardStaff"
import { Props } from "src/shared/components/data-display/card-staff/CardStaff.type"

export default {
    title: "Componentes/Data Display/CardStaff",
    component: CardStaff,
    tags: ["autodocs"],
} as Meta<typeof CardStaff>

const ComponentDemo = (args: Props) => {
    const [active, setActive] = useState<boolean>(false)
    return <CardStaff {...args} active={active} onClick={() => setActive(!active)} />
}

export const Example: StoryObj<typeof CardStaff> = (args) => {
    return (
        <div
            style={{
                height: 300,
                width: "100%",
                background: "rgba(14, 14, 14, 0.80)",
                display: "grid",
                gridTemplateColumns: "1fr",
                rowGap: 10,
                alignContent: "center",
                justifyItems: "center",
            }}
        >
            <ComponentDemo {...args} description={""} text={""} />
            <ComponentDemo {...args} text={""} />
            <ComponentDemo {...args} />
        </div>
    )
}

Example.args = {
    className: "",
    style: { width: 412 },
    name: "Eugenio Martinez Martinez",
    description: "Disponible desde hace: 30 minutos",
    text: "Última habitación asignada: Suite Villa 201",
    picture: "https://randomuser.me/api/portraits/men/41.jpg",
    status: "online",
    active: false,
}
