import "./HeaderTimer.css"
import { useDateTurno } from "src/pages/Cortes/home/hooks/useDateTurno"
import { useFormatDate } from "src/shared/hooks/useFormatDate"
import { useCurrentDate } from "src/shared/providers/CurrentdateProvider"

const HeaderTimer = () => {
    const { nombre } = useDateTurno()
    const [date] = useCurrentDate()
    const { formatCustomDate } = useFormatDate()

    return (
        <div className="home-screen__turno__wrapper">
            <p className="home-screen__turno">Turno {nombre}</p>
            <p className="home-screen__hora">{formatCustomDate(date, "MMM, DD, YYYY HH:mm A" )}</p>  
        </div>
    )
}

export default HeaderTimer
