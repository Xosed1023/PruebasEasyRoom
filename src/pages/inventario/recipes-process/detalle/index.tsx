import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    EstadosArticulo,
    TipoArticulo,
    useActualizarProductoMutation,
    useGetRecetaForDetailQuery,
    useEliminarArticuloMutation,
    EstadosAlmacenesArticulos,
} from "src/gql/schema"
import { div, times, minus } from "src/shared/helpers/calculator"
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
import { PrimaryButton, Tabs } from "src/pages/home/room-detail/sections/elements/Elements"
import { formatDateComplitSlash } from "src/shared/hooks/formatDate-DD-MM-YY"
import { useIngredientes } from "../produccion/hooks/useIngredientes"
import { capitalize } from "src/shared/helpers/capitalize"
import { getCurrencyFormat } from "src/utils/string"
import Home from "./tabs/Home"
import Ingredients from "./tabs/Ingredients"
import { DetalleRecetaProps } from "./interfaces"
import "./DetalleReceta.css"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

function DetalleReceta({
    almacenArticulo,
    isOpen,
    onClose,
    onConfirmChange,
    deactivateType,
    activateType,
    resetSearch,
}: DetalleRecetaProps) {
    const [view, setView] = useState<string>("detalle")
    const [isModalDesactivarOpen, setIsModalDesactivarOpen] = useState<boolean>(false)
    const [isModalActivarOpen, setIsModalActivarOpen] = useState<boolean>(false)
    const [isModalEliminarOpen, setIsModalEliminarOpen] = useState<boolean>(false)
    const [authSuccess, setauthSuccess] = useState<any>({ state: false, type: "" })
    const [isLoading, setisLoading] = useState<boolean>(false)
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const [updateProduct] = useActualizarProductoMutation()
    const [eliminarArticulo] = useEliminarArticuloMutation()

    const { showMiniSnackbar } = useMiniSnackbar()
    const { showSnackbar } = useSnackbar()

    const articulo = almacenArticulo?.articulo
    const tipo = articulo?.tipo || ""
    const precio = Number(articulo?.precio?.monto || 0)
    const costo = Number(almacenArticulo?.costo || 0)
    const extra = articulo?.extra

    const activado = almacenArticulo?.estado !== EstadosAlmacenesArticulos.Desactivado

    const { data: receta } = useGetRecetaForDetailQuery({
        variables: { articulo_id: almacenArticulo?.articulo_id || "" },
    })

    const { alert } = useIngredientes(receta?.receta?.ingredientes_recetas || [])

    const navigate = useNavigate()

    const handleEdit = validateIsColabActive(() => {
        if (almacenArticulo?.articulo?.tipo === TipoArticulo.Receta) {
            return navigate(`/u/inventario/receta/editar/${almacenArticulo?.articulo_id}`)
        }
        if (almacenArticulo?.articulo?.tipo === TipoArticulo.Proceso) {
            return navigate(`/u/inventario/proceso/editar/${almacenArticulo?.articulo_id}`)
        }
    })

    const procesoMenu = [
        {
            label: `${activado ? "Desactivar" : "Activar"} proceso`,
            onClick: validateIsColabActive(() => (activado ? setIsModalDesactivarOpen(true) : setIsModalActivarOpen(true))),
        },
    ]

    const items = [
        {
            label: "Categoría",
            value: articulo?.categoria_articulo?.nombre || "-",
            icon: "FolderOpenFilled",
        },
        { label: "Tipo", value: capitalize(articulo?.tipo || "-"), icon: "priceTag" },
        { label: "Precio de venta", value: getCurrencyFormat(precio), icon: "CoinsFill" },
        {
            label: "Porcentaje de ganancia",
            value: `${precio > 0 && costo > 0 ? Number(times(div(minus(precio, costo), costo), 100).toFixed(2)) : 0}%`,
            icon: "Percent",
        },
        {
            label: "Última preparación",
            value: almacenArticulo?.ultima_preparacion
                ? formatDateComplitSlash(almacenArticulo?.ultima_preparacion, true, "00")
                : "-",
            icon: "Inbox",
        },
    ]

    const procesoItems = [
        {
            label: "Cantidad de producción en inventario",
            value: `${articulo?.stock} ${articulo?.unidad || ""}`,
            icon: "packageFill",
        },
        {
            label: "Costo promedio por unidad",
            value: getCurrencyFormat(
                articulo?.costo?.monto && articulo.stock
                    ? div(articulo?.costo?.monto || 0, articulo?.stock).toFixed(2)
                    : 0
            ),
            icon: "CoinsFill",
        },
        {
            label: "Última preparación",
            value: almacenArticulo?.ultima_preparacion
                ? formatDateComplitSlash(almacenArticulo?.ultima_preparacion, true, "00")
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
                },
            },
        })
            .then(() => {
                onConfirmChange()
                const isReceta = articulo?.tipo === TipoArticulo.Receta
                showMiniSnackbar({
                    text: `Se desactivó ${isReceta ? "la receta" : "la producción"} correctamente.`,
                    status: "success",
                    title: `${isReceta ? "Receta" : "Producción"} desactivada`,
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
                },
            },
        })
            .then(() => {
                onConfirmChange()
                const isReceta = articulo?.tipo === TipoArticulo.Receta
                showMiniSnackbar({
                    text: `Se activó ${isReceta ? "la receta" : "la producción"} correctamente.`,
                    status: "success",
                    title: `${isReceta ? "Receta" : "Producción"} activada`,
                })
            })
            .catch(() => {
                showMiniSnackbar({
                    status: "error",
                    title: "Error al activar el producto",
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
                    title: "Error al eliminar el producto",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })
            })
            .finally(() => {
                setisLoading(false)
                onClose()
            })
    }

    const producir = () => {
        navigate(
            `/u/inventario/produccion/${almacenArticulo?.almacen_articulo_id || ""}/${
                almacenArticulo?.articulo_id || ""
            }`
        )
    }

    const { Modal, skip } = useAuth({
        authModal: (
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
                        producir: producir
                    }

                    actions[authSuccess.type]?.()
                    setauthSuccess({ state: false, type: "" })
                }}
                isOpen={authSuccess.state}
            />
        ),
        authorizedRoles: [RoleNames.admin, RoleNames.recepcionista, RoleNames.cocina, RoleNames.bar],
        noNeedAuthModalRoles: [RoleNames.admin, RoleNames.cocina, RoleNames.bar],
        isOpen: authSuccess.state,
        onClose: () => setauthSuccess({ state: false, type: "" }),
    })

    return (
        <Drawer
            bar={false}
            visible={isOpen}
            placement={"right"}
            withMenu
            withCloseButton
            itemsMenu={[
                ...(tipo === TipoArticulo.Proceso ? procesoMenu : []),
                { label: `Eliminar ${extra ? "extra" : tipo}`, onClick: validateIsColabActive(() => setIsModalEliminarOpen(true)) },
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
                        <img height={"100%"} width={"100%"} src={articulo?.foto} alt="image" />
                    </div>
                ) : (
                    <div className="detalle-receta__header__image">
                        <PhotoEmpty tipo={articulo?.tipo} estado={articulo?.estado} diameter={56} />
                    </div>
                )}
                <div>
                    <p className="detalle-receta__header__title">{articulo?.nombre || "Articulo"}</p>
                    {extra && (
                        <p className="detalle-receta__header__subtitle">{`Extra - ${articulo?.contenido || ""} ${
                            articulo?.unidad || ""
                        }`}</p>
                    )}
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
                    <Home data={tipo !== TipoArticulo.Proceso ? items : procesoItems} />
                    <div>
                        {tipo !== TipoArticulo.Proceso ? (
                            <PrimaryButton
                                onClick={validateIsColabActive(() =>
                                    activado ? setIsModalDesactivarOpen(true) : setIsModalActivarOpen(true)
                                )}
                                text={`${activado ? "Desactivar" : "Activar"} ${extra ? "extra" : "receta"}`}
                            />
                        ) : (
                            <>
                                {alert && (
                                    <div className="detalle-receta__alert">
                                        <Icon height={14} width={14} name={"alertFill"} color={"var(--cancelada)"} />
                                        <p className="detalle-receta__alert-label">{"Ingredientes insuficientes"}</p>
                                    </div>
                                )}
                                <PrimaryButton
                                    onClick={validateIsColabActive(() =>
                                        skip ? producir() : setauthSuccess({ state: true, type: "producir" })
                                    )}
                                    text="Producir"
                                />
                            </>
                        )}
                    </div>
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
                                label: `${i?.articulo?.nombre || "Ingrediente"}`,
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
                        skip ? desactivar() : setauthSuccess({ state: true, type: "desactivar" })
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
                        skip ? activar() : setauthSuccess({ state: true, type: "activar" })
                    }
                }}
                confirmLabel="Activar"
            />
            <ModalConfirm
                isOpen={isModalEliminarOpen}
                title={
                    articulo?.tipo === TipoArticulo.Receta
                        ? "¿Deseas eliminar esta receta?"
                        : "¿Deseas eliminar este proceso?"
                }
                description={
                    <Text>
                        {articulo?.tipo === TipoArticulo.Receta ? (
                            <>
                                Al eliminarla,{" "}
                                <BoldText>esta receta dejará de estar disponible para la venta.</BoldText> Sin embargo,
                                los ingresos y movimientos que la receta haya generado seguirán disponibles en los
                                historiales.
                            </>
                        ) : (
                            <>
                                Al eliminarlo,{" "}
                                <BoldText>este proceso dejará de estar disponible en el recetario.</BoldText> Sin
                                embargo, las producciones realizadas previamente seguirán existiendo en el almacén en el
                                que fueron registradas.
                            </>
                        )}
                    </Text>
                }
                icon={<Icon name="Warning" color="#EB5757" />}
                iconTheme="danger"
                onCloseDialog={({ confirmed }) => {
                    setIsModalEliminarOpen(false)
                    if (confirmed) {
                        resetSearch?.()
                        skip ? eliminar() : setauthSuccess({ state: true, type: "eliminar" })
                    }
                }}
                confirmLabel={"Eliminar"}
            />
            {Modal}
            {InactiveModal}
            <LoaderComponent visible={isLoading} />
        </Drawer>
    )
}

export default DetalleReceta
