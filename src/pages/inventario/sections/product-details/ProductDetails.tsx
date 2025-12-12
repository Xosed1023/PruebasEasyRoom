import { useEffect, useMemo, useState } from "react"

import "./ProductDetails.css"
import Drawer from "src/shared/components/layout/drawer/Drawer"
import Header from "./sections/header/Header"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { div, times, minus } from "src/shared/helpers/calculator"
import { Button } from "src/shared/components/forms"
import { SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { ModalConfirm } from "src/shared/components/layout"
import Icon from "src/shared/icons"
import BoldText from "src/shared/components/layout/modal-confirm/component-helpers/BoldText/BoldText"
import useSnackbar from "src/shared/hooks/useSnackbar"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { useNavigate } from "react-router-dom"
import RefillProduct from "../../modals/RefillProduct/RefillProduct"
import OutputProduct from "../../modals/OutputProduct/OutputProduct"
import {
    EstadosAlmacenesArticulos,
    EstadosArticulo,
    GetAlmacenArticuloByIdQuery,
    TipoArticulo,
    UnidadMedidasArticulo,
    useActualizarProductoMutation,
    useAlmacenesLazyQuery,
    useAlmacenes_ArticulosLazyQuery,
    useConfiguracionInventarioLazyQuery,
    useEliminarArticuloMutation,
} from "src/gql/schema"
import Text from "src/shared/components/layout/modal-confirm/component-helpers/Text/Text"
import { useProfile } from "src/shared/hooks/useProfile"
import TransferProduct from "../../modals/TransferProduct/TransferProduct"
import AuthRequiredModal from "../../modals/Auth/AuthRequiredModal/AuthRequiredModal"
import { getCurrencyFormat } from "src/utils/string"
import { TypeArticleDeleteUnique } from "../../constants/inventory"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

const ProductDetails = ({
    almacenArticulo,
    onClose,
    isOpen,
    onConfirmChange,
    deactivateType,
    activateType,
}: {
    almacenArticulo?: GetAlmacenArticuloByIdQuery
    onClose: () => void
    isOpen: boolean
    onConfirmChange: () => void
    deactivateType: any
    activateType: any
}) => {
    const [isModalDesactivarOpen, setIsModalDesactivarOpen] = useState<boolean>(false)
    const [isModalActivarOpen, setIsModalActivarOpen] = useState<boolean>(false)
    const [isModalEliminarOpen, setIsModalEliminarOpen] = useState<boolean>(false)
    const [isModalRefillProductOpen, setIsModalRefillProductOpen] = useState<boolean>(false)
    const [isModalOutputProductOpen, setIsModalOutputProductOpen] = useState<boolean>(false)
    const [isModalTransferProductOpen, setIsModalTransferProductOpen] = useState<boolean>(false)
    const [configInventario, setConfigInventario] = useState<boolean>(false)
    const [authSuccess, setauthSuccess] = useState<{
        state: boolean
        type: "activar" | "desactivar" | "eliminar" | ""
    }>({ state: false, type: "" })
    const [almacenes, setAlmacenes] = useState<any>()
    const [articulosAlmacen, setArticulosAlmacen] = useState<any>()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const { showSnackbar } = useSnackbar()
    const { showMiniSnackbar } = useMiniSnackbar()
    const { hotel_id } = useProfile()

    const [isLoading, setisLoading] = useState<boolean>(false)
    const [updateProduct] = useActualizarProductoMutation()
    const [eliminarArticulo] = useEliminarArticuloMutation()
    const navigate = useNavigate()
    const { formatCustomDate } = useFormatDate()

    const precio = Number(almacenArticulo?.almacen_articulo?.articulo?.precio?.monto || 0)
    const costo = Number(almacenArticulo?.almacen_articulo?.articulo?.costo?.monto || 0)
    const tipo = almacenArticulo?.almacen_articulo?.articulo?.tipo

    const [getConfig] = useConfiguracionInventarioLazyQuery({
        variables: {
            hotel_id,
        },
    })

    const [getAlmacenes] = useAlmacenesLazyQuery()

    const getDataAlmacenes = async () => {
        try {
            const { data } = await getAlmacenes({
                variables: {
                    hotel_id: hotel_id,
                },
            })
            const AlmacenesData = data?.almacenes || []
            if (AlmacenesData.length > 0) {
                setAlmacenes(AlmacenesData)
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (hotel_id) {
            getConfig({
                variables: {
                    hotel_id,
                },
            }).then((data) => {
                if (data.data) {
                    const config = data?.data?.configuraciones_inventario[0]?.inventario_negativo
                    config ? setConfigInventario(config) : setConfigInventario(false)
                }
            })
        }
    }, [hotel_id])

    const [getAlmacenesArticulos] = useAlmacenes_ArticulosLazyQuery()

    const getDataAlmacenesArticulos = async () => {
        try {
            const { data } = await getAlmacenesArticulos()
            const AlmacenesArticulosData = data?.almacenes_articulos.almacenes_articulos || []
            if (AlmacenesArticulosData.length > 0) {
                setArticulosAlmacen(AlmacenesArticulosData)
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!almacenes) {
            getDataAlmacenes()
        }
        if (!articulosAlmacen) {
            getDataAlmacenesArticulos()
        }
    }, [almacenes, articulosAlmacen])

    const desactivar = () => {
        setisLoading(true)
        updateProduct({
            variables: {
                articulo_input: {
                    articulo_id: almacenArticulo?.almacen_articulo.articulo?.articulo_id || "",
                    estado: EstadosArticulo.Desactivado,
                    almacen_id: almacenArticulo?.almacen_articulo.almacen?.almacen_id,
                    hotel_id
                },
            },
        })
            .then(() => {
                onConfirmChange()
                const isInsumo = almacenArticulo?.almacen_articulo.articulo?.tipo === TipoArticulo.Insumo
                showMiniSnackbar({
                    text: `Se desactivó este ${isInsumo ? "artículo" : "producto"} correctamente.`,
                    status: "success",
                    title: `${isInsumo ? "Artículo" : "Producto"} desactivado`,
                })
            })
            .catch(() => {
                const isInsumo = almacenArticulo?.almacen_articulo.articulo?.tipo === TipoArticulo.Insumo
                showMiniSnackbar({
                    status: "error",
                    title: `Error al desactivar el ${isInsumo ? "artículo" : "producto"}`,
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })
            })
            .finally(() => {
                setisLoading(false)
            })
    }

    const activar = () => {
        setisLoading(true)
        updateProduct({
            variables: {
                articulo_input: {
                    articulo_id: almacenArticulo?.almacen_articulo.articulo?.articulo_id || "",
                    estado: EstadosArticulo.Activado,
                    hotel_id
                },
            },
        })
            .then(() => {
                onConfirmChange()
                const isInsumo = almacenArticulo?.almacen_articulo.articulo?.tipo === TipoArticulo.Insumo
                showMiniSnackbar({
                    text: `Se activó este ${isInsumo ? "artículo" : "producto"} correctamente.`,
                    status: "success",
                    title: `${isInsumo ? "Artículo" : "Producto"} activado`,
                })
            })
            .catch(() => {
                const isInsumo = almacenArticulo?.almacen_articulo.articulo?.tipo === TipoArticulo.Insumo
                showMiniSnackbar({
                    status: "error",
                    title: `Error al activar el ${isInsumo ? "artículo" : "producto"}`,
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })
            })
            .finally(() => {
                setisLoading(false)
            })
    }

    const eliminar = () => {
        setisLoading(true)
        eliminarArticulo({
            variables: {
                almacen_articulo_input: {
                    almacen_articulo_id: [almacenArticulo?.almacen_articulo?.almacen_articulo_id || ""],
                },
            },
        })
            .then(() => {
                onConfirmChange()
                showSnackbar({
                    text: `El artículo **"${almacenArticulo?.almacen_articulo?.articulo?.nombre} - ${almacenArticulo?.almacen_articulo.articulo?.contenido}${almacenArticulo?.almacen_articulo.articulo?.unidad}"** fue eliminado del inventario`,
                    status: "success",
                    title: `${
                        almacenArticulo?.almacen_articulo.articulo?.tipo === "venta" ? "Producto" : "Artículo"
                    } eliminado`,
                })
                onClose()
            })
            .catch(() => {
                showMiniSnackbar({
                    status: "error",
                    title: "Error al eliminar el producto",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })
            })
            .finally(() => {
                setisLoading(false)
            })
    }

    const verificarUnicoAlmacenPorArticulo = (articulo_id) => {
        const almacenesAsociados = articulosAlmacen?.filter(
            (almacenArticulo) => almacenArticulo.articulo_id === articulo_id
        )
        if (almacenesAsociados && almacenesAsociados.length === 1) {
            return true
        }
        return false
    }

    function obtenerNombreAlmacenPorArticulo(articuloId) {
        const articuloAlmacen = articulosAlmacen?.find((almacenArticulo) => almacenArticulo.articulo_id === articuloId)
        const almacen = almacenes?.find((alm) => alm.almacen_id === articuloAlmacen?.almacen_id)
        return almacen?.nombre || "-"
    }

    const authorizedRoles = useMemo(() => {
        if (authSuccess.type === "desactivar" || authSuccess.type === "activar" || authSuccess.type === "eliminar") {
            return [RoleNames.superadmin, RoleNames.admin, RoleNames.recepcionista, RoleNames.cocina, RoleNames.bar]
        }
        return [RoleNames.superadmin, RoleNames.admin]
    }, [authSuccess])

    const { Modal } = useAuth({
        authModal: (
            <AuthRequiredModal
                authorizedRoles={[RoleNames.superadmin, RoleNames.admin, RoleNames.recepcionista, RoleNames.cocina, RoleNames.bar]}
                authorizedPins={[RoleNames.superadmin, RoleNames.admin]}
                title="Autorización requerida"
                onClose={() => {
                    setauthSuccess({ state: false, type: "" })
                }}
                onAuthFilled={() => {
                    const actions = {
                        desactivar: desactivar,
                        activar: activar,
                        eliminar: eliminar,
                    }

                    actions[authSuccess.type]?.()
                    setauthSuccess({ state: false, type: "" })
                }}
                isOpen={authSuccess.state}
            />
        ),
        authorizedRoles,
        isOpen: authSuccess.state,
        onClose: () => setauthSuccess({ state: false, type: "" }),
    })

    return (
        <Drawer
            placement={"right"}
            bar={false}
            visible={isOpen}
            withCloseButton={true}
            onClose={() => onClose()}
            withMenu
            itemsMenu={
                almacenArticulo?.almacen_articulo?.estado !== EstadosAlmacenesArticulos.Desactivado
                    ? [
                        {
                            label: "Transferir",
                            onClick: validateIsColabActive(() => setIsModalTransferProductOpen(true)),
                            disabled: (almacenArticulo?.almacen_articulo?.cantidad || 0) <= 0 ? true : false,
                        },
                        {
                            label: "Desactivar",
                            onClick: validateIsColabActive(() => setIsModalDesactivarOpen(true)),
                        },
                        {
                            label: "Editar",
                            onClick: validateIsColabActive(() => {
                                const id = almacenArticulo?.almacen_articulo?.almacen_articulo_id
                                if (id) navigate(`/u/inventario/producto/editar/${id}`)

                                onClose()
                            }),
                        },
                        {
                            label: "Eliminar",
                            onClick: validateIsColabActive(() => setIsModalEliminarOpen(true)),
                        },
                    ]
                    : [
                        {
                            label:
                                almacenArticulo.almacen_articulo.articulo?.tipo === TipoArticulo.Insumo
                                    ? "Editar artículo"
                                    : "Editar producto",
                            onClick: validateIsColabActive(() => {
                                navigate(
                                    `/u/inventario/producto/editar/${almacenArticulo.almacen_articulo.articulo?.articulo_id}`
                                )
                                onClose()
                            }),
                        },
                        {
                            label:
                                almacenArticulo.almacen_articulo?.articulo?.tipo === TipoArticulo.Insumo
                                    ? "Eliminar artículo"
                                    : "Eliminar producto",
                            onClick: () => setIsModalEliminarOpen(true),
                        },
                    ]
            }
        >
            <Header
                subtitle={almacenArticulo?.almacen_articulo?.articulo?.descripcion || ""}
                title={almacenArticulo?.almacen_articulo?.articulo?.nombre || ""}
                photoUrl={almacenArticulo?.almacen_articulo?.articulo?.foto || ""}
                status={almacenArticulo?.almacen_articulo?.articulo?.estado || ""}
                type={almacenArticulo?.almacen_articulo?.articulo?.tipo || ""}
            />
            <div className="product-details__drawer__body">
                <div>
                    <DescriptionDetail
                        icon="FolderOpenFilled"
                        value={almacenArticulo?.almacen_articulo?.almacen?.nombre || "-"}
                        label="Almacén"
                        style={{
                            padding: "12px",
                        }}
                    />
                    <DescriptionDetail
                        icon="priceTagFilled"
                        value={almacenArticulo?.almacen_articulo?.articulo?.sku || "-"}
                        label="SKU"
                        style={{
                            padding: "12px",
                        }}
                    />
                    <DescriptionDetail
                        icon="priceTag"
                        value={
                            almacenArticulo?.almacen_articulo?.articulo?.tipo === TipoArticulo.Insumo
                                ? "Insumo"
                                : "Producto"
                        }
                        label="Tipo"
                        style={{
                            padding: "12px",
                        }}
                    />
                    <DescriptionDetail
                        icon="packageFill"
                        value={(almacenArticulo?.almacen_articulo?.cantidad || 0) + ""}
                        label="Cantidad de artículos en almacén"
                        style={{
                            padding: "12px",
                        }}
                    />
                    <DescriptionDetail
                        icon="CoinsFill"
                        value={costo > 0 ? getCurrencyFormat(costo) : "-"}
                        label="Costo por unidad"
                        style={{
                            padding: "12px",
                        }}
                    />
                    {almacenArticulo?.almacen_articulo?.articulo?.tipo !== TipoArticulo.Insumo && (
                        <>
                            <DescriptionDetail
                                icon="HandCoinFilled"
                                value={precio > 0 ? getCurrencyFormat(precio) : "-"}
                                label="Precio de venta"
                                style={{
                                    padding: "12px",
                                }}
                            />
                            <DescriptionDetail
                                icon="Percent"
                                value={
                                    precio > 0 && costo > 0
                                        ? Math.round(times(div(minus(precio, costo), costo), 100)) + "%"
                                        : "-"
                                }
                                label="Porcentaje de ganancia"
                                style={{
                                    padding: "12px",
                                }}
                            />
                        </>
                    )}
                    <DescriptionDetail
                        icon="Inbox"
                        value={
                    almacenArticulo?.almacen_articulo?.ultimo_surtido?.fecha_ingreso
                        ? formatCustomDate((almacenArticulo.almacen_articulo.ultimo_surtido.fecha_ingreso),
                            "DD/MM/YY"
                        )
                        : "-"
                        }

                        label="Último surtido"
                        style={{
                            padding: "12px",
                        }}
                        link={
                            almacenArticulo?.almacen_articulo?.ultimo_surtido?.fecha_ingreso
                                ? "Historial de surtido"
                                : ""
                        }
                        linkBottom={false}
                        onLink={() => {
                            const almacen_articulo_id = almacenArticulo?.almacen_articulo?.almacen_articulo_id || ""
                            if (almacen_articulo_id) {
                                navigate(
                                    `/u/inventario/historial-surtido/${almacenArticulo?.almacen_articulo?.almacen_articulo_id}`
                                )
                                onClose()
                            }
                        }}
                    />
                </div>
            </div>
            <div className="product-details__drawer__footer">
                {almacenArticulo?.almacen_articulo.estado !== EstadosAlmacenesArticulos.Desactivado ? (
                    <>
                        <Button
                            text="Resurtir"
                            className="product-details__drawer__button"
                            onClick={validateIsColabActive(() => setIsModalRefillProductOpen(true))}
                        />
                        <SecondaryButton
                            text="Sacar unidades de almacén"
                            theme="tertiary-gray"
                            className="product-details__drawer__button"
                            onClick={validateIsColabActive(() =>
                                (almacenArticulo?.almacen_articulo?.cantidad || 0) <= 0 && configInventario === false
                                    ? null
                                    : setIsModalOutputProductOpen(true)
                            )}
                            style={{
                                opacity:
                                    (almacenArticulo?.almacen_articulo?.cantidad || 0) <= 0 &&
                                    configInventario === false
                                        ? 0.5
                                        : 1,
                            }}
                        />
                    </>
                ) : (
                    <Button
                        text={
                            almacenArticulo?.almacen_articulo?.articulo?.tipo === TipoArticulo.Insumo
                                ? "Activar artículo"
                                : "Activar producto"
                        }
                        className="product-details__drawer__button"
                        onClick={validateIsColabActive(() => setIsModalActivarOpen(true))}
                    />
                )}
            </div>
            <ModalConfirm
                isOpen={isModalDesactivarOpen}
                title={deactivateType?.title}
                description={
                    <Text>
                        {deactivateType?.firstText}
                        <BoldText>{deactivateType?.boldText}</BoldText> {deactivateType?.secondText}
                    </Text>
                }
                icon={<Icon name="Warning" color="#EB5757" />}
                iconTheme="danger"
                onCloseDialog={({ confirmed }) => {
                    setIsModalDesactivarOpen(false)
                    if (confirmed) {
                        setauthSuccess({ state: true, type: "desactivar" })
                    }
                }}
                confirmLabel="Desactivar"
            />
            <ModalConfirm
                isOpen={isModalActivarOpen}
                title={activateType?.title}
                description={
                    <Text>
                        {activateType?.firstText}
                        <BoldText>{activateType?.boldText}</BoldText> {activateType?.secondText}
                    </Text>
                }
                icon={<Icon name="checkFilled" color="#408232" />}
                iconTheme="success"
                onCloseDialog={({ confirmed }) => {
                    setIsModalActivarOpen(false)
                    if (confirmed) {
                        setauthSuccess({ state: true, type: "activar" })
                    }
                }}
                confirmLabel="Activar"
            />
            <ModalConfirm
                isOpen={isModalEliminarOpen}
                title={
                    Number(almacenArticulo?.almacen_articulo?.cantidad || 0) > 0 && tipo
                        ? tipo === TipoArticulo.Insumo
                            ? "Insumo con unidades"
                            : tipo === TipoArticulo.Proceso
                            ? "Artículo con unidades"
                            : "Producto con unidades"
                        : tipo === TipoArticulo.Insumo
                        ? "¿Deseas eliminar este insumo?"
                        : tipo === TipoArticulo.Proceso
                        ? "¿Deseas eliminar esta producción?"
                        : "¿Deseas eliminar este producto?"
                }
                description={(() => {
                    const articulo = almacenArticulo?.almacen_articulo?.articulo
                    const tipo = { venta: "producto", proceso: "artículo", insumo: "insumo" }
                    const hasStock = (almacenArticulo?.almacen_articulo.cantidad || 0) > 0
                    const isUnique = verificarUnicoAlmacenPorArticulo(articulo?.articulo_id)
                    if (hasStock) {
                        return (
                            <Text>
                                No puedes eliminar este {tipo[articulo?.tipo || ""]} porque tiene unidades disponibles.
                                Para eliminarlo, primero debes dar salida a las unidades restantes.
                            </Text>
                        )
                    }
                    if (isUnique) {
                        return (
                            <Text>
                                {TypeArticleDeleteUnique[articulo?.tipo || ""].firstText}{" "}
                                <BoldText>{TypeArticleDeleteUnique[articulo?.tipo || ""].boldText}</BoldText>{" "}
                                {TypeArticleDeleteUnique[articulo?.tipo || ""].secondText}
                            </Text>
                        )
                    }
                    return articulo?.tipo === TipoArticulo.Insumo ? (
                        <Text>
                            Al eliminarlo, <BoldText>este insumo dejará de estar disponible en este almacén.</BoldText>{" "}
                            Sin embargo, seguirá apareciendo en otros almacenes donde esté registrado.
                        </Text>
                    ) : (
                        <Text>
                            Al eliminarlo,{" "}
                            <BoldText>
                                este {tipo[articulo?.tipo || ""]} dejará de estar disponible en este almacén
                            </BoldText>{" "}
                            tanto para la venta como para su uso como insumo. Sin embargo, seguirá apareciendo en otros
                            almacenes donde esté registrado.
                        </Text>
                    )
                })()}
                icon={<Icon name="Warning" color="#EB5757" />}
                iconTheme="danger"
                onCloseDialog={({ confirmed }) => {
                    setIsModalEliminarOpen(false)
                    if (confirmed) {
                        almacenArticulo?.almacen_articulo.cantidad || 0 > 0
                            ? null
                            : setauthSuccess({ state: true, type: "eliminar" })
                    }
                }}
                confirmLabel={almacenArticulo?.almacen_articulo.cantidad || 0 > 0 ? "Aceptar" : "Eliminar"}
                acceptButton={almacenArticulo?.almacen_articulo.cantidad || 0 > 0 ? true : false}
            />
            <RefillProduct
                isOpen={isModalRefillProductOpen}
                onConfirm={() => {
                    onConfirmChange()
                    setIsModalRefillProductOpen(false)
                }}
                onClose={() => {
                    setIsModalRefillProductOpen(false)
                }}
                product={{
                    id: almacenArticulo?.almacen_articulo?.articulo?.articulo_id,
                    contenido: almacenArticulo?.almacen_articulo?.articulo?.contenido,
                    marca: almacenArticulo?.almacen_articulo?.articulo?.marca || "",
                    nombre: almacenArticulo?.almacen_articulo?.articulo?.nombre,
                    stock: almacenArticulo?.almacen_articulo.cantidad,
                    unidad: almacenArticulo?.almacen_articulo?.articulo?.unidad,
                    tipo: almacenArticulo?.almacen_articulo.articulo?.tipo,
                    almacen_articulo_id: almacenArticulo?.almacen_articulo.almacen_articulo_id || "",
                    unidades_disponibles: almacenArticulo?.almacen_articulo.articulo?.unidades_disponibles || [],
                }}
            />
            <OutputProduct
                isOpen={isModalOutputProductOpen}
                onClose={() => setIsModalOutputProductOpen(false)}
                onConfirm={() => {
                    onConfirmChange()
                    setIsModalOutputProductOpen(false)
                }}
                product={{
                    costo: almacenArticulo?.almacen_articulo.precio || 0,
                    id: almacenArticulo?.almacen_articulo?.articulo?.articulo_id || "",
                    marca: almacenArticulo?.almacen_articulo?.articulo?.marca || "",
                    nombre: almacenArticulo?.almacen_articulo?.articulo?.nombre || "",
                    peso: almacenArticulo?.almacen_articulo?.articulo?.contenido || 0,
                    unidad_medida: almacenArticulo?.almacen_articulo?.articulo?.unidad || UnidadMedidasArticulo.Pz,
                    unidades: almacenArticulo?.almacen_articulo?.cantidad || 0,
                    isInsumo: almacenArticulo?.almacen_articulo?.articulo?.tipo === TipoArticulo.Insumo,
                    almacen: obtenerNombreAlmacenPorArticulo(almacenArticulo?.almacen_articulo?.articulo?.articulo_id),
                    almacen_articulo_id: almacenArticulo?.almacen_articulo.almacen_articulo_id || "",
                    unidades_disponibles: almacenArticulo?.almacen_articulo.articulo?.unidades_disponibles || [],
                }}
                config={configInventario}
            />
            <TransferProduct
                isOpen={isModalTransferProductOpen}
                onClose={() => setIsModalTransferProductOpen(false)}
                onConfirm={() => {
                    onConfirmChange()
                    setIsModalTransferProductOpen(false)
                }}
                product={{
                    costo: almacenArticulo?.almacen_articulo.precio || 0,
                    id: almacenArticulo?.almacen_articulo?.articulo?.articulo_id || "",
                    marca: almacenArticulo?.almacen_articulo?.articulo?.marca || "",
                    nombre: almacenArticulo?.almacen_articulo?.articulo?.nombre || "",
                    peso: almacenArticulo?.almacen_articulo?.articulo?.contenido || 0,
                    unidad_medida: almacenArticulo?.almacen_articulo?.articulo?.unidad || "",
                    unidades: almacenArticulo?.almacen_articulo?.cantidad || 0,
                    isInsumo: almacenArticulo?.almacen_articulo?.articulo?.tipo === TipoArticulo.Insumo,
                    almacen: almacenArticulo?.almacen_articulo.almacen?.nombre,
                    almacen_origen_id: almacenArticulo?.almacen_articulo.almacen?.almacen_id,
                    type: almacenArticulo?.almacen_articulo?.articulo?.tipo,
                    almacen_articulo_id: almacenArticulo?.almacen_articulo.almacen_articulo_id || "",
                }}
                config={configInventario}
            />
            {Modal}
            {InactiveModal}
            <LoaderComponent visible={isLoading} />
        </Drawer>
    )
}

export default ProductDetails
