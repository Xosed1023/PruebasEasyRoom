import TotalIncome from "../../components/total-income/TotalIncome"
import HotelList from "../../components/hotel-list/HotelList"

const General = ({hotel_id}: {hotel_id: string}) => {
    return (
        <>
            <HotelList hotel_id={hotel_id} />
            <TotalIncome hotel_id={hotel_id} />
        </>
    )
}

export default General
