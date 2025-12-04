import { useNavigate } from "react-router"
import Screen from "../screen/Screen"
import ArrowLeft from "@/icons/ArrowLeft"
import { ScreenDetailProps } from "./ScreenDetaill.type"
import styles from "./ScreenDetail.module.css"

function ScreenDetail({ className = "", title = "", children }: ScreenDetailProps) {
    const navigate = useNavigate()

    return (
        <Screen
            header={
                <div className="flex gap-x-[20px] items-center h-full s:px-[35px] xs:px-[20px]">
                    <ArrowLeft width={28} height={28} onClick={() => navigate(-1)} />
                    <span className={styles["screen-detail__header__title"]}>{title}</span>
                </div>
            }
            className={className}
        >
            {children}
        </Screen>
    )
}

export default ScreenDetail
