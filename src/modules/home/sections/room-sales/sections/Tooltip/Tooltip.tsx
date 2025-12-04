import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer/Drawer"
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
                        title="Venta de habitaciones"
                        description="Es la suma de todas las ventas realizadas en un hotel, incluyendo las ventas por reservas anticipadas y las ventas en el mostrador, teniendo en cuenta el tipo de entrada, ya sea peatonal o vehicular."
                        separator
                    />
                    <DrawerItem
                        title="Venta acumulada"
                        description="Se calcula con la venta de habitaciones respecto a el número de habitaciones que cuenta el hotel."
                        separator
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default Tooltip
