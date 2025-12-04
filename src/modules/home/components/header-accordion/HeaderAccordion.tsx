import { ChevronDownIcon } from "lucide-react"
import styles from "./HeaderAccordion.module.css"
import { useProfile } from "@/hooks/store/useProfile"
import { EstadosTurno, useGetTurnosQuery } from "@/gql/schema"
import { useFormattedDate } from "./useGetDate"

const HeaderAccordion = ({ hotel_id }: { hotel_id: string }) => {
    const {
        usuario: { hotel },
    } = useProfile()

    const hotelSelected = hotel?.find((h) => h.hotel_id === hotel_id)

    const { data } = useGetTurnosQuery({ variables: { hotel_id: hotelSelected?.hotel_id || "" } })

    const turnoActivo = data?.turnos.find((t) => t.estado === EstadosTurno.Abierto)

    const now = useFormattedDate()

    return (
        <div className="flex w-full justify-between items-center mt-[24px]">
            <div className="flex flex-col">
                <span className={`${styles.header__accordion__title} xs:text-[24px] s:text-[36px] text-start`}>
                    {hotelSelected?.nombre_hotel}
                </span>
                <span className={`${styles.header__accordion__content} text-start`}>
                    {turnoActivo?.nombre ? `${now.date} - ${turnoActivo?.nombre} - ${now.timer}` : ""}
                </span>
            </div>
            {hotel && hotel.length > 1 && (
                <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
            )}
        </div>
    )
}

export default HeaderAccordion
