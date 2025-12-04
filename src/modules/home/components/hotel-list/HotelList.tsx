import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer/Drawer"
import HeaderAccordion from "@/modules/home/components/header-accordion/HeaderAccordion"
import HotelItem from "../hotel-item/HotelItem"
import { useProfile } from "@/hooks/store/useProfile"

const HotelList = ({ hotel_id }: { hotel_id: string }) => {
    const {
        usuario: { hotel },
    } = useProfile()

    return (
        <Drawer>
            <DrawerHeader className="hidden">
                <DrawerTitle></DrawerTitle>
                <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <DrawerTrigger>
                <HeaderAccordion hotel_id={hotel_id} />
            </DrawerTrigger>
            {hotel && hotel.length > 1 && (
                <DrawerContent className="pb-4 pt-4">
                    <DrawerTrigger>
                        <div className={`flex flex-col p-[20px] gap-y-[10px] max-h-[90dvh] overflow-auto`}>
                            {hotel?.map((h, index, arr) => (
                                <HotelItem
                                    hotel_id={hotel_id}
                                    name={h.nombre_hotel}
                                    id={h.hotel_id}
                                    img_url={h.logo_hotel || undefined}
                                    separator={index !== arr.length - 1}
                                />
                            ))}
                        </div>
                    </DrawerTrigger>
                </DrawerContent>
            )}
        </Drawer>
    )
}

export default HotelList
