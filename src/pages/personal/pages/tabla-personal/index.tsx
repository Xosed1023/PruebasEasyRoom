import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Area, useGetAreasQuery } from "src/gql/schema"
import { RootState } from "src/store/store"
import { togglePersonalTurnoDrawer } from "src/store/personal/personal.slice"
import FlexibleTable, { FlexibleTableRef } from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Screen from "src/shared/components/layout/screen/Screen"
import { Tooltip } from "src/pages/inventario/producto/form/sections/Tooltip"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"
import { useCurrentRol } from "src/shared/widgets/hooks/general"
import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useProfile } from "src/shared/hooks/useProfile"
import DrawerSection from "../../sections/DrawerSection/DrawerSection"
import AlertTaskModal from "./modals/alert-task"
import { useHeader, useRows } from "./hooks/useTable"
import { useFetch } from "./hooks/useFetch"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import InputSearch from "./components/InputSearch"
import ButtonPersonal from "./components/ButtonPersonal"
import { CellSelector } from "./components/Cell"
import { AlertModalState } from "./types/screen"
import { AreasName, tabs } from "../../inicio.constants"
import "./TablaPersonal.css"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import TabMenuPersonal from "./components/TabMenuPersonal/TabMenuPersonal"
import useChangeTurno from "./hooks/useChangeTurno"

function TablaPersonal(): JSX.Element {
    const { hotel_id } = useProfile()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()
    const [alertModal, setAlertModal] = useState<AlertModalState>({ nombre: "", visible: false })
    const flexibleTableRef = useRef<FlexibleTableRef>(null)
    const [page, setpage] = useState(1)
    const [searchValue, setsearchValue] = useState("")

    const { data: areas } = useGetAreasQuery({
        variables: {
            hotel_id,
        },
    })

    const [path, setPath] = useState<AreasName>(tabs[0].path)

    const getColabProps = useMemo(
        () => ({
            path,
            areas_filter: [areas?.areas.find((area) => area.nombre === path)?.area_id || ""],
            page,
            searchValue,
        }),
        [areas, path, page, searchValue]
    )

    const { data, load, handleSelectItem, handleRefetch, totalPages, handleFilter } = useFetch(getColabProps)

    const headers = useHeader(data, path)
    const [isSearching, setisSearching] = useState(false)
    const { getRowFormat } = useRows(path)

    const turno = useTurnoActual()
    const rol = useCurrentRol()
    const { isPersonalTurnoDrawerOpen } = useSelector((root: RootState) => root.personal)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { skeletonRows } = tableSkeletonRows({ headers })
    const { handleChangeTurno, loadId } = useChangeTurno({ colaboradores: data, handleRefetch, setAlertModal })
    const [showBottomGradient, setShowBottomGradient] = useState(false)

    useEffect(() => {
        setpage(1)
    }, [path])

    useEscapeKey({
        onEscape: () => {
            if (isPersonalTurnoDrawerOpen) {
                return dispatch(togglePersonalTurnoDrawer(false))
            }
            navigate("/u")
        },
    })

    useEffect(() => {
        flexibleTableRef.current?.setFiltersFromOuterState([])
    }, [path])

    return (
        <Screen
            className="tabla-personal_layout"
            contentClassName="tabla-personal__content"
            title="Personal activo en turno"
            headerRight={
                <div className="tabla-personal__header-right">
                    <InputSearch
                        onChange={(e) => {
                            setsearchValue(e)
                            if (e) {
                                setpage(1)
                                return setisSearching(true)
                            }
                            setisSearching(false)
                        }}
                    />
                    {rol !== RoleNames.recepcionista && <ButtonPersonal />}
                </div>
            }
        >
            <div>
                <div className="tabla-personal__tooltip">
                    <Tooltip
                        placement={"bottom"}
                        title="Personal activo en turno"
                        description="Personal disponible para asignar tareas de limpieza y mantenimiento en turno."
                    />
                </div>

                {!load ? (
                    <p className="tabla-personal__subtitle">{`Turno: ${turno?.nombre || ""}`}</p>
                ) : (
                    <Skeleton.Item style={{ height: 18, marginTop: 2, width: 135 }} />
                )}
                <TabMenuPersonal areas={(areas?.areas as Area[]) || []} onChange={(v) => setPath(v)} value={path} />
                <TablePaginatorWrapper currentPage={page} onChange={(p) => setpage(p)} pages={totalPages}>
                    <div className={`tabla-personal__contain-table${showBottomGradient ? " tabla-personal__contain-table--show-gradient" : ""}`}>
                        <FlexibleTable
                            goTo={handleSelectItem}
                            onHasScrollChange={setShowBottomGradient}
                            ref={flexibleTableRef}
                            onSelectedFilters={(e) => {
                                setpage(1)
                                handleFilter(e)
                            }}
                            tableItems={{
                                ...{
                                    headers,
                                    rows: load
                                        ? skeletonRows
                                        : getRowFormat(data).map((row) => ({
                                            goTo: row?.goTo,
                                            value: row.value.map(({ value }, index) => ({
                                                value: CellSelector({
                                                    index,
                                                    loadId,
                                                    onChange: validateIsColabActive((switchValue) => {
                                                        if (!loadId)
                                                            handleChangeTurno(value?.colaborador_id, switchValue)
                                                    }),
                                                    path,
                                                    value,
                                                }),
                                            })),
                                        })),
                                },
                            }}
                            emptyState={isSearching ? {
                                titile: "Sin resultados",
                                subTitle: "No hay resultados. Intenta de nuevo.",
                                headerIcon: "userFilled",
                            } : {
                                titile: "Sin personal registrado",
                                subTitle: "Comienza a registrar al personal de tu hotel aquí",
                                headerIcon: "UserPlus"
                            }}
                        ></FlexibleTable>
                    </div>
                </TablePaginatorWrapper>
                <AlertTaskModal
                    visible={alertModal.visible}
                    name={alertModal.nombre}
                    onClose={() => setAlertModal({ nombre: "", visible: false })}
                />
            </div>
            <DrawerSection handleRefetch={handleRefetch} />
            {InactiveModal}
        </Screen>
    )
}

export default TablaPersonal
