import React, { useEffect, useState } from "react"

import Drawer from "src/shared/components/layout/drawer/Drawer"
import Header from "../product-details/sections/header/Header"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import alimentoImg from "../../../../assets/webp/Producto.webp"
import {
    GetAlmacenArticuloByIdQuery,
    TipoArticulo,
    useColaboradorQuery,
    useSalida_InventarioQuery,
    useSurtidoQuery,
} from "src/gql/schema"
import insumoImg from "../../../../assets/webp/Insumo.webp"
import { getCurrencyFormat } from "src/utils/string"

const MovementDetails = ({
    almacenArticulo,
    onClose,
    isOpen,
    info,
}: {
    almacenArticulo?: GetAlmacenArticuloByIdQuery
    onClose: () => void
    isOpen: boolean
    info: string
}) => {
    const [data, setData] = useState<any>()

    useEffect(() => {
        const infoData: any = () => {
            try {
                return JSON.parse(info)
            } catch (error) {
                return null
            }
        }
        setData(infoData)
    }, [info])

    const Tipo = {
        nuevo: "Nuevo producto",
        surtido: "Resurtido",
        room_service: "Room service",
        merma: "Merma",
        producto_caducado: "Producto caducado",
        producto_faltante: "Producto faltante",
    }

    const { data: surtido } = useSurtidoQuery({
        variables: {
            surtido_id: data?.surtido_id || "",
        },
    })

    const { data: salida } = useSalida_InventarioQuery({
        variables: {
            salida_id: data?.salida_id || "",
        },
    })

    const { data: colaborador } = useColaboradorQuery({
        variables: {
            colaborador_id:
                data?.tipo === "room_service" || data?.tipo === "merma" || data?.tipo === "producto_caducado"
                    ? salida?.salida_inventario?.colaborador_id || ""
                    : surtido?.surtido?.colaborador_id || "",
        },
    })

    return (
        <Drawer placement={"right"} bar={false} visible={isOpen} withCloseButton={true} onClose={() => onClose()}>
            <Header
                subtitle={almacenArticulo?.almacen_articulo.articulo?.descripcion || ""}
                title={almacenArticulo?.almacen_articulo.articulo?.nombre || ""}
                photoUrl={
                    almacenArticulo?.almacen_articulo.articulo?.foto
                        ? almacenArticulo?.almacen_articulo.articulo?.foto
                        : almacenArticulo?.almacen_articulo.articulo?.tipo === TipoArticulo.Insumo
                        ? insumoImg
                        : alimentoImg
                }
            />
            <div className="product-details__drawer__body">
                <div>
                    <DescriptionDetail
                        icon="packageFill"
                        value={Tipo[data?.tipo]}
                        label={
                            data?.tipo === "room_service" ||
                            data?.tipo === "merma" ||
                            data?.tipo === "producto_caducado"
                                ? "Tipo de salida"
                                : "Tipo de entrada"
                        }
                        style={{
                            padding: "12px",
                        }}
                    />
                    <DescriptionDetail
                        icon="CoinsFill"
                        value={getCurrencyFormat(surtido?.surtido?.costo_unitario || "-") + ""}
                        label="Costo por unidad"
                        style={{
                            padding: "12px",
                        }}
                    />
                    {surtido?.surtido && (
                        <DescriptionDetail
                            icon="HandCoinFilled"
                            value={getCurrencyFormat(surtido?.surtido?.costo_total || "-") + ""}
                            label="Costo total del surtido"
                            style={{
                                padding: "12px",
                            }}
                        />
                    )}
                    <DescriptionDetail
                        icon="userParentSingle"
                        value={
                            colaborador?.colaborador?.nombre +
                                " " +
                                colaborador?.colaborador?.apellido_paterno +
                                " " +
                                colaborador?.colaborador?.apellido_materno || "-"
                        }
                        label="Responsable"
                        style={{
                            padding: "12px",
                        }}
                    />
                    {data?.tipo === "room_service" ||
                        data?.tipo === "merma" ||
                        (data?.tipo === "producto_caducado" && (
                            <DescriptionDetail
                                icon="communication"
                                value={salida?.salida_inventario?.comentario || ""}
                                label="Comentario"
                                style={{
                                    padding: "12px",
                                }}
                            />
                        ))}
                </div>
            </div>
        </Drawer>
    )
}

export default MovementDetails
