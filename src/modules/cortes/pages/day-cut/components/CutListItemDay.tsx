import CutListItem from "../../components/cut-list-item/CutListItem"
import { useNavigate } from "react-router"
import { GroupCortes } from "@/gql/schema"
import { dateHelpers } from "@/helpers/dateHelpers"
import formatDateDDMMMYYYY from "@/helpers/formatDateDDMMMYYYY"
import { getFechaFin, getFechaInicio } from "../../helpers/cutDates"

const CutListItemDay = ({
    cut,
    onSelect,
    loading,
    setIsLoading
}: {
    cut: GroupCortes
    onSelect: (cut: GroupCortes) => void
    loading: boolean
    setIsLoading: (v: boolean) => void
}) => {
    const { UTCStringToLocalDate, setHHMMSS, localDateToUTCString } = dateHelpers()
    const navigate = useNavigate()

    const fechaInicio = getFechaInicio(cut.cortes.map((c) => UTCStringToLocalDate(c.fecha_inicio_corte)))
    const fechaFin = getFechaFin(
        cut.cortes.map((c) =>
            c.fecha_fin_corte
                ? UTCStringToLocalDate(c.fecha_fin_corte || "")
                : setHHMMSS({
                      startDate: UTCStringToLocalDate(c.fecha_corte || ""),
                      newHour: "23:59:59.999",
                      isNewHourInUTC: false,
                  })
        )
    )

    return (
        <CutListItem
            loading={loading}
            setIsLoading={setIsLoading}
            onDetails={() => {
                navigate(`pdf/${localDateToUTCString(fechaInicio!)}&${localDateToUTCString(fechaFin!)}`, {
                    state: {
                        cortes: cut.cortes,
                    },
                })
            }}
            onDownload={() => {
                onSelect(cut)
            }}
            title={formatDateDDMMMYYYY({ date: fechaInicio!, capitalize: true })}
            value={cut.total_corte}
        />
    )
}
export default CutListItemDay
