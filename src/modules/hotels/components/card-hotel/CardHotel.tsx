import Building from "@/icons/Building"
import styles from "./CardHotel.module.css"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar/Avatar"
import CardHotelSkeleton from "./CardHotelSkeleton"

const CardHotel = ({
    onSelect,
    title,
    src,
    isLoading = false,
}: {
    title: string
    src?: string
    onSelect: (url: string) => void
    isLoading?: boolean
}) => {
    return isLoading ? (
        <CardHotelSkeleton />
    ) : (
        <div
            onClick={() => onSelect("hotel_id")}
            className={`flex flex-col h-[146px] gap-y-[5px] items-center justify-center ${styles["card-hotel__container"]} ${styles["card-hotel__container__shadow"]}`}
        >
            <Avatar size={66} className="border-none rounded-none">
                <AvatarImage src={src} />
                <AvatarFallback className="border-none bg-fondo-close">
                    <Building color="var(--primary)" />
                </AvatarFallback>
            </Avatar>
            <span className={styles["card-hotel__title"]}>{title}</span>
        </div>
    )
}

export default CardHotel
