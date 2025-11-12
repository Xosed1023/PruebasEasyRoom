import Screen from "src/shared/components/layout/screen/Screen"
import DateFilters from "./sections/DateFilters/DateFilters"
import Cards, { CardsMantenimientoRef } from "./sections/Cards/Cards"
import MantenimientoTable, { EnergeticoData, TableMantenimientoRef } from "./sections/Table/Table"
import "./Mantenimiento.css"
import { useRef, useState } from "react"
import RegistroEnergeticos from "./sections/RegistroEnergeticos/RegistroEnergeticos"
import EditEnergeticos from "./sections/EditEnergeticos/EditEnergeticos"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

const Mantenimiento = () => {
    const [isRegistroModalOpen, setisRegistroModalOpen] = useState(false)
    const [isEditModalOpen, setisEditModalOpen] = useState(false)
    const [editEnergeticoData, setEditData] = useState<EnergeticoData>()
    const [filterDate, setfilterDate] = useState<Date>(new Date())
    const tableRef = useRef<TableMantenimientoRef>(null)
    const cardsRef = useRef<CardsMantenimientoRef>(null)
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()

    return (
        <Screen title="Mantenimiento" headerRight={<DateFilters onChange={(d) => setfilterDate(d)} />} close>
            <div className="mantenimiento__screen__wrapper">
                <Cards ref={cardsRef} startDate={filterDate} />
                <MantenimientoTable
                    ref={tableRef}
                    startDate={filterDate}
                    onEdit={(data) => {
                        setEditData(data)
                        setisEditModalOpen(true)
                    }}
                    onAdd={validateIsColabActive(() => setisRegistroModalOpen(true))}
                />
            </div>
            {isRegistroModalOpen && (
                <RegistroEnergeticos
                    isOpen={isRegistroModalOpen}
                    onClose={() => setisRegistroModalOpen(false)}
                    onSuccess={() => {
                        tableRef.current?.refetch()
                        cardsRef.current?.refetch()
                    }}
                />
            )}
            {isEditModalOpen && (
                <EditEnergeticos
                    startValue={editEnergeticoData}
                    isOpen={isEditModalOpen}
                    onClose={() => setisEditModalOpen(false)}
                    onSuccess={() => {
                        tableRef.current?.refetch()
                        cardsRef.current?.refetch()
                    }}
                />
            )}
            {InactiveModal}
        </Screen>
    )
}

export default Mantenimiento
