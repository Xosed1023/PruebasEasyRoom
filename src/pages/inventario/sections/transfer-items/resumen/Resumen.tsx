import { useFormContext, useWatch } from "react-hook-form"
import "../TransferItems.css"
import Empty from "src/shared/components/data-display/empty/Empty"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { FormValues } from "../TransferItems.types"
import { useGetArticuloForSearchLazyQuery } from "src/gql/schema"
import { useEffect, useState } from "react"
import { useProfile } from "src/shared/hooks/useProfile"

const ResumenTransfer = ({ data, onSubmit }: { data: any[]; onSubmit: () => void }) => {
    const { control } = useFormContext<FormValues>()
    const articulos = useWatch({ control, name: "articulos" })
    const { hotel_id } = useProfile()

    const sumarCantidad = (articulos) => {
        return articulos?.reduce((total, articulo) => {
            const cantidad = parseFloat(articulo.cantidad) || 0 // Si no es un número válido, se considera 0
            return total + cantidad
        }, 0)
    }

    const isEmpty = (articulos) => {
        if (articulos && Array.isArray(articulos)) {
            return articulos?.every((articulo) => {
                const nombreVacio = articulo.nombre
                    ? Object.values(articulo.nombre).every((valor) => valor === "")
                    : true

                const otrosCamposVacios = Object.values({
                    almacen_origen: articulo.almacen_origen ?? "",
                    almacen_destino: articulo.almacen_destino ?? "",
                    disponible: articulo.disponible ?? 0,
                    cantidad: articulo.cantidad ?? 0,
                }).every((valor) => valor === "" || valor === 0)

                return nombreVacio && otrosCamposVacios
            })
        } else {
            return true
        }
    }

    const [articulosData, setArticulosData] = useState<any[]>([])
    const [search] = useGetArticuloForSearchLazyQuery()

    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                const fetchedArticulos = await Promise.all(
                    articulos?.map(async (art) => {
                        const { data } = await search({
                            variables: { articulo_id: art.articulo_id, hotel_id },
                        })
                        return data
                    })
                )
                setArticulosData(fetchedArticulos)
            } catch (error) {
                console.error("Error al obtener los artículos:", error)
            }
        }

        if (articulos) {
            fetchArticulos()
        }
    }, [articulos, search])

    return (
        <div className="transfer-items__resumen">
            <div className="pago-propinas__resumen__header">
                <span className="pago-propinas__resumen__header__text">Resumen</span>
            </div>
            <div className="transfer-items__resumen__body">
                {isEmpty(articulos) ? (
                    <Empty
                        borderStyle={{
                            height: 100,
                            width: 100,
                        }}
                        title="No hay artículos a transferir"
                        icon="arrows"
                        iconStyle={{
                            width: 50,
                            height: 50,
                        }}
                    />
                ) : (
                    <div style={{ width: "100%" }}>
                        {articulos?.map((art, index) => (
                            <div key={index} className="transfer-items__articulos__container">
                                <p className="transfer-items__articulos__title">
                                    {articulosData[index]?.almacenes_articulos?.almacenes_articulos[0]?.articulo
                                        ?.descripcion || "-"}
                                </p>
                                {art.cantidad && (
                                    <p className="transfer-items__articulos__subtitle">{art.cantidad} pz</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {!isEmpty(articulos) && (
                <>
                    <div className="transfer-items__resumen__info__footer">
                        <p className="transfer-items__resumen__info__subtitle">Total tipo de artículos</p>
                        <p className="transfer-items__resumen__info__subtitle">{articulos?.length}</p>
                    </div>
                    <div className="transfer-items__resumen__footer__divider--smaller"></div>
                    <div className="transfer-items__resumen__info__footer">
                        <p className="transfer-items__resumen__info__title">Total artículos</p>
                        <p className="transfer-items__resumen__info__title">{sumarCantidad(articulos)}</p>
                    </div>
                </>
            )}

            <div className="transfer-items__resumen__footer">
                <div className="transfer-items__resumen__footer__divider"></div>
                <PrimaryButton text="Transferir" onClick={onSubmit} />
            </div>
        </div>
    )
}

export default ResumenTransfer
