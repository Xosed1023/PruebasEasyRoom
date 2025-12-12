import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { toggleDrawer, toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { DrawerSection } from "./../sections/drawer/Drawer"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Screen from "src/shared/components/layout/screen/Screen"
import { useHeader } from "./../hooks/useTable"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { InputText } from "src/shared/components/forms/input-text/InputText"
import EmptyState from "src/shared/components/layout/empty-state/EmptyState"
import Icon from "src/shared/icons"
import { useFetch } from "./hooks/useFetch"
import { useRows } from "./hooks/useTable"
import "./IncidenciasHabitacion.css"
import buildTable from "../helpers/build-table"
import BuildRows from "../helpers/build-rows"

function IncidenciasHabitacion(): JSX.Element {
    const { incidencias, habitacion, loading, refetch } = useFetch()
    const [incidenciaSelected, setIncidenciaSelected] = useState<string>("")

    const headers = useHeader(incidencias)
    const { search, handleFilter, handleSearch } = useRows(incidencias)

    const dispatch = useDispatch()
    const { isDrawerOpen } = useSelector((state: RootState) => state.navigation)

    const toggleDrawerState = (value: boolean) => dispatch(toggleDrawer(value))

    return (
        <Screen
            title={`Incidencias activas${habitacion ? ` - ${habitacion}` : ""}`}
            headerRight={
                <div className="incidencias-habitacion__search">
                    {!loading && (
                        <InputText
                            value={search}
                            inputWrapperClass="incidencias-habitacion__search-input"
                            icon={Icon}
                            iconProps={{ name: "searchLg", color: "var(--primary)" }}
                            type={"text"}
                            placeholder="Busca por huésped, folio o matrícula"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    )}
                </div>
            }
            close
        >
            <div className="incidencias-habitacion__table">
                {!loading ? (
                    incidencias.length > 0 ? (
                        <FlexibleTable
                            onSelectedFilters={handleFilter}
                            tableItems={{
                                headers,
                                rows: BuildRows(buildTable(incidencias)),
                            }}
                            goTo={(value) => {
                                setIncidenciaSelected(value)
                                toggleDrawerState(true)
                            }}
                            emptyState={{
                                headerIcon: "searchLg",
                                titile: "Sin resultados",
                                subTitle: `No hay resultados para **'${search}'**. Intenta de nuevo.`,
                            }}
                        />
                    ) : (
                        <EmptyState
                            containerClassName="incidencias-habitacion__empty"
                            headerIcon="docFill"
                            title="No hay incidencias activas"
                            subtitle="No hay resultados para esta habitación"
                        />
                    )
                ) : (
                    <TableSkeleton headers={headers} />
                )}
            </div>
            {incidenciaSelected && (
                <DrawerSection
                    incidenciaId={incidenciaSelected}
                    visible={isDrawerOpen}
                    onClose={() => {
                        toggleDrawerState(false)
                        setIncidenciaSelected("")
                        refetch()
                    }}
                    onConfirm={() => {
                        refetch()
                        dispatch(toggleRoomDetailsDrawer(false))
                    }}
                />
            )}
        </Screen>
    )
}

export default IncidenciasHabitacion
