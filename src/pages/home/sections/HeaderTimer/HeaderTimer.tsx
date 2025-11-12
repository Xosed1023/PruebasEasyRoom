import "./HeaderTimer.css"
import { useDateTurno } from "src/pages/Cortes/home/hooks/useDateTurno"
import { useCurrentDate } from "src/shared/providers/CurrentdateProvider"
import { useDate } from "src/shared/hooks/useDate"
import { useProfile } from "src/shared/hooks/useProfile"

const HeaderTimer = () => {
    const { zona_horaria } = useProfile()
    const { nombre } = useDateTurno()
    const [date] = useCurrentDate()
    const { formatDateZone } = useDate()

    return (
        <div className="home-screen__turno__wrapper">
            <p className="home-screen__turno">Turno {nombre}</p>
            <p className="home-screen__hora">{formatDateZone(date, zona_horaria)}</p>
        </div>
    )
}

export default HeaderTimer
