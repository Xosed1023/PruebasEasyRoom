import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer/Drawer"
import { ReactNode } from "react"
import StaffGroup from "../staff-group/StaffGroup"
import { Colab } from "../../sections/staff/Staff.type"

const StaffList = ({
    children,
    colabs,
}: {
    children: ReactNode
    colabs: {
        asignados: Colab[]
        disponibles: Colab[]
    }
}) => {
    return (
        <Drawer>
            <DrawerTrigger>{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="hidden">
                    <DrawerTitle></DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col p-[20px] gap-y-[10px] max-h-[90dvh] overflow-auto">
                    <StaffGroup
                        badgeColors={{
                            bg: "var(--primary)",
                            text: "var(--white)",
                        }}
                        items={colabs.asignados.map((c) => ({
                            title: c.name,
                            subtitle: c.puesto,
                        }))}
                        title="Con tareas en curso"
                    />
                    <StaffGroup
                        badgeColors={{
                            bg: "var(--disponible)",
                            text: "var(--white)",
                        }}
                        items={colabs.disponibles.map((c) => ({
                            title: c.name,
                            subtitle: c.puesto,
                            src: c.image
                        }))}
                        title="Disponibles"
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default StaffList
