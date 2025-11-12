import "./TablesCards.css"
import TableCard from "../TableCard/TableCard"
import { useRestaurantDarwer } from "../../detail/hooks/drawer"
import { RootState } from "src/store/store"
import { useSelector } from "react-redux"
import { useSetCardSize } from "../../hooks/useSetCardSize"
import { useRef } from "react"

const TablesCards = () => {
    const { onOpen, setMesa, onStopLoading } = useRestaurantDarwer()
    const { mesas, tablesDimensions } = useSelector((root: RootState) => root.restaurant)
    const cardsRef = useRef<HTMLDivElement>(null)
    useSetCardSize(cardsRef)

    return (
        <div className="tables-cards__wrapper">
            <div
                className="tables-cards"
                style={{
                    gridTemplate: `repeat(${tablesDimensions?.x}, 1fr) / repeat(${tablesDimensions?.y}, 1fr)`,
                }}
                ref={cardsRef}
            >
                {mesas?.map((mesa, index) => (
                    <TableCard
                        style={{
                            gridArea: `${mesa?.posicion?.y}/ ${mesa?.posicion?.x} / span 1 / span 1`,
                        }}
                        key={index}
                        onSelect={() => {
                            onOpen()
                            setMesa(mesa)
                            onStopLoading()
                        }}
                        mesa={mesa}
                    />
                ))}
            </div>
        </div>
    )
}

export default TablesCards
