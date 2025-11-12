import { useEffect, useMemo, useState } from "react"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { tableItems, tableItemsRecepcion } from "../../data/Gastos.constants"
import { AddButton } from "../AddButton/AddGasto"
import Icon from "src/shared/icons"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { GetGastosQuery, useGetGastosCategorasPorMesCardsQuery } from "src/gql/schema"
import AddModalEdithGasto from "../EdithGAsto/EditGasto"
import AddModalCrearGasto from "../AddModalCrearGasto/AddModalCrearGasto"
import CardsGastosList from "./CardGastosList/CardGastosList"
import { client } from "src/graphql"
import { GetGastosDocument } from "./GastosList.graphql"
import { formatDateComplitSlash } from "src/shared/hooks/formatDate-DD-MM-YY"
import { getHourFormat } from "src/utils/hour"
import { useCurrentRol } from "src/shared/widgets/hooks/general"
import { getExactDate } from "src/utils/date"
import { useGastosList } from "./GastosList.hooks"
import { useProfile } from "src/shared/hooks/useProfile"
import { getFilterDate, getSearchItems, getSortList } from "./GastosList.helpers"
import DeleteModal from "../DeleteModal/DeleteModal"
import { PAYMENT_TYPES } from "src/constants/payments"
import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import { RootState } from "src/store/store"
import { useDispatch, useSelector } from "react-redux"
import { toggleNuevoGastoModalOpen } from "src/store/gastos/gastosSlice"
import { useDate } from "src/shared/hooks/useDate"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import { useCurrentDate } from "src/shared/providers/CurrentdateProvider"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import GastosNotList from "../gastos-not-list/GastosNotList"

export const PAYMENT_METHODS = {
    efectivo: { label: "Efectivo", value: PAYMENT_TYPES.Efectivo },
    visa_o_mastercard: { label: "Visa o Mastercard", value: PAYMENT_TYPES.VisaOMastercard },
    amex: { label: "AMEX", value: PAYMENT_TYPES.amex },
    deposito_o_transferencia: { label: "Depósito/Transfer", value: PAYMENT_TYPES.DepositoOTransferencia },
}

interface GastosRow {
    value: {
        value: string
    }[]
}

interface Props {
    numFolio: number
    search: string
    date: string
    year: string
    reload: () => void
    refetchGastos: () => void
}

const GastosList = ({ numFolio = 0, search = "", date = "", year = "", reload, refetchGastos }: Props) => {
    const mode = useCurrentRol()
    const turnoActual = useTurnoActual()
    const { localDateToUTCString } = useDate()
    const [isModalEditGastoOpen, setisModalEditGastoOpen] = useState(false)
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()

    const { isNuevoGastoModalOpen } = useSelector((state: RootState) => state.gastos)
    const dispatch = useDispatch()

    const [deleteModal, setDeleteModal] = useState(false)
    const [edit, setEdit] = useState(false)
    const [rowsGastos, setRowsGastos] = useState<GastosRow[]>([])

    const [load, setLoad] = useState<boolean>(true)
    const [refresh, setRefresh] = useState<boolean>(false)
    const [gastos, setGastos] = useState<any[]>([])
    const [categoryId, setCategoryId] = useState<string>("")
    const [subCategoryId, setSubCategoryId] = useState<string>("")

    const { hotel_id, myProfile, usuario_id } = useProfile()
    const profile = myProfile.roles?.[0].nombre
    const [slectG, setSelectG] = useState<GetGastosQuery["gastos"][0]>()
    const [page, setPage] = useState(1)
    const rowsPerPage = 10
    const [showGradient, setShowGradient] = useState(false)

    const paginatedRows = useMemo(() => {
        const startIndex = (page - 1) * rowsPerPage
        const endIndex = startIndex + rowsPerPage
        return rowsGastos.slice(startIndex, endIndex)
    }, [rowsGastos, page])

    const { data: gastosDelMes, refetch } = useGetGastosCategorasPorMesCardsQuery({
        variables: {
            gastosCategoria: (parseInt(date) + 1).toString(),
            hotel_id,
        },
    })

    const handleRefresh = () => {
        setRefresh(!refresh)
        if (mode === "ADMINISTRADOR") {
            refetch({
                gastosCategoria: (parseInt(date) + 1).toString(),
                hotel_id,
            })
        } else {
            reload()
        }
    }
    const [currentDate] = useCurrentDate()
    useEffect(() => {
        const filterDate = getFilterDate(year, date, currentDate)
        const [todayMonth, today, todayYear] = [
            currentDate.getMonth(),
            currentDate.getDate(),
            currentDate.getFullYear(),
        ]
        const newToday = new Date(todayYear, todayMonth, today)

        client
            .query({
                query: GetGastosDocument,
                variables: {
                    categoria_id: categoryId || null,
                    hotel_id,
                    subcategoria_id: subCategoryId || null,
                    fecha_gasto:
                        profile === "RECEPCIONISTA"
                            ? { fecha_final: filterDate.end, fecha_inicial: localDateToUTCString(newToday) }
                            : date || year
                            ? {
                                fecha_final:
                                    currentDate.getDate() === new Date(filterDate.end).getDate()
                                        ? currentDate
                                        : filterDate.end,
                                fecha_inicial: filterDate.start,
                            }
                            : null,
                },
            })
            .then(({ data }) => {
                if (data?.gastos) {
                    const dataFilter = getSortList(data?.gastos)
                    const array: GastosRow[] =
                        profile === "RECEPCIONISTA" ? getRowsRecepcion(dataFilter, usuario_id) : getRows(dataFilter)

                    setGastos(dataFilter)
                    setRowsGastos(array)
                } else {
                    setGastos([])
                    setRowsGastos([])
                }
            })
            .catch((e) => {
                setGastos([])
                setRowsGastos([])
                console.log(e)
            })
            .finally(() => setLoad(false))
    }, [date, year, categoryId, subCategoryId, refresh, turnoActual])

    useEffect(() => {
        if (search) {
            const filter = getSearchItems(gastos, search)
            if (filter.length > 0) {
                const order = getSortList(filter)

                const rows = profile === "RECEPCIONISTA" ? getRowsRecepcion(order, usuario_id) : getRows(order)
                setRowsGastos(rows)
            } else {
                setRowsGastos([])
            }
        } else {
            const rows = profile === "RECEPCIONISTA" ? getRowsRecepcion(gastos, usuario_id) : getRows(gastos)
            setRowsGastos(rows)
        }
    }, [search])

    const getRows = (array: any) => {
        return array?.map((gastoData) => {
            const mesGasto = new Date(gastoData?.fecha_gasto).getMonth()
            const mesActual = currentDate.getMonth()
            const fechaRegistro = getExactDate(gastoData?.fecha_registro)

            return {
                value: [
                    {
                        value: (
                            <p className={gastoData.eliminado ? "gastos-table-row-eliminado" : ""}>
                                {gastoData?.usuario?.roles[0]?.nombre === "ADMINISTRADOR" ? "A-" : "R-"}
                                {gastoData?.folio}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p className={`${gastoData.eliminado ? "gastos-table-row-eliminado" : ""} categorias-cell`}>
                                {gastoData?.categoria_gasto?.categoria}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p className={`${gastoData.eliminado ? "gastos-table-row-eliminado" : ""} categorias-cell`}>
                                {gastoData.subcategoria_gasto?.subcategoria || "N/A"}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p
                                className={`${
                                    gastoData.eliminado ? "gastos-table-row-eliminado" : ""
                                } comentarios-cell`}
                            >
                                {gastoData.comentarios || "N/A"}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p className={gastoData.eliminado ? "gastos-table-row-eliminado" : ""}>
                                {formatCurrency(gastoData.monto)}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p className={gastoData.eliminado ? "gastos-table-row-eliminado" : ""}>
                                {PAYMENT_METHODS[gastoData.metodo_pago]?.label || "N/A"}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p className={gastoData.eliminado ? "gastos-table-row-eliminado" : ""}>
                                {gastoData?.caja_chica ? "Si" : "No"}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p className={gastoData.eliminado ? "gastos-table-row-eliminado" : ""}>
                                {gastoData?.usuario?.nombre} {gastoData?.usuario?.apellido_paterno}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p className={gastoData.eliminado ? "gastos-table-row-eliminado" : ""}>
                                {formatDateComplitSlash(fechaRegistro)}
                                <br />
                                {getHourFormat(fechaRegistro)}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p className={gastoData.eliminado ? "gastos-table-row-eliminado" : ""}>
                                {formatDateComplitSlash(gastoData.fecha_gasto)}
                            </p>
                        ),
                    },
                    {
                        value: gastoData.eliminado ? (
                            <div className="gastos-table__icons">
                                <p className="gasto-eliminado-pill">Eliminado</p>
                            </div>
                        ) : (
                            <div className="gastos-table__icons">
                                <div className="gastos-table__icons__item">
                                    <Icon
                                        name="editFill"
                                        height={"20px"}
                                        width={"20px"}
                                        color="var(--primary)"
                                        style={{
                                            opacity:
                                                gastoData.corte_id === null && gastoData.caja_chica === true
                                                    ? 1
                                                    : gastoData.caja_chica === false && mesActual === mesGasto
                                                    ? 1
                                                    : 0.5,
                                        }}
                                        onClick={() => {
                                            skip ? setisModalEditGastoOpen(true) : setisAuthModalOpen(true)
                                            gastoData.corte_id === null && gastoData.caja_chica === true
                                                ? setSelectG(gastoData)
                                                : gastoData.caja_chica === false && mesActual === mesGasto
                                                ? setSelectG(gastoData)
                                                : null
                                            gastoData.corte_id === null && gastoData.caja_chica === true
                                                ? setEdit(true)
                                                : gastoData.caja_chica === false && mesActual === mesGasto
                                                ? setEdit(true)
                                                : null
                                        }}
                                    />
                                </div>
                                <div className="gastos-table__icons__item">
                                    <Icon
                                        name="trashFilled"
                                        color="var(--primary)"
                                        height={"20px"}
                                        width={"20px"}
                                        style={{
                                            opacity:
                                                gastoData.corte_id === null && gastoData.caja_chica === true
                                                    ? 1
                                                    : gastoData.caja_chica === false && mesActual === mesGasto
                                                    ? 1
                                                    : 0.5,
                                        }}
                                        onClick={() => {
                                            gastoData.corte_id === null && gastoData.caja_chica === true
                                                ? setSelectG(gastoData)
                                                : gastoData.caja_chica === false && mesActual === mesGasto
                                                ? setSelectG(gastoData)
                                                : null
                                            gastoData.corte_id === null && gastoData.caja_chica === true
                                                ? setDeleteModal(true)
                                                : gastoData.caja_chica === false && mesActual === mesGasto
                                                ? setDeleteModal(true)
                                                : null
                                        }}
                                    />
                                </div>
                            </div>
                        ),
                    },
                ],
            }
        })
    }

    const getRowsRecepcion = (array: any, usuario_id: string) => {
        const filterdArray = array.filter(
            (gastoArray) => gastoArray.caja_chica === true && gastoArray.usuario_id === usuario_id
        )
        return filterdArray?.map((gastoData) => {
            const fechaRegistro = getExactDate(gastoData.fecha_registro)

            return {
                value: [
                    {
                        value: (
                            <p className={gastoData.eliminado ? "gastos-table-row-eliminado" : ""}>
                                {gastoData?.usuario?.roles[0]?.nombre === "ADMINISTRADOR" ? "A-" : "R-"}
                                {gastoData?.folio}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p className={gastoData.eliminado ? "gastos-table-row-eliminado" : ""}>
                                {gastoData.categoria_gasto.categoria}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p className={gastoData.eliminado ? "gastos-table-row-eliminado" : ""}>
                                {gastoData.subcategoria_gasto?.subcategoria || "N/A"}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p className={gastoData.eliminado ? "gastos-table-row-eliminado" : ""}>
                                {gastoData.comentarios || "N/A"}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p className={gastoData.eliminado ? "gastos-table-row-eliminado" : ""}>
                                {formatCurrency(gastoData.monto)}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p className={gastoData.eliminado ? "gastos-table-row-eliminado" : ""}>
                                {gastoData?.usuario?.nombre} {gastoData?.usuario?.apellido_paterno}
                            </p>
                        ),
                    },
                    {
                        value: (
                            <p className={gastoData.eliminado ? "gastos-table-row-eliminado" : ""}>
                                {formatDateComplitSlash(fechaRegistro)} {getHourFormat(fechaRegistro)}
                            </p>
                        ),
                    },
                    {
                        value: gastoData.eliminado ? (
                            <div className="gastos-table__icons">
                                <p className="gasto-eliminado-pill">Eliminado</p>
                            </div>
                        ) : (
                            <div className="gastos-table__icons">
                                <div className="gastos-table__icons__item">
                                    <Icon
                                        name="editFill"
                                        height={"20px"}
                                        width={"20px"}
                                        color="var(--primary)"
                                        style={{
                                            opacity:
                                                gastoData.corte_id === null && gastoData.usuario_id === usuario_id
                                                    ? 1
                                                    : 0.5,
                                        }}
                                        onClick={validateIsColabActive(() => {
                                            skip ? setisModalEditGastoOpen(true) : setisAuthModalOpen(true)

                                            gastoData.corte_id === null && gastoData.usuario_id === usuario_id
                                                ? setSelectG(gastoData)
                                                : null
                                            gastoData.corte_id === null && gastoData.usuario_id === usuario_id
                                                ? setEdit(true)
                                                : null
                                        })}
                                    />
                                </div>
                                <div className="gastos-table__icons__item">
                                    <Icon
                                        name="trashFilled"
                                        color="var(--primary)"
                                        height={"20px"}
                                        width={"20px"}
                                        style={{
                                            opacity:
                                                gastoData.corte_id === null && gastoData.usuario_id === usuario_id
                                                    ? 1
                                                    : 0.5,
                                        }}
                                        onClick={validateIsColabActive(() => {
                                            gastoData.corte_id === null && gastoData.usuario_id === usuario_id
                                                ? setSelectG(gastoData)
                                                : null
                                            gastoData.corte_id === null && gastoData.usuario_id === usuario_id
                                                ? setDeleteModal(true)
                                                : null
                                        })}
                                    />
                                </div>
                            </div>
                        ),
                    },
                ],
            }
        })
    }

    const { selectedCategorias, selectedSubCategorias, handleSelectCategory } = useGastosList()

    const headersAdmin = useMemo(() => {
        const cateogoriaList: any[] =
            selectedCategorias?.map(({ categoria, categoria_id }) => {
                return {
                    value: categoria_id,
                    valueToDisplay: categoria,
                }
            }) || []

        return [
            {
                value: "#",
            },
            {
                value: "Categoría",
                isFilterUnique: true,
                filterMenu: [
                    {
                        value: "",
                        valueToDisplay: "Todas",
                    },
                    ...cateogoriaList,
                ],
            },
            {
                value: "Subcategoría",
                isFilterUnique: true,
                filterMenu: selectedSubCategorias?.map(({ subcategoria = "", subcategoria_gasto_id = "" }) => {
                    return {
                        value: subcategoria_gasto_id,
                        valueToDisplay: subcategoria,
                    }
                }),
            },
            ...(profile === "ADMINISTRADOR" ? tableItems.headers : tableItemsRecepcion.headers),
        ]
    }, [selectedCategorias, selectedSubCategorias])

    const onSelectedFilters = (params) => {
        if (params.length > 0) {
            const lastItem = params[params.length - 1]
            const { filter = "", fromHeader = "" } = lastItem
            if (fromHeader === "Categoría") {
                if (!params.find((p) => p.fromHeader === "Subcategoría")) {
                    setSubCategoryId("")
                }
                setCategoryId(filter)
                handleSelectCategory(filter)
            }
            if (fromHeader === "Subcategoría") {
                if (!params.find((p) => p.fromHeader === "Categoría")) {
                    setCategoryId("")
                }
                setSubCategoryId(filter)
            }
        } else {
            setCategoryId("")
            handleSelectCategory("")
            setSubCategoryId("")
            const rows = profile === "RECEPCIONISTA" ? getRowsRecepcion(gastos, usuario_id) : getRows(gastos)
            setRowsGastos(rows)
        }
    }

    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                isOpen={isAuthModalOpen}
                onAuthFilled={(value, sampleData) => {
                    setisModalEditGastoOpen(true)
                    setisAuthModalOpen(false)
                }}
                onClose={() => setisAuthModalOpen(false)}
            />
        ),
        authorizedRoles: [RoleNames.recepcionista, RoleNames.admin],
        isOpen: isAuthModalOpen,
        onClose: () => setisAuthModalOpen(false),
    })


    if (!rowsGastos.length) {
        return <GastosNotList reload={reload} refetchGastos={refetchGastos} />
    }

    return (
        <section>
            <div className={(gastosDelMes?.gastos_categoria_por_mes?.length || 0) > 4 ? "gastos-cards-gradientX" : ""}>
                <div className="gastos-cards">
                    {gastosDelMes && mode !== "RECEPCIONISTA" && !load && (
                        <CardsGastosList gastosDelMes={gastosDelMes} loadingGM={load} month={parseInt(date)} />
                    )}
                </div>
            </div>
            <TablePaginatorWrapper
                currentPage={page}
                onChange={(p) => setPage(p)}
                pages={Math.ceil(rowsGastos.length / rowsPerPage) || 1}
            >
                <div className={`gastos-table${showGradient ? " show-gradient" : ""}`}>
                    <FlexibleTable
                        tableItems={{
                            ...{
                                headers: headersAdmin,
                                rows: paginatedRows.map((value) => ({
                                    value: value.value,
                                })),
                            },
                        }}
                        onSelectedFilters={onSelectedFilters}
                        emptyState={{
                            titile: "Sin resultados",
                            subTitle:
                                search !== ""
                                    ? `No hay resultados para **'${search}'**. Intenta de nuevo.`
                                    : "No hay resultados. Intenta de nuevo.",
                            headerIcon: "searchLg",
                        }}
                        onHasScrollChange={setShowGradient}
                    />
                </div>
            </TablePaginatorWrapper>
            <AddButton onAdd={validateIsColabActive(() => dispatch(toggleNuevoGastoModalOpen(true)))} />
            {edit && slectG && isModalEditGastoOpen && (
                <AddModalEdithGasto gasto={slectG} closeModal={() => setEdit(false)} onConfirm={handleRefresh} />
            )}
            {deleteModal && slectG ? (
                <DeleteModal gasto={slectG} onCloseModal={() => setDeleteModal(false)} onConfirm={handleRefresh} />
            ) : null}
            {!!isNuevoGastoModalOpen && (
                <AddModalCrearGasto
                    folio={numFolio}
                    onConfirm={handleRefresh}
                    closeModal={(value) => {
                        dispatch(toggleNuevoGastoModalOpen(value))
                    }}
                />
            )}
            {Modal}
            {InactiveModal}
        </section>
    )
}

export default GastosList
