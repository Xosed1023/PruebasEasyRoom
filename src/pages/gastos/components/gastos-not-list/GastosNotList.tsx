import { useState } from "react"
import EmptyState from "src/shared/components/layout/empty-state/EmptyState"
import AddModalCrearGasto from "../AddModalCrearGasto/AddModalCrearGasto"
import { useCategoriaGastos } from "../../hooks/useCategoriaGastos"

interface Props {
    reload: () => void
    refetchGastos: () => void
}

const GastosNotList = ({ reload, refetchGastos }: Props) => {
    const [openModal, setOpenModal] = useState(false)
    const { data, loading } = useCategoriaGastos()

    const handleRefresh = () => {
        reload()
        refetchGastos()
    }

    return (
        <>
            <div className="gastos-empty-state">
                {!loading ? (
                    (data?.categorias_gasto?.length || 0) > 0 ? (
                        <EmptyState
                            title="No tienes gastos registrados"
                            icon="emptyState"
                            subtitle="Comienza registrando tus gastos aquí"
                            button="Agregar gasto"
                            onClick={() => setOpenModal(true)}
                        />
                    ) : (
                        <EmptyState
                            title="No tienes gastos registrados"
                            icon="emptyState"
                            subtitle="Comienza registrando tus gastos aquí. (Se requieren categorías)."
                        />
                    )
                ) : null}
            </div>
            {!!openModal && (
                <AddModalCrearGasto
                    folio={1}
                    onConfirm={handleRefresh}
                    closeModal={(value) => {
                        setOpenModal(value)
                    }}
                />
            )}
        </>
    )
}

export default GastosNotList
