import { useNavigate } from "react-router"
import Screen from "../../components/core/layout/screen/Screen"
import Logo from "assets/png/logo.png"
import EmptyImg from "assets/png/empty-expiracion.png"
import Close from "@/icons/Close"
import styles from "./Error.module.css"

function Error() {
    const navigate = useNavigate()

    return (
        <Screen
            className={styles["error-screen"]}
            header={
                <div className="flex gap-x-[20px] items-center h-full px-[35px] justify-between">
                    <div className={styles["error-screen__logo"]}>
                        <img height={26} src={Logo} alt={"logo"} />
                    </div>
                    <Close
                        onClick={() => navigate("/", { replace: true })}
                        className={styles["error-screen__close"]}
                        height={24}
                        width={24}
                    />
                </div>
            }
        >
            <div className={styles["error-empty"]}>
                <div className={styles["error-empty__img"]}>
                    <img height={200} src={EmptyImg} alt={"logo"} />
                </div>
                <p className={styles["error-empty__title"]}>{"Este enlace no está disponible"}</p>
                <p className={styles["error-empty__link"]} onClick={() => navigate("/", { replace: true })}>
                    {"Regresar"}
                </p>
            </div>
        </Screen>
    )
}

export default Error
