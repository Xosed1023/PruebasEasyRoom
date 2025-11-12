import { StoryFn } from "@storybook/react"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import DrawerAccordion from "src/shared/components/data-display/drawer-accordion/DrawerAccordion"

export default {
    title: "DetalleHabitacion/Sidebar Accordion",
    component: DrawerAccordion,
    tags: ["autodocs"],
}

const Template: StoryFn<typeof DrawerAccordion> = () => {
    return (
        <div style={{
            width: "100%", height: "100%", background: "rgba(14, 14, 14, 0.80)"
        }}>
            <DrawerAccordion
                title="Pagos registrados"
                isEmpty={false}
                emptyDescription="No hay pagosp pendientes"
                emptyIcon={'CoinsFill'}
            >
                <DescriptionDetail
                    className=""
                    style={{ width: "100%" }}
                    label="Último mantenimiento"
                    value="Jose Luis Lopéz Hernandéz"
                    icon="chatFill"
                    date=""
                    onLink={() => console.log("Click!")}
                    link={"Agregar"}
                    linkBottom={true} />
            </DrawerAccordion>
            <DrawerAccordion
                title="Pagos registrados"
                isEmpty={true}
                emptyDescription="No hay pagos pendientes"
                emptyIcon={'coinsFill'}
            >
            </DrawerAccordion>
        </div>
    )
}

export const Default = Template.bind({})
