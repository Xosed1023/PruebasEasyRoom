import Screen from "@/components/core/layout/screen/Screen"
import General from "./sections/general/General"
import RoomStatus from "./sections/room-status/RoomStatus"
import Occupation from "./sections/occupation/Occupation"
import RoomSales from "./sections/room-sales/RoomSales"
import Staff from "./sections/staff/Staff"
import Incidences from "./sections/incidences/Incidences"
import Header from "../../components/core/layout/header/Header"
import NavbarNavigator from "@/components/core/navigation/navbar"
import { Renta, useCurrentDateQuery, useRentasLazyQuery } from "@/gql/schema"
import { useEffect } from "react"
import { dateHelpers } from "@/helpers/dateHelpers"
import { useProfile } from "@/hooks/store/useProfile"

const Home = () => {
    const { hotel_id } = useProfile()
    const { data } = useCurrentDateQuery()
    const { getDayHoursRange, UTCStringToLocalDate } = dateHelpers()

    const [getRentas, rentas] = useRentasLazyQuery()
    useEffect(() => {
        if (data?.serverDate) {
            const { fecha_final, fecha_inicial } = getDayHoursRange(UTCStringToLocalDate(data.serverDate))
            getRentas({
                variables: {
                    fecha_registro: {
                        fecha_final,
                        fecha_inicial,
                    },
                    renta_id: [],
                    hotel_id,
                },
            })
        }
    }, [data, hotel_id])

    return (
        <Screen className="gap-y-[20px] flex flex-col pb-[20px]" header={<Header />} footer={<NavbarNavigator />}>
            <General hotel_id={hotel_id} />
            <RoomStatus hotel_id={hotel_id} />
            <Occupation hotel_id={hotel_id} rentas={(rentas.data?.rentas as Renta[]) || []} />
            <RoomSales rentas={(rentas.data?.rentas as Renta[]) || []} />
            <Staff hotel_id={hotel_id} />
            <Incidences hotel_id={hotel_id} />
        </Screen>
    )
}

export default Home
