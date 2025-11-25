import React, { useEffect, useMemo } from "react"
import {  useParams } from "react-router-dom"
import { EditOrdenInput, Orden, TipoArticulo, useGetOrdenEditQuery } from "src/gql/schema"
import Screen from "src/shared/components/layout/screen/Screen"
import Table from "./sections/table/Table"

import "./DetalleOrden.css"
import { useForm } from "react-hook-form"
import getFormInitialState from "./helpers/getFormInitialState"
import { useProfile } from "src/shared/hooks/useProfile"
import ResumenDetalleOrden from "./sections/resumen-detalle-orden/ResumenDetalleOrden"
import useLoadingState from "src/shared/hooks/useLoadingState"

export interface ExtraDetalleOrdenItemForm {
    precio: number
    extra_detalle_orden_id: string | null
    almacen_articulo_id: string
    nombre: string
    categoria: string
    categoria_id: string
    cantidad: number
    costo_con_iva: number
    costo_sin_iva: number
    monto_iva: number
    costo: number
}

export interface AlmacenArticuloForm {
    almacen_articulo_id: string
    detalle_orden_id: string
    nombre: string
    cantidad: number
    precio: number
    costo: number
    categoria: string
    categoria_id: string
    comanda_id?: string
    comentarios?: string
    tipo: TipoArticulo
    costo_con_iva: number
    costo_sin_iva: number
    extra_detalle_orden?: ExtraDetalleOrdenItemForm[]
    monto_iva: number
}

export interface DefaultValues extends Omit<EditOrdenInput, "detalles_orden"> {
    detalles_orden: AlmacenArticuloForm[]
}

const DetalleOrden = () => {
    const { hotel_id, usuario_id } = useProfile()

    const { orden_id = "" } = useParams()
    const { data } = useGetOrdenEditQuery({
        variables: {
            input: orden_id,
            hotel_id
        },
    })

    const defaultValues: DefaultValues = useMemo(
        () => getFormInitialState({ orden: data?.orden as Orden, hotel_id, usuario_id }),
        [data]
    )

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { isDirty },
    } = useForm<DefaultValues>()

    const detallesOrden = watch("detalles_orden")

    useEffect(() => {
        Object.entries(defaultValues).map(([key, value]) => {
            setValue(key as keyof typeof defaultValues, value)
        })
    }, [defaultValues])

    const { isLoading, isLoadingDelayed, toggleIsLoading } = useLoadingState()

    const onSubmit = (submitData: DefaultValues) => {
        if (isLoading) {
            return
        }
        toggleIsLoading({ value: true })
    }
 
    return (
        <Screen back title={`Detalle de orden ${data?.orden.orden || ""}`} close>
            <form id="detalle-orden-form" className="detalle-orden-screen" onSubmit={handleSubmit(onSubmit)}>
                <Table detallesOrden={detallesOrden || []} control={control} />
                <ResumenDetalleOrden
                    footerProps={{
                        disabled: isLoadingDelayed || !isDirty,
                        type: "submit",
                        form: "detalle-orden-form",
                        text: "Actualizar orden",
                    }}
                    title="Resumen"
                    detallesOrden={detallesOrden || []}
                />
            </form>
        </Screen>
    )
}

export default DetalleOrden
