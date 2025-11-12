import type { StoryObj, Meta } from "@storybook/react"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"

export default {
    title: "DetalleHabitacion/DescriptionDetail",
    component: DescriptionDetail,
    tags: ["autodocs"],
} as Meta<typeof DescriptionDetail>

export const Example: StoryObj<typeof DescriptionDetail> = (args) => {
    return (
        <div
            style={{
                height: 300,
                width: "100%",
                background: "rgba(14, 14, 14, 0.80)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px 30px",
                alignContent: "center",
                justifyItems: "center",
                padding: "0 30px",
                boxSizing: "border-box",
                minWidth: 800,
                overflowX: "auto",
            }}
        >
            <DescriptionDetail {...args} />
            <DescriptionDetail {...args} date={"Hace 3 días"} />
            <DescriptionDetail {...args} date={"Hace 3 días"} link={"Limpiar"} />
            <DescriptionDetail {...args} link={"Agregar"} />
            <DescriptionDetail {...args} label={"Servicios adicionales"} value={["Desayuno", "Descuento en Spa"]} />
            <DescriptionDetail {...args} label={"Pago parcial"} date={"08/Nov/23"} amount={1000} />
            <DescriptionDetail {...args} label={"Pago parcial"} date={"08/Nov/23"} value={"Efectivo"} amount={-500} />
            <DescriptionDetail {...args} label={"Pago parcial"} link={"Agregar"} linkBottom={true} />
        </div>
    )
}

Example.args = {
    className: "",
    style: { width: "100%" },
    label: "Último mantenimiento",
    value: "Jose Luis Lopéz Hernandéz",
    icon: "chatFill",
    date: "",
    link: "",
    amount: undefined,
    onLink: () => console.log("Click!"),
}
