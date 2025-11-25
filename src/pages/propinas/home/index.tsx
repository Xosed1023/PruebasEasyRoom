import { useMemo, useState } from "react"
import { useHeader } from "./hooks/useHeader"
import { useRows } from "./hooks/useTable"
import { useFetch } from "./hooks/useFetch"
import { useCardList } from "./hooks/useCard"
import Empty from "src/shared/components/data-display/empty/Empty"
import { Button } from "src/shared/components/forms/button/Button"
import Screen from "src/shared/components/layout/screen/Screen"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { Card, CardMultiple, CardSkeleton } from "./components/Card"
import { CellActions } from "./components/Cell"
import ConfigButton from "./components/ConfigButton"
import HistorialSelector from "./components/HistorialSelector"
import PagoPropinasButton from "./components/PagoPropinasButton"
import AddPropina from "./sections/modals/add-propina/AddPropina"
import DeletePropina from "./sections/modals/delete-propina/DeletePropina"
import { getDateTitle, getDateTitleForList } from "./helpers/date"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import ConfirmDeletePropina from "./sections/modals/confirm-delete-propina/ConfirmDeletePropina"
import "./Propinas.css"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"

const d = new Date()
const current = new Date(d.getFullYear(), d.getMonth(), d.getDate())

function Propinas(): JSX.Element {
    const [addModal, setAddModal] = useState<boolean>(false)
    const [confirmModal, setConfirmModal] = useState<boolean>(false)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [idDelete, setIdDelete] = useState<string>("")
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    const [page, setPage] = useState(1)
    const rowsPerPage = 10
    const { data, loading, refetch, variables } = useFetch()
    const [showBottomGradient, setShowBottomGradient] = useState(false);


    const empty = data?.length === 0
    const { rows, dinamycData, handleFilter } = useRows(data)

    const paginatedRows = useMemo(() => {
        const startIndex = (page - 1) * rowsPerPage
        const endIndex = startIndex + rowsPerPage
        return rows.slice(startIndex, endIndex)
    }, [rows, page])

    const [date, setDate] = useState<{ label: string; value: string }>({
        label: getDateTitle(current),
        value: current.toISOString(),
    })

    const headers = useHeader(data)

    const { cards, items, items_rs } = useCardList(dinamycData)

    const sameDay = date.value === current.toISOString()

    const handleOpenRemove = (propina_id) => {
        setIdDelete(propina_id)
        setConfirmModal(true)
    }

    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                isOpen={isAuthModalOpen}
                onAuthFilled={(value, sampleData) => {
                    setAddModal(true)
                    setisAuthModalOpen(false)
                }}
                onClose={() => setisAuthModalOpen(false)}
            />
        ),
        authorizedRoles: [RoleNames.recepcionista, RoleNames.admin, RoleNames.superadmin],
        isOpen: isAuthModalOpen,
        onClose: () => setisAuthModalOpen(false),
    })

    return (
        <Screen
            title={!empty ? "Propinas" : ""}
            className="propinas-h__layout"
            contentClassName="propinas-h__screen"
            close
            headerRight={
                <div className="propinas-h__screen__header">
                    <HistorialSelector
                        onDateChange={(date) => {
                            setPage(1)
                            if (date.fecha_inicial) {
                                setDate({
                                    label: getDateTitleForList(date.fecha_inicial, date.fecha_final),
                                    value: date.fecha_inicial,
                                })
                                refetch({ fecha_registro: date })
                            } else {
                                refetch(variables)
                            }
                        }}
                    />
                    <PagoPropinasButton />
                    <ConfigButton />
                </div>
            }
        >
            {!loading ? (
                !empty ? (
                    <div>
                        <p className="propinas-h__subtitle">{date.label}</p>
                        <div className="propinas-h__card-list">
                            {cards.map(({ title = "", value = 0, percent = undefined }, index) => {
                                return index !== 1 && index !== 2 ? (
                                    <Card
                                        key={index}
                                        title={title}
                                        percent={percent}
                                        value={value}
                                        valueColor={index === 0 ? "var(--primary)" : "var(--tipografa)"}
                                        dotColor={index === 3 ? "var(--disponible)" : "var(--deep-purple)"}
                                    />
                                ) : (
                                    <CardMultiple
                                        key={index}
                                        percent={percent}
                                        dotColor={index === 2 ? "var(--limpieza)" : ""}
                                        items={index === 1 ? items : items_rs}
                                    />
                                )
                            })}
                        </div>
                        <TablePaginatorWrapper
                            currentPage={page}
                            onChange={(p) => setPage(p)}
                            pages={Math.ceil(rows.length / rowsPerPage) || 1}
                        >
                            <div className={`propinas-h__table${showBottomGradient ? " propinas-h__table--show-gradient" : ""}`} >
                                <FlexibleTable
                                    onSelectedFilters={handleFilter}
                                    onHasScrollChange={setShowBottomGradient}
                                    tableItems={{
                                        ...{
                                            headers,
                                            rows: paginatedRows.map((row) => ({
                                                value: row.value.map(({ value }, index, arr) => ({
                                                    value:
                                                        index === arr.length - 1 ? (
                                                            <CellActions
                                                                removed={row?.eliminado}
                                                                disabled={value?.corte_id}
                                                                onClick={validateIsColabActive(() => handleOpenRemove(value?.propina_id))}
                                                            />
                                                        ) : (
                                                            <div
                                                                className={
                                                                    row?.eliminado
                                                                        ? "propinas-h__cell-base propinas-h__cell-disabled"
                                                                        : "propinas-h__cell-base"
                                                                }
                                                            >
                                                                {value}
                                                            </div>
                                                        ),
                                                })),
                                            })),
                                        },
                                    }}
                                    emptyState={{
                                        titile: "Sin resultados",
                                        subTitle: "No hay resultados. Intenta de nuevo.",
                                        headerIcon: "HandCoinFilled",
                                    }}
                                />
                            </div>
                        </TablePaginatorWrapper>
                        {sameDay && (
                            <FloatButon
                                className="propinas-h__float-btn"
                                icon="plus"
                                onAdd={validateIsColabActive(() => (skip ? setAddModal(true) : setisAuthModalOpen(true)))}
                            />
                        )}
                    </div>
                ) : (
                    <div className="propinas-h__empty-container">
                        <Empty
                            className="propinas-h__empty"
                            title="No tienes propinas registradas"
                            description={
                                sameDay
                                    ? "Aquí encontrarás el historial completo de tus propinas, tanto las registradas en este módulo como las generadas a través de ventas de habitaciones y room service."
                                    : "No se encontraron propinas registradas"
                            }
                            icon="HandCoinFilled"
                        />
                        {sameDay && (
                            <Button
                                className="propinas-h__empty__button"
                                text="Agregar propina"
                                onClick={() => (skip ? setAddModal(true) : setisAuthModalOpen(true))}
                            />
                        )}
                    </div>
                )
            ) : (
                <div>
                    <div className="propinas-h__subtitle propinas-h__subtitle-block"></div>
                    <div className="propinas-h__card-list">
                        {[1, 2, 3, 4, 5].map((index) => (
                            <CardSkeleton key={index} />
                        ))}
                    </div>
                    <div className="propinas-h__table">
                        <TableSkeleton headers={headers} />
                    </div>
                </div>
            )}
            <AddPropina visible={addModal} closeModal={() => setAddModal(false)} refetch={() => refetch(variables)} />
            <ConfirmDeletePropina
                isOpen={confirmModal}
                refetch={() => refetch(variables)}
                idPropina={idDelete}
                onClose={() => {
                    setConfirmModal(false)
                    setDeleteModal(false)
                }}
                onConfirm={() => {
                    // En caso de no ser admin
                    setConfirmModal(false)
                    setDeleteModal(true)
                }}
            />
            <DeletePropina
                isOpen={deleteModal}
                onClose={() => {
                    setConfirmModal(false)
                    setDeleteModal(false)
                }}
                idPropina={idDelete}
                refetch={() => refetch(variables)}
            />
            {Modal}
            {InactiveModal}
        </Screen>
    )
}

export default Propinas
