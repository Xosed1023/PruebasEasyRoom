import { useEffect, useState } from "react"
import Screen from "src/shared/components/layout/screen/Screen"
import "../index.css"
import { InfoButton } from "../components/InfoButton/InfoButton"
import LargeCard from "src/shared/components/data-display/large-card/LargeCard"
import { AddButton } from "../components/AddButton/AddGasto"

import MesajeInfo, { MesajeInfoProps } from "../components/MesajeModal/MesajeModal"
import { AddModal } from "../components/AddModal/AddModal"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import LargeCardSkeleton from "../../../shared/components/data-display/LargeCardSkeleton/LargeCardSkeleton"
import { useProfile } from "src/shared/hooks/useProfile"
import { GET_CATEGORIAS } from "../Gastos-Graphql/queries/get-categorias"
import { useQuery } from "@apollo/client"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { toggleNuevaCategoriaGastoModalOpen } from "src/store/gastos/gastosSlice"

const ConfiguracionGastos = () => {
    const { hotel_id } = useProfile()
    const navigate = useNavigate()
    const { isNuevaCategoriaGastoModalOpen } = useSelector((state: RootState) => state.gastos)
    const dispatch = useDispatch()

    const {
        data: data,
        refetch,
        loading,
    } = useQuery(GET_CATEGORIAS, {
        variables: {
            hotel_id: hotel_id,
        },
    })

    const [mesajeOpen, setMensajeOpen] = useState(false)

    const [sendMesaje, setSendMesaje] = useState<MesajeInfoProps["sendMesaje"]>({
        texto: "",
        success: false,
    })

    let total = 0
    data?.categorias_gasto.map((gasto) => {
        total = gasto.presupuesto + total
    })

    const [titleMensaje, setTitleMensaje] = useState("")

    const mesajeDelete = (value: MesajeInfoProps["sendMesaje"]) => {
        setTitleMensaje("")
        setMensajeOpen(true)
        setSendMesaje(value)
        handleRefreshData()
    }
    const mensajeAddSub = (value: MesajeInfoProps["sendMesaje"]) => {
        setTitleMensaje("Subcategoría creada")
        setMensajeOpen(true)
        setSendMesaje(value)
        handleRefreshData()
    }
    const addCategoriaMesaje = (value: MesajeInfoProps["sendMesaje"]) => {
        setTitleMensaje("Categoría creada")
        setTitleMensaje("")
        dispatch(toggleNuevaCategoriaGastoModalOpen(false))
        setMensajeOpen(true)
        setSendMesaje(value)
        handleRefreshData()
    }
    const mesajeEdit = (value: MesajeInfoProps["sendMesaje"]) => {
        setTitleMensaje("")
        setMensajeOpen(true)
        setSendMesaje(value)
        handleRefreshData()
    }
    const handleRefreshData = () => {
        refetch() // Llama a la función refetch para obtener los datos más recientes.// Llama a la función refetch para obtener los datos más recientes.
    }

    useEffect(() => {
        if (mesajeOpen) {
            setTimeout(() => {
                setMensajeOpen(false)
            }, 5000)
        }
    }, [mesajeOpen])

    useEscapeKey({
        onEscape: () => {
            if (isNuevaCategoriaGastoModalOpen) {
                return dispatch(toggleNuevaCategoriaGastoModalOpen(false))
            }
            navigate(-1)
        },
    })

    return (
        <Screen title="Configuración de categorías de gastos" contentClassName="config-gastos-screen" close={true}>
            {!!mesajeOpen && (
                <MesajeInfo
                    title={
                        titleMensaje
                            ? titleMensaje
                            : sendMesaje.success
                            ? "Cambios guardados"
                            : "Error al guardar los cambios"
                    }
                    sendMesaje={sendMesaje}
                    closeModal={() => setMensajeOpen(false)}
                />
            )}

            <div className="config-gastos-subtitle-container">
                <p className="config-gastos-subtitle">Presupuesto total:</p>
                <p className="config-gastos-subtitle-total">{formatCurrency(total)}</p>
                <InfoButton />
            </div>
            <div className="config-gastos-cards">
                {data &&
                    data.categorias_gasto.map((dataInfo, index) => (
                        <LargeCard
                            key={index}
                            title={dataInfo.categoria}
                            subtitle={""}
                            gastos={0}
                            onSubDelete={(value) => mesajeDelete(value)}
                            limiteMensual={String(dataInfo.limite_mensual)}
                            presupuesto={String(dataInfo.presupuesto)}
                            id={dataInfo.categoria_id}
                            subCategorias={dataInfo.subcategorias_de_categoria}
                            onSubAdd={(value) => mensajeAddSub(value)}
                            onEditMesaje={(value) => mesajeEdit(value)}
                            predeterminado={dataInfo.predeterminado}
                        />
                    ))}
                {loading && <LargeCardSkeleton />}
            </div>
            <AddButton
                onAdd={() => {
                    dispatch(toggleNuevaCategoriaGastoModalOpen(true))
                }}
            />

            <AddModal
                isOpen={isNuevaCategoriaGastoModalOpen}
                onClose={() => dispatch(toggleNuevaCategoriaGastoModalOpen(false))}
                onSub={(value) => {
                    addCategoriaMesaje(value)
                }}
            />
        </Screen>
    )
}

export { ConfiguracionGastos }
