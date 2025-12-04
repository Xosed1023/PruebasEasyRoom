import Screen from "@/components/core/layout/screen/Screen"
import Header from "./components/header/Header"
import PieChartIncome from "./components/PieChart/PieChart"
import { useParams } from "react-router"
import { useTotals } from "./hooks/useTotals"
import { useCurrentDateQuery } from "@/gql/schema"
import { dateHelpers } from "@/helpers/dateHelpers"

const TotalDailyIncome = () => {
    const { hotel_id = "" } = useParams()
    const { UTCStringToLocalDate } = dateHelpers()
    const { data } = useCurrentDateQuery()

    const { stats } = useTotals({ hotel_id, date: UTCStringToLocalDate(data?.serverDate) })

    return (
        <Screen className="gap-y-[20px] flex flex-col pb-[20px] pt-[24px]" header={<Header />}>
            {stats.data.map((stat) => (
                <PieChartIncome
                    data={[
                        {
                            color: "var(--sucia)",
                            id: "matutino",
                            label: "Matutino",
                            value: stat.matutino,
                        },
                        {
                            color: "var(--primary)",
                            id: "vespertino",
                            label: "Vespertino",
                            value: stat.vespertino,
                        },
                        {
                            color: "var(--ocupada)",
                            id: "nocturno",
                            label: "Nocturno",
                            value: stat.nocturno,
                        }
                    ]}
                    title={stat.title}
                />
            ))}
        </Screen>
    )
}

export default TotalDailyIncome
