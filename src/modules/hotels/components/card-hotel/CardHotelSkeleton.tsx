import { Skeleton } from "@/components/ui/Skeleton/Skeleton"
import styles from "./CardHotel.module.css"

const CardHotelSkeleton = () => {
    return (
        <Skeleton
            className={`flex flex-col h-[146px] gap-y-[5px] items-center justify-center ${styles["card-hotel__container__shadow"]}`}
        ></Skeleton>
    )
}

export default CardHotelSkeleton
