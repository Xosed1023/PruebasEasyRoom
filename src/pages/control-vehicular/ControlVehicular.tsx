import Screen from "src/shared/components/layout/screen/Screen"
import DateFilter from "../reports/components/date-filter/DateFilter"
import HeaderLeft from "../reports/components/header-left/HeaderLeft"
import { useState } from "react"
import { useDate } from "src/shared/hooks/useDate"
import Matriculas from "../reports/sections/matriculas/Matriculas"
import FormatUTCDateToApiDate from "../Cortes/EjmPDF/sections/helpers/FormatUTCDateToApiDate"
import { useProfile } from "src/shared/hooks/useProfile"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

const ControlVehicular = () => {
    const { areSameDay, localDateToUTCString } = useDate()
    const { nombre_turno_hotel } = useProfile()
    const { formatCustomDate } = useFormatDate()

    const [dateFilter, setdateFilter] = useState<Date[] | null>(null)

    const apiDateFilter = dateFilter
        ? [
            FormatUTCDateToApiDate(localDateToUTCString(dateFilter[0]), true),
            FormatUTCDateToApiDate(localDateToUTCString(dateFilter[1]), true),
        ]
        : null

    return (
        <Screen
            title={"Control vehicular"}
            close
            headerLeft={
                <HeaderLeft label={`Turno ${nombre_turno_hotel}`}>
                    {(dateFilter?.length || 0) > 1 && areSameDay(dateFilter?.[0], dateFilter?.[1])
                        ? formatCustomDate(dateFilter![0], "DD/MMM/YY")
                        : dateFilter?.length === 2
                        ? `${formatCustomDate(dateFilter![0], "DD/MMM/YY")} al ${formatCustomDate(
                              dateFilter![1],
                              "DD/MMM/YY"
                        )}`
                        : ""}
                </HeaderLeft>
            }
            headerRight={<DateFilter onChange={(v) => setdateFilter(v)} />}
        >
            <Matriculas apiDateFilter={apiDateFilter} canDownload={false} canDelete={false} />
        </Screen>
    )
}

export default ControlVehicular
