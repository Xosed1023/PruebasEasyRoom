import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer/Drawer"
import DrawerItem from "@/modules/home/components/drawer-item/DrawerItem"
import TooltipButton from "@/modules/home/components/tooltip-button/TooltipButton"

const Tooltip = () => {
    return (
        <Drawer>
            <DrawerTrigger>
                <TooltipButton />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="hidden">
                    <DrawerTitle></DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col p-[20px] gap-y-[10px] max-h-[90dvh] overflow-auto">
                    <DrawerItem
                        title="Ocupación al momento"
                        description="Porcentaje de habitaciones ocupadas entre el número total de habitaciones."
                        separator
                    />
                    <DrawerItem
                        title="Ocupación esperada"
                        description="Estimación del porcentaje de habitaciones que se espera estén ocupadas, calculada sumando las habitaciones ocupadas que no harán check out hoy con las reservas esperadas del día."
                        separator
                    />
                    <DrawerItem
                        title="Ocupación alcanzada"
                        description="Porcentaje real de habitaciones ocupadas, calculado sumando las habitaciones ocupadas que no han hecho check out hoy, las reservas con check in y las ventas del día en el mostrador."
                        separator
                    />
                    <DrawerItem
                        title="Ocupación mensual"
                        description="Se calcula dividiendo el número de habitaciones vendidas por los días transcurridos en un período del mes."
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default Tooltip
