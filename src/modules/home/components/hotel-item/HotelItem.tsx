import IconBorder from "@/components/core/general/icon-border/IconBorder"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar/Avatar"

import styles from "./HotelItem.module.css"
import Check from "@/icons/Check"
import { Separator } from "../separator/Separator"
import { useNavigate } from "react-router"
import { useProfile } from "@/hooks/store/useProfile"
import useSnackbar from "@/hooks/useSnackbar"

const HotelItem = ({
    separator,
    name,
    id,
    img_url,
    hotel_id,
}: {
    separator?: boolean
    name: string
    id: string
    img_url?: string
    hotel_id: string
}) => {
    const navigate = useNavigate()
    const { handleHotel, usuario } = useProfile()
    const { showSnackbar } = useSnackbar(2000)

    function getFirstTwoInitials(fullName: string): string {
        return fullName
            .trim()
            .split(/\s+/)
            .map((word) => word[0].toUpperCase())
            .slice(0, 2) // take only the first two initials
            .join("")
    }

    return (
        <div className="flex flex-col">
            <div
                className="flex items-center justify-between"
                onClick={() => {
                    const hotelSelected = usuario?.hotel?.find((x) => x.hotel_id === id)
                    if (hotelSelected) {
                        handleHotel({
                            nombre_hotel: hotelSelected.nombre_hotel || "",
                            hotel_id: hotelSelected.hotel_id || "",
                            logo_hotel: hotelSelected.logo_hotel || "",
                            zona_horaria: hotelSelected.zona_horaria || "",
                        })

                    showSnackbar({
                        status: "success",
                        title: "",
                        text: `Cambiaste a **${hotelSelected?.nombre_hotel}**`,
                        image: hotelSelected?.logo_hotel || "",
                        close: false,
                    })
                    }
                    navigate(`/u/home/${id}`)
                }}
            >
                <div className="flex items-center gap-x-[10px]">
                    <Avatar size={47} className={styles["hotel__list__avatar"]}>
                        <AvatarImage src={img_url} />
                        <AvatarFallback className={styles["hotel__list__fallback"]}>
                            {getFirstTwoInitials(name)}
                        </AvatarFallback>
                    </Avatar>
                    <span className={styles["hotel__list__title"]}>{name}</span>
                </div>
                {hotel_id === id && (
                    <IconBorder primaryBgColor="var(--primary)" primaryBgDiameter={18}>
                        <Check color="var(--white)" width={10} height={10} />
                    </IconBorder>
                )}
            </div>
            {separator && <Separator className="mt-[20px]" />}
        </div>
    )
}

export default HotelItem
