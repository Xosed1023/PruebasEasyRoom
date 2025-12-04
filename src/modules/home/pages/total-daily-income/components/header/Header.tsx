import { ArrowLeft } from "lucide-react"
import styles from "./Header.module.css"
import { useNavigate } from "react-router"

const Header = () => {
    const navigate = useNavigate()

    return (
        <div className="flex gap-x-[20px] items-center h-full s:px-[35px] xs:px-[20px]">
            <ArrowLeft width={28} height={28} onClick={() => navigate(-1)} />
            <span className={styles["daily-income__header__title"]}>Ingreso total del día</span>
        </div>
    )
}

export default Header
