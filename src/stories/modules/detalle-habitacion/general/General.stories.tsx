import type { StoryObj, Meta } from "@storybook/react"
import { useState } from "react"
import { Provider } from "react-redux"
import { store } from "src/store/store"
import {
    PrimaryButton,
    SecondaryButton,
    Title,
    Link,
    TextLine,
    Block,
    Tabs,
    TextArea,
} from "src/pages/home/room-detail/sections/elements/Elements"
import {
    ItemComment,
    ItemMultiplePayment,
    ItemPayment,
    ItemTimer,
} from "src/pages/home/room-detail/sections/items/Items"
import { HomeView, ListView } from "src/pages/home/room-detail/sections/views/Views"
import { Section } from "./Sections"

const General = () => <div></div>

const TabSection = () => {
    const [path, setPath] = useState<string>("detail")
    return (
        <Tabs
            tabList={[
                { label: "Detalles", path: "detail" },
                { label: "Pagos", path: "payment" },
            ]}
            value={path}
            onChange={(path) => setPath(path)}
        />
    )
}

const CommentSection = () => {
    const [value, setValue] = useState<string>("")
    return <ItemComment value={value} onChange={(value) => setValue(value)} />
}

export default {
    title: "DetalleHabitacion/General",
    component: General,
    tags: ["autodocs"],
} as Meta<typeof General>

export const Example: StoryObj<typeof General> = () => {
    return (
        <Provider store={store}>
            <div>
                <Section title={"Views | Elements"} style={{ marginBottom: 20 }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "420px 1fr",
                            columnGap: 30,
                        }}
                    >
                        <HomeView style={{ height: 200, width: 420 }}>
                            <Title>{"Home View"}</Title>
                        </HomeView>
                        <Block list>
                            <Title>{"Reservas"}</Title>
                            <Link>{"Guardar"}</Link>
                            <TabSection />
                            <TextArea description="Comentarios" placeholder="Escribe un comentario..." />

                            <PrimaryButton text={"Hola"} />
                            <SecondaryButton text={"Hola"} />
                            <TextLine label="Lorem" value="Lorem" />
                            <TextLine label="Lorem" value="Lorem" fontWeight={700} />
                        </Block>
                        <ListView
                            title="Asignación de reserva a la habitación"
                            subtitle="Elige una reserva que desees vincular a la habitación."
                            style={{ height: 200, width: 420 }}
                        >
                            <Title>{"ListView"}</Title>
                        </ListView>
                    </div>
                </Section>
                <Section title={"Items"}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 20,
                        }}
                    >
                        <CommentSection />
                        <ItemPayment
                            icon={"userFilled"}
                            label={"Personas"}
                            value={"2"}
                            amount={500}
                            payments={["Efectivo", "*5050"]}
                            onPrint={() => console.log("Print")}
                        />
                        <ItemMultiplePayment
                            icon={"userFilled"}
                            label={"Room Service"}
                            payments={[
                                {
                                    label: "003",
                                    amount: 100,
                                },
                                {
                                    label: "002",
                                    amount: 600,
                                },
                                {
                                    label: "0010",
                                    amount: 700,
                                },
                            ]}
                        />
                        <ItemTimer label="A la venta desde hace" icon="Stopwatch" dateTimer={"2023-10-15T00:00:00"} />
                    </div>
                </Section>
            </div>
        </Provider>
    )
}

Example.args = {}
