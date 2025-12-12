import type { StoryObj, Meta } from "@storybook/react"
import Empty from "src/shared/components/data-display/empty/Empty"

export default {
    title: "DetalleHabitacion/Empty",
    component: Empty,
    tags: ["autodocs"],
} as Meta<typeof Empty>

export const Example: StoryObj<typeof Empty> = (args) => {
    return (
        <div
            style={{
                height: 300,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background:
                    args?.theme === "dark"
                        ? "rgba(14, 14, 14, 0.80)"
                        : "linear-gradient(117deg, #f9f9f9 -38.52%, #fbfbfd 143.35%)",
            }}
        >
            <Empty {...args} />
        </div>
    )
}

Example.args = {
    className: "",
    style: {},
    theme: "dark",
    title: "Lorem Lorem",
    icon: "userFilled",
}
