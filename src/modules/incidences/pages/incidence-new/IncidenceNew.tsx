import Icon from "@/icons"
import styles from "./IncidenceNew.module.css"
import { useNavigate } from "react-router"
import CheckboxIncidence from "../../components/checkbox-incidence/CheckboxIncidence"
import ScreenDetail from "@/components/core/layout/screen-detail/ScreenDetail"
import { useProfile } from "@/hooks/store/useProfile"


const IncidenceNew = () => {
    const navigate = useNavigate()
    const { hotel_id } = useProfile()

    const handleSelect = (origen: string) => {
        navigate(`/u/incidences/${hotel_id}/new/form?origen=${origen}`)
    }

    return (
        <ScreenDetail title="Nueva incidencia">
            <div className={styles["incidence-new__container"]}>
                <h3 className={styles["incidence-new__title"]}>Origen de la incidencia</h3>
                <p className={styles["incidence-new__subtitle"]}>Selecciona una opción:</p>

                <div className={styles["incidence-new__options"]}>
                    <button className={styles["incidence-new__option"]} onClick={() => handleSelect("instalaciones")}>
                        <div className={styles["incidence-new__icon-wrapper"]} style={{ backgroundColor: "#FDEFCB" }}>
                            <Icon name="Building" width={16} height={16} color="#DC6803" />
                        </div>
                        <div className={styles["incidence-new__content"]}>
                            <p className={styles["incidence-new__label"]}>Instalaciones</p>
                            <span className={styles["incidence-new__description"]}>
                                Reporta una incidencia o desperfecto sobre las instalaciones del hotel.
                            </span>
                        </div>
                        <CheckboxIncidence />
                    </button>

                    <button className={styles["incidence-new__option"]} onClick={() => handleSelect("habitaciones")}>
                        <div className={styles["incidence-new__icon-wrapper"]} style={{ backgroundColor: "#F3EFFF" }}>
                            <Icon name="BedRoom" width={16} height={16} color="#7F56D9" />
                        </div>
                        <div className={styles["incidence-new__content"]}>
                            <p className={styles["incidence-new__label"]}>Habitaciones</p>
                            <span className={styles["incidence-new__description"]}>
                                Reporta daños o imperfecciones en una habitación.
                            </span>
                        </div>
                        <CheckboxIncidence />
                    </button>

                    <button className={styles["incidence-new__option"]} onClick={() => handleSelect("huesped")}>
                        <div className={styles["incidence-new__icon-wrapper"]} style={{ backgroundColor: "#E6F0F9" }}>
                            <Icon name="UserIncidences" width={16} height={16} color="#8FA3BF" />
                        </div>
                        <div className={styles["incidence-new__content"]}>
                            <p className={styles["incidence-new__label"]}>Huésped</p>
                            <span className={styles["incidence-new__description"]}>
                                Registra el nombre o auto responsable de la incidencia.
                            </span>
                        </div>
                        <CheckboxIncidence />
                    </button>
                </div>
            </div>
        </ScreenDetail>
    )
}

export default IncidenceNew
