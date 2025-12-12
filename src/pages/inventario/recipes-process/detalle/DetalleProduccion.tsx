import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    EstadosArticulo,
    EstadosAlmacenesArticulos,
    TipoArticulo,
    useActualizarProductoMutation,
    useGetRecetaForDetailQuery,
    useEliminarArticuloMutation,
    UnidadMedidasArticulo,
    useConfiguracionInventarioLazyQuery,
} from "src/gql/schema"
import { div } from "src/shared/helpers/calculator"
import Drawer from "src/shared/components/layout/drawer/Drawer"
import { ModalConfirm } from "src/shared/components/layout"
import PhotoEmpty from "../../components/empty/PhotoEmpty"
import BoldText from "src/shared/components/layout/modal-confirm/component-helpers/BoldText/BoldText"
import Text from "src/shared/components/layout/modal-confirm/component-helpers/Text/Text"
import Icon from "src/shared/icons"
import AuthRequiredModal from "../../modals/Auth/AuthRequiredModal/AuthRequiredModal"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { PrimaryButton, SecondaryButton, Tabs } from "src/pages/home/room-detail/sections/elements/Elements"
import { getCurrencyFormat } from "src/utils/string"
import Home from "./tabs/Home"
import Ingredients from "./tabs/Ingredients"
import { DetalleRecetaProps } from "./interfaces"
import "./DetalleReceta.css"
import TransferProduct from "../../modals/TransferProduct/TransferProduct"
import OutputProduct from "../../modals/OutputProduct/OutputProduct"
import { useProfile } from "src/shared/hooks/useProfile"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

function DetalleProduccion({
    almacenArticulo,
    isOpen,
    onClose,
    onConfirmChange,
    deactivateType,
    activateType,
}: DetalleRecetaProps) {
    const [view, setView] = useState<string>("detalle")
    const [isModalDesactivarOpen, setIsModalDesactivarOpen] = useState<boolean>(false)
    const [isModalActivarOpen, setIsModalActivarOpen] = useState<boolean>(false)
    const [isModalEliminarOpen, setIsModalEliminarOpen] = useState<boolean>(false)
    const [authSuccess, setauthSuccess] = useState<any>({ state: false, type: "" })
    const [isLoading, setisLoading] = useState<boolean>(false)
    const [isModalTransferProductOpen, setIsModalTransferProductOpen] = useState<boolean>(false)
    const [isModalOutputProductOpen, setIsModalOutputProductOpen] = useState<boolean>(false)
    const [configInventario, setConfigInventario] = useState<boolean>(false)

    const { hotel_id } = useProfile()

    const [updateProduct] = useActualizarProductoMutation()
    const [eliminarArticulo] = useEliminarArticuloMutation()

    const { showMiniSnackbar } = useMiniSnackbar()
    const { showSnackbar } = useSnackbar()
    const { formatCustomDate } = useFormatDate()

    const articulo = almacenArticulo?.articulo
    const cantidad = almacenArticulo?.cantidad || 0
    const tipo = articulo?.tipo || ""
    const costo = Number(almacenArticulo?.costo || 0)
    const extra = articulo?.extra
    const activado = almacenArticulo?.estado === EstadosAlmacenesArticulos.Activado

    const { data: receta } = useGetRecetaForDetailQuery({
        variables: { articulo_id: almacenArticulo?.articulo_id || "", hotel_id },
        skip: isOpen && extra,
    })
    const [getConfig] = useConfiguracionInventarioLazyQuery({
        variables: {
            hotel_id,
        },
    })

    const navigate = useNavigate()

    const handleEdit = () => navigate(`/u/inventario/proceso/editar/${almacenArticulo?.articulo_id}`)

    const items = [
        {
            label: "Categoría",
            value: articulo?.categoria_articulo?.nombre || "-",
            icon: "FolderOpenFilled",
        },
        { label: "Tipo", value: "Proceso", icon: "priceTag" },
        {
            label: "Cantidad de producto en inventario",
            value: `${cantidad} ${articulo?.unidad || ""}`,
            icon: "CoinsFill",
        },
        {
            label: "Costo promedio por unidad",
            value: getCurrencyFormat(costo > 0 && cantidad > 0 ? Number(div(costo, cantidad).toFixed(2)) : 0),
            icon: "CoinsFill",
        },
        {
            label: "Última producción",
            value: almacenArticulo?.ultima_preparacion
                ? formatCustomDate(almacenArticulo.ultima_preparacion, "DD/MMM/YY")
                : "-",
            icon: "Inbox",
            link: almacenArticulo?.ultima_preparacion ? "Historial de producción" : "",
            onLink: () => navigate(`/u/inventario/historial-produccion/${almacenArticulo?.articulo_id || ""}`),
        },
    ]

    const desactivar = () => {
        setisLoading(true)
        updateProduct({
            variables: {
                articulo_input: {
                    articulo_id: almacenArticulo?.articulo_id || "",
                    estado: EstadosArticulo.Desactivado,
                    almacen_id: almacenArticulo?.almacen_id,
                    hotel_id,
                },
            },
        })
            .then(() => {
                onConfirmChange()
                showMiniSnackbar({
                    text: `Se desactivó la producción correctamente.`,
                    status: "success",
                    title: `Producción desactivada`,
                })
            })
            .catch(() => {
                showMiniSnackbar({
                    status: "error",
                    title: "Error al desactivar el producto",
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
                    articulo_id: almacenArticulo?.articulo_id || "",
                    estado: EstadosArticulo.Activado,
                    almacen_id: almacenArticulo?.almacen_id,
                    hotel_id,
                },
            },
        })
            .then(() => {
                onConfirmChange()
                showMiniSnackbar({
                    text: `Se activó la producción correctamente.`,
                    status: "success",
                    title: "Producción activada",
                })
            })
            .catch(() => {
                showMiniSnackbar({
                    status: "error",
                    title: "Error al activar la producción",
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
                    almacen_articulo_id: [almacenArticulo?.almacen_articulo_id || ""],
                },
            },
        })
            .then(() => {
                onConfirmChange()
                showSnackbar({
                    text: `El artículo **"${articulo?.nombre} - ${articulo?.contenido}${articulo?.unidad}"** fue eliminado del inventario`,
                    status: "success",
                    title: `${articulo?.tipo === "receta" ? "Producto" : "Artículo"} eliminado`,
                })
            })
            .catch((e) => {
                showMiniSnackbar({
                    status: "error",
                    title: "Error al eliminar la producción",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })
            })
            .finally(() => {
                setisLoading(false)
                onClose()
            })
    }

    useEffect(() => {
        if (hotel_id) {
            getConfig({
                variables: {
                    hotel_id,
                },
            }).then((data) => {
                if (data.data) {
                    const config = data.data.configuraciones_inventario[0].inventario_negativo
                    setConfigInventario(config)
                }
            })
        }
    }, [hotel_id])

    return (
        <Drawer
            bar={false}
            visible={isOpen}
            placement={"right"}
            withMenu
            withCloseButton
            itemsMenu={[
                {
                    label: `${activado ? "Desactivar" : "Activar"} producción`,
                    onClick: () => (activado ? setIsModalDesactivarOpen(true) : setIsModalActivarOpen(true)),
                },
                { label: "Eliminar producción", onClick: () => setIsModalEliminarOpen(true) },
            ]}
            onClose={onClose}
        >
            <div className="detalle-receta__header">
                {articulo?.foto ? (
                    <div
                        className={`detalle-receta__header__image${
                            !activado ? " detalle-receta__header__image--opacity" : ""
                        }`}
                    >
                        <img
                            height={"100%"}
                            width={"100%"}
                            src={articulo?.foto || require("src/assets/png/Emptystate_producto.png")}
                            alt="image"
                        />
                    </div>
                ) : (
                    <div className="detalle-receta__header__image">
                        <PhotoEmpty tipo={articulo?.tipo} estado={articulo?.estado} diameter={56} />
                    </div>
                )}
                <div>
                    <p className="detalle-receta__header__title">{articulo?.nombre || "Articulo"}</p>
                    {!activado && <p className="detalle-receta__header__alert">{"Desactivado"}</p>}
                </div>
            </div>
            <Tabs
                className="detalle-receta__tabs"
                value={view}
                tabList={[
                    { label: "Detalle", path: "detalle" },
                    { label: "Ingredientes", path: "ingredientes" },
                ]}
                onChange={setView}
            />
            {view === "detalle" ? (
                <div className={"detalle-receta__content"}>
                    <Home data={items} />
                    {activado ? (
                        <div>
                            <PrimaryButton
                                text="Transferir producción"
                                style={{ marginBottom: 20 }}
                                onClick={() => setauthSuccess({ state: true, type: "transferir" })}
                            />
                            <SecondaryButton
                                text="Salida de unidades de almacén"
                                onClick={() =>
                                    cantidad <= 0 && configInventario === false
                                        ? null
                                        : setauthSuccess({ state: true, type: "salida" })
                                }
                                style={{
                                    opacity: cantidad <= 0 && configInventario === false ? 0.5 : 1,
                                }}
                            />
                        </div>
                    ) : (
                        <PrimaryButton text="Activar producción" onClick={() => setIsModalActivarOpen(true)} />
                    )}
                </div>
            ) : (
                <Ingredients
                    cantidad={
                        tipo === TipoArticulo.Proceso ? `${articulo?.contenido || ""} ${articulo?.unidad || ""}` : ""
                    }
                    costo={costo}
                    data={
                        receta?.receta?.ingredientes_recetas?.map((i) => {
                            return {
                                label: i?.articulo?.nombre || "Ingrediente",
                                value: `${i?.cantidad} ${i?.unidad}`,
                            }
                        }) || []
                    }
                    onClick={handleEdit}
                />
            )}
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
                title={"¿Deseas eliminar este proceso?"}
                description={
                    <Text>
                        Al eliminarlo, <BoldText>este proceso dejará de estar disponible en el recetario.</BoldText> Sin
                        embargo, las producciones realizadas previamente seguirán existiendo en el almacén en el que
                        fueron registradas.
                    </Text>
                }
                icon={<Icon name="Warning" color="#EB5757" />}
                iconTheme="danger"
                onCloseDialog={({ confirmed }) => {
                    setIsModalEliminarOpen(false)
                    if (confirmed) {
                        setauthSuccess({ state: true, type: "eliminar" })
                    }
                }}
                confirmLabel={"Eliminar"}
            />
            <AuthRequiredModal
                title="Autorización requerida"
                onClose={() => {
                    setauthSuccess({ state: false, type: "" })
                }}
                onAuthFilled={() => {
                    const actions = {
                        desactivar: desactivar,
                        activar: activar,
                        eliminar: eliminar,
                        transferir: () => setIsModalTransferProductOpen(true),
                        salida: () => setIsModalOutputProductOpen(true),
                    }
                    actions[authSuccess.type]?.()
                    setauthSuccess({ state: false, type: "" })
                }}
                isOpen={authSuccess.state}
            />
            <TransferProduct
                isOpen={isModalTransferProductOpen}
                onClose={() => setIsModalTransferProductOpen(false)}
                onConfirm={() => {
                    onConfirmChange()
                    setIsModalTransferProductOpen(false)
                }}
                product={{
                    costo: articulo?.precio?.monto || 0,
                    id: articulo?.articulo_id || "",
                    marca: articulo?.marca || "",
                    nombre: articulo?.nombre || "",
                    peso: articulo?.contenido || 0,
                    unidad_medida: articulo?.unidad || "",
                    unidades: almacenArticulo?.cantidad || 0,
                    isInsumo: articulo?.tipo === TipoArticulo.Insumo,
                    almacen: almacenArticulo?.almacen?.nombre,
                    almacen_origen_id: almacenArticulo?.almacen?.almacen_id,
                    type: articulo?.tipo,
                    almacen_articulo_id: almacenArticulo?.almacen_articulo_id || "",
                }}
                config={false}
            />
            <OutputProduct
                isOpen={isModalOutputProductOpen}
                onClose={() => setIsModalOutputProductOpen(false)}
                onConfirm={() => {
                    onConfirmChange()
                    setIsModalOutputProductOpen(false)
                }}
                product={{
                    costo: articulo?.precio?.monto || 0,
                    id: articulo?.articulo_id || "",
                    marca: articulo?.marca || "",
                    nombre: articulo?.nombre || "",
                    peso: articulo?.contenido || 0,
                    unidad_medida: UnidadMedidasArticulo[articulo?.unidad || ""] || "",
                    unidades: almacenArticulo?.cantidad || 0,
                    isInsumo: articulo?.tipo === TipoArticulo.Insumo,
                    almacen: almacenArticulo?.almacen?.nombre,
                    almacen_articulo_id: almacenArticulo?.almacen_articulo_id || "",
                    type: articulo?.tipo,
                    unidades_disponibles: articulo?.unidades_disponibles || [],
                }}
                config={false}
            />
            <LoaderComponent visible={isLoading} />
        </Drawer>
    )
}

export default DetalleProduccion
