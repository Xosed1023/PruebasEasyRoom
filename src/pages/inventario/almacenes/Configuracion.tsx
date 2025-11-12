import Screen from "src/shared/components/layout/screen/Screen"
import Card from "./components/card/Card"
import { useNavigate } from "react-router-dom"
import { text, ejemplo } from "./Configuracion.constants"
import { useEffect, useState } from "react"
import Switch from "src/shared/components/forms/switch/Switch"
import { useProfile } from "src/shared/hooks/useProfile"
import Icon from "src/shared/icons"
import "./Configuracion.css"
import { ModalCategoria } from "./components/modal/crear-editar/CrearAlmacen"
import {
    useActualizarConfiguracionInventarioInputMutation,
    useAlmacenesLazyQuery,
    useConfiguracionInventarioLazyQuery,
    useCrearConfiguracionInventarioMutation,
} from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { FormValues } from "./components/modal/crear-editar/CrearAlmacen.types"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import AuthRequiredModal from "../modals/Auth/AuthRequiredModal/AuthRequiredModal"
import EliminarAlmacen from "./components/modal/eliminar/EliminarAlmacen"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

const ConfiguracionAlmacenes = () => {
    const navigate = useNavigate()
    const { hotel_id } = useProfile()
    const { showSnackbar } = useSnackbar()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    const [authSuccess, setauthSuccess] = useState<any>({ state: false, type: "" })
    const [visibleModalCrear, setVisibleModalCrear] = useState<any>({ state: false, type: "" })
    const [visibleModalEliminar, setVisibleModalEliminar] = useState<boolean>(false)
    const [almacenSelected, setAlmacenSelected] = useState<FormValues>({
        nombre: "",
        categoria_id: [],
        descripcion: "",
        hotel_id: "",
    })

    const [crearConfiguracionInventario] = useCrearConfiguracionInventarioMutation()
    const [actualizarConfiguracionInventario] = useActualizarConfiguracionInventarioInputMutation()

    const [isActive, setIsActive] = useState<boolean>(false)
    const [config, setConfig] = useState<any>()
    const [data, setData] = useState<any>()
    const [activeAlmacen, setActiveAlmacen] = useState<boolean>(false)
    const [idAlmacen, setIdAlmacen] = useState<string>("")
    const [totalArticulos, setTotalArticulos] = useState<number>(0)

    const [getConfiguracionInventario] = useConfiguracionInventarioLazyQuery()

    const getConfig = async () => {
        try {
            const { data } = await getConfiguracionInventario({
                variables: {
                    hotel_id: hotel_id,
                },
            })
            const configData = data?.configuraciones_inventario || []
            if (configData.length > 0) {
                setIsActive(configData[0].inventario_negativo)
                setConfig(configData[0])
            }
        } catch (e) {
            console.log(e)
        }
    }

    const [getAlmacenes] = useAlmacenesLazyQuery()

    const getDataAlmacenes = async () => {
        try {
            const { data } = await getAlmacenes({
                variables: {
                    hotel_id: hotel_id,
                    eliminado: false,
                },
            })
            const AlmacenesData = data?.almacenes || []
            if (AlmacenesData.length > 0) {
                setData(AlmacenesData)
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!config) {
            getConfig()
        }
        if (!data) {
            getDataAlmacenes()
        }
    }, [config, data])

    const changeConfiguracion = (inventario_negativo) => {
        if (config?.inventario_negativo === undefined) {
            crearConfiguracionInventario({
                variables: {
                    create_configuracion_inventario: {
                        hotel_id,
                        inventario_negativo,
                    },
                },
            })
                .catch(() => {
                    showSnackbar({
                        title: "Error al cambiar la configuración",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                })
                .then(() => {
                    getConfig()
                })
        } else {
            const configuracion_inventario_id = config.configuracion_inventario_id
            if (configuracion_inventario_id)
                actualizarConfiguracionInventario({
                    variables: {
                        update_configuracion_inventario: {
                            configuracion_inventario_id,
                            inventario_negativo,
                        },
                    },
                }).catch(() => {
                    showSnackbar({
                        title: "Error al cambiar la configuración",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                })
        }
    }

    useEscapeKey({
        onEscape: () => {
            if (visibleModalCrear || visibleModalEliminar) {
                setVisibleModalEliminar(false)
                setVisibleModalCrear(false)
                return
            }
            navigate(-1)
        },
    })

    function obtenerNombresCategorias(almacen) {
        const nombres = almacen.categorias_almacenes.map((categoria) => categoria.nombre)
        return nombres.length > 0 ? nombres.join(", ") : "Ninguno"
    }

    function obtenerIdsCategorias(almacen) {
        return almacen.categorias_almacenes.map((categoria) => categoria.categoria_id)
    }

    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                title="Autorización requerida"
                onClose={() => {
                    setauthSuccess({ state: false, type: "" })
                }}
                onAuthFilled={() => {
                    if (authSuccess.type === "edit") {
                        setVisibleModalCrear({ state: true, type: "edit" })
                    }
                    if (authSuccess.type === "create") {
                        setVisibleModalCrear({ state: true, type: "create" })
                    }
                    if (authSuccess.type === "delete") {
                        setVisibleModalEliminar(true)
                    }
                    setauthSuccess({ state: false, type: "" })
                }}
                isOpen={authSuccess.state}
            />
        ),
        authorizedRoles: [RoleNames.admin, RoleNames.recepcionista, RoleNames.cocina, RoleNames.bar],
        isOpen: authSuccess.state,
        onClose: () => {
            setauthSuccess({ state: false, type: "" })
        },
    })

    return (
        <Screen
            className="configuracion-almacenes__screen"
            title={"Configuración de inventario"}
            contentClassName="configuracion-almacenes"
            close={true}
            onClose={() => navigate(-1)}
        >
            <section className="configuracion-almacenes__container">
                <div className="configuration-almacenes-gestion">
                    <div className="configuration-almacenes-gestion__title">{"Venta de productos sin inventario"}</div>
                    <div>
                        <Switch
                            className="configuration-almacenes-gestion__switch"
                            onClick={(e) => e.stopPropagation()}
                            onChange={validateIsColabActive((value) => {
                                setIsActive(!isActive)
                                changeConfiguracion(!isActive)
                            })}
                            value={isActive}
                            label={
                                <div>
                                    <span className="configuration-almacenes-gestion__text">{text}</span>
                                    <div className="configuration-almacenes-gestion__text-ejemplo">{ejemplo}</div>
                                </div>
                            }
                        />
                    </div>
                </div>
                <div className="configuracion-almacenes__screen">
                    <div className="configuration-almacenes-gestion__title">{"Almacenes"}</div>
                    {data?.map((almacen, index) => (
                        <Card
                            title={almacen.nombre}
                            subtitle={almacen.descripcion}
                            total={almacen.stock}
                            categorys={obtenerNombresCategorias(almacen)}
                            onDelete={validateIsColabActive(() => {
                                setTotalArticulos(almacen.stock)
                                setIdAlmacen(almacen.almacen_id)
                                setAlmacenSelected({
                                    nombre: almacen.nombre,
                                    hotel_id,
                                    descripcion: almacen.descripcion,
                                    categoria_id: obtenerIdsCategorias(almacen),
                                })
                                skip ? setVisibleModalEliminar(true) : setauthSuccess({ state: true, type: "delete" })
                            })}
                            onEdit={validateIsColabActive(() => {
                                setIdAlmacen(almacen.almacen_id)
                                setActiveAlmacen(almacen.tipo_almacen === "suministro")
                                setAlmacenSelected({
                                    nombre: almacen.nombre,
                                    hotel_id,
                                    descripcion: almacen.descripcion,
                                    categoria_id: obtenerIdsCategorias(almacen),
                                })
                                skip
                                    ? setVisibleModalCrear({ state: true, type: "edit" })
                                    : setauthSuccess({ state: true, type: "edit" })
                            })}
                            key={almacen.nombre}
                            containerClassName="configuration-almacenes__container-cards"
                            general={index === 0 ? true : false}
                        />
                    ))}
                    <div
                        className="configuration-almacenes__button-container"
                        onClick={() => {
                            setIdAlmacen("")
                            setActiveAlmacen(false)
                            setAlmacenSelected({
                                nombre: "",
                                hotel_id: "",
                                descripcion: "",
                                categoria_id: [""],
                            })
                            skip
                                ? setVisibleModalCrear({ state: true, type: "create" })
                                : setauthSuccess({ state: true, type: "create" })
                        }}
                    >
                        <div className="configuration-almacenes__float-button">
                            <Icon name="plus" color={"#fff"} width={28} height={28} />
                        </div>
                    </div>
                </div>
                {Modal}
                <ModalCategoria
                    onClose={() => {
                        getDataAlmacenes()
                        setVisibleModalCrear({ state: false, type: "" })
                    }}
                    visible={visibleModalCrear.state}
                    values={almacenSelected}
                    type={visibleModalCrear.type}
                    active={activeAlmacen}
                    idAlmacen={idAlmacen}
                />
                <EliminarAlmacen
                    visible={visibleModalEliminar}
                    onClose={() => {
                        setVisibleModalEliminar(false)
                        getDataAlmacenes()
                    }}
                    idAlmacen={idAlmacen}
                    values={almacenSelected}
                    totalArticulos={totalArticulos}
                />
            </section>
            {InactiveModal}
        </Screen>
    )
}

export { ConfiguracionAlmacenes }
