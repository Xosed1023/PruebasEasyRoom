import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AddButton } from "src/pages/gastos/components/AddButton/AddGasto"
import DrawerSectionPersonal from "src/pages/personal/components/DrawerSectionPersonal/DrawerSectionPersonal"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Screen from "src/shared/components/layout/screen/Screen"
import { RootState } from "src/store/store"
import "./PersonalTable.css"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import {
    useColaboradoresPorHotelQuery,
    useGetAreasQuery,
    useGetPuestosByHotelIdQuery,
    useGetTurnosQuery,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { formatDateComplitSlash } from "src/shared/hooks/formatDate-DD-MM-YY"
import { selectColaborador, setColaboradores, togglePersonalDrawer } from "src/store/personal/personal.slice"
import SerachLg from "src/shared/icons/SearchLg"
import FingerPrint from "src/shared/icons/FingerPrint"
import { InputText } from "src/shared/components/forms"
import { iLikeText } from "src/shared/helpers/ILikeText"
import useSortTable from "src/shared/hooks/useSortTable"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
const PersonalTable = () => {
    const { hotel_id } = useProfile()
    const dispatch = useDispatch()
    const { colaboradores } = useSelector((root: RootState) => root.personal)
    const [showBottomGradient, setShowBottomGradient] = useState(false);

    const { data: areas } = useGetAreasQuery({
        variables: {
            hotel_id,
        },
    })

    const { data: puestos } = useGetPuestosByHotelIdQuery()

    const { data: turnos } = useGetTurnosQuery({
        variables: {
            hotel_id,
        },
    })

    const [onFilterTable, setOnFilterTable] = useState<
        {
            filter: string
            fromHeader: string
            idx: number
        }[]
    >([])

    const [header, setHeader] = useState<
        { value: string; sort?: boolean; filterMenu?: any[]; isFilterUnique?: boolean }[]
    >([
        {
            value: "No. de Personal",
        },
        {
            value: "Nombre",
        },
        {
            value: "Área",
        },
        {
            value: "Puesto/Rol",
            sort: true,
        },
        {
            value: "Turno",
            sort: true,
        },
        {
            value: "Teléfono",
        },
        {
            value: "Fecha de registro",
            sort: true,
        },
        {
            value: "Permisos",
        },
    ])

    useEffect(() => {
        setHeader([
            {
                value: "No. de Personal",
            },
            {
                value: "Nombre",
            },
            {
                value: "Área",
                filterMenu: areas?.areas.map((a) => ({
                    value: a.nombre || "",
                    valueToDisplay: a.nombre || "",
                })),
                isFilterUnique: true,
            },
            {
                value: "Puesto/Rol",
                filterMenu: puestos?.puestos.map((p) => ({
                    value: p.nombre || "",
                    valueToDisplay: p.nombre || "",
                })),
                isFilterUnique: true,
            },
            {
                value: "Turno",
                filterMenu: turnos?.turnos.map((t) => ({
                    value: t.nombre || "",
                    valueToDisplay: t.nombre || "",
                })),
                isFilterUnique: true,
            },
            {
                value: "Teléfono",
            },
            {
                value: "Fecha de registro",
                sort: true,
            },
            {
                value: "Permisos",
            },
        ])
    }, [areas, puestos, turnos])

    const { data: colaboradoresFromQuery, loading } = useColaboradoresPorHotelQuery({
        variables: {
            hotel_id,
        },
        fetchPolicy: "no-cache",
    })

    const [colaboradoresEditable, setColaboradoresEditable] = useState(colaboradoresFromQuery?.colaboradores)

    useEffect(() => {
        dispatch(setColaboradores(colaboradoresFromQuery?.colaboradores))
    }, [colaboradoresFromQuery])

    useEffect(() => {
        setColaboradoresEditable(colaboradores)
    }, [colaboradores])

    // los colaboradores formateadas para mostrarse en la tabla (este array no se muestra directamente, es para tener una referencia a todas las reservas y hacerle filtros)
    const [dataTables, setDataTables] = useState<
        {
            goTo: string
            value: {
                value: JSX.Element | string
                sortValue?: string
                fromHeaderSort?: string
            }[]
        }[]
    >([])

    // los colaboradores formateados que se que se muestran al inicio después de cambiar de pestaña de puesto
    const [startDataTable, setStartDataTable] = useState<
        {
            goTo: string
            value: {
                value: JSX.Element | string
                sortValue?: string
                fromHeaderSort?: string
            }[]
        }[]
    >([])

    // Inicializar el valor de startDataTable
    useEffect(() => {
        if (!startDataTable.length) {
            setStartDataTable(dataTables)
        }
    }, [dataTables])

    useEffect(() => {
        if (!onFilterTable.length) {
            setDataTables(startDataTable)
            return
        }
        const filteredData = startDataTable.filter((row) =>
            onFilterTable.every((filter) => {
                const column = row.value[filter.idx]
                return column && (column.value as unknown as string) === filter.filter
            })
        )
        setDataTables(filteredData)
    }, [onFilterTable])

    // formatear los colaboradores para la tabla cada vez que cambia el valor del clon de los colaboradores desde la api
    useEffect(() => {
        setDataTables(
            colaboradoresEditable
                ?.map((c) => c)
                ?.sort((d1, d2) => {
                    const dateA = Date.parse(d1.fecha_ingreso || "")
                    const dateB = Date.parse(d2.fecha_ingreso || "")
                    return dateB - dateA
                })
                ?.map((colaborador) => ({
                    goTo: colaborador.colaborador_id || "",
                    value: [
                        {
                            value: `${colaborador.numero_colaborador}`,
                        },
                        {
                            value: `${colaborador.nombre} ${colaborador.apellido_paterno} ${colaborador.apellido_materno}`,
                        },
                        {
                            value: colaborador.area?.nombre || "",
                        },
                        {
                            value: colaborador.colaborador_in_hotel?.[0]?.puesto?.nombre || "",
                            sortValue: colaborador.colaborador_in_hotel?.[0]?.puesto?.nombre || "",
                            fromHeaderSort: header[3].value,
                        },
                        {
                            value: colaborador.turno?.nombre,
                            sortValue: colaborador.turno?.nombre,
                            fromHeaderSort: header[4].value,
                        },
                        {
                            value: colaborador.telefono_personal,
                        },
                        {
                            value: formatDateComplitSlash(colaborador.fecha_ingreso) as any,
                            sortValue: colaborador.fecha_ingreso || "",
                            fromHeaderSort: header[6].value,
                        },
                        {
                            value: (
                                <div className="tableSeccion__personal__permiso ">
                                    {colaborador.telefono_personal ? <FingerPrint /> : "-"}
                                </div>
                            ),
                        },
                    ],
                })) || []
        )
    }, [colaboradoresEditable])

    function toggleDrawerState(value: boolean): void {
        dispatch(togglePersonalDrawer(value))
    }

    const { isPersonalDrawerOpen } = useSelector((state: RootState) => state.personal)
    const navigate = useNavigate()

    const onDelete = () => {
        toggleDrawerState(false)
    }

    const handleSearch = (value: string) => {
        if (!value) {
            return setDataTables(startDataTable)
        }

        setColaboradoresEditable(
            colaboradores.filter((res) => {
                return (
                    iLikeText({
                        fullText: `${res.nombre} ${res.apellido_paterno} ${res.apellido_materno}`,
                        searchText: value,
                    }) || iLikeText({ fullText: res.numero_colaborador, searchText: value })
                )
            }) || []
        )
    }

    const onSortData = (value: { sort: "up" | "down" | null; fromHeader: string; idx: number } | null) => {
        if (!value) {
            return
        }
        setDataTables(
            useSortTable({ i: value.idx, sortedData: dataTables, startList: startDataTable, sortState: value.sort })
        )
    }

    useEscapeKey({
        onEscape: () => {
            if (isPersonalDrawerOpen) {
                return dispatch(togglePersonalDrawer(false))
            }
            navigate("/u/personal")
        },
    })

    return (
        <Screen
            title="Administrador de personal"
            close
            onClose={() => {
                dispatch(togglePersonalDrawer(false))
                navigate("/u/personal")
            }}
        >
            <div className="tableSeccion__personal__header">
                <div className="tableSeccion__personal__search">
                    <div style={{ width: "428px" }}>
                        <InputText
                            icon={SerachLg}
                            type={"text"}
                            disabled={loading}
                            onChange={(v) => handleSearch(v.target.value)}
                            placeholder="Busca por nombre o número de personal"
                        />
                    </div>
                </div>
            </div>
            <div className="tableSeccion__personal__outer-wrapper">
                <div className={`tableSeccion__personal-table${showBottomGradient ? " show-gradient" : ""}`}>
                    {!loading ? (
                        <FlexibleTable
                            tabIndex={-1}
                            maxCellWidth={"150px"}
                            onHasScrollChange={setShowBottomGradient}
                            onSelectedFilters={(value) => setOnFilterTable(value)}
                            onSort={(value) => onSortData(value)}
                            tableItems={{
                                ...{
                                    headers: header,
                                    rows: dataTables.map((table) => ({
                                        ...table,
                                    })),
                                },
                            }}
                            emptyState={{
                                headerIcon: "userAdd",
                                titile: "No se encontró Personal",
                            }}
                            goTo={(id) => {
                                dispatch(selectColaborador(colaboradores?.find((c) => c.colaborador_id === id)))
                                toggleDrawerState(true)
                            }}
                        />
                    ) : (
                        <TableSkeleton headers={header} />
                    )}
                    <DrawerSectionPersonal
                        visible={isPersonalDrawerOpen}
                        onDelete={onDelete}
                        onClose={() => toggleDrawerState(false)}
                    />
                </div>
            </div>
            <AddButton onAdd={() => navigate("/u/addPerson")} />
        </Screen>
    )
}

export default PersonalTable
