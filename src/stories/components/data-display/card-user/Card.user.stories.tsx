import { StoryFn } from "@storybook/react"
import useRandomUser from "src/shared/hooks/random-person"
import CardUser from "src/shared/components/data-display/cart-user/CartUser"

export default {
    title: "Componentes/Data Display/Card User",
    component: CardUser,
    tags: ["autodocs"],
}

const data = [
    { size: "xl", status: "online" },
    { size: "lg", status: "offline" },
    { size: "md", status: "verified" },
    { size: "sm", status: "company" },
    { size: "sm", status: "none" },
]

const Template: StoryFn<typeof CardUser> = () => {
    const { user } = useRandomUser()
    return (
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
            {data.map(({ size, status }, item) => (
                <CardUser
                    key={item}
                    name={`${user?.name.first} ${user?.name.last}`}
                    picture={`${user?.picture.large}`}
                    description={`${user?.email}`}
                    size={size}
                    status={status}
                />
            ))}
        </div>
    )
}

export const Default = Template.bind({})
