import { ReactNode, useEffect, useState } from "react"
import { useRoomDarwer } from "src/pages/home/room-detail/hooks/darwer"
import { Tabs } from "src/pages/home/room-detail/sections/elements/Elements"

export const TabsNavigation = ({ children }: { children: ReactNode[] }) => {
    const [value, setValue] = useState<string>("0")

    const { visible } = useRoomDarwer()

    useEffect(() => {
        if (visible && value !== "0") setValue("0")
    }, [visible])

    return (
        <div className="detalle-h-mant__home__tabs">
            <Tabs
                value={value}
                tabList={[
                    { label: "Detalle", path: "0" },
                    { label: "Comentarios", path: "1" },
                ]}
                onChange={(value) => setValue(value)}
            />
            {children[Number(value)]}
        </div>
    )
}
