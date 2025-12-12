import Screen from "src/shared/components/layout/screen/Screen"
import Card from "./components/card/Card"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useProfile } from "src/shared/hooks/useProfile"
import Icon from "src/shared/icons"
import "./Configuracion.css"
import { CategoriaArticulo, useCategoriasArticulosLazyQuery } from "src/gql/schema"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import LargeCardSkeleton from "src/shared/components/data-display/LargeCardSkeleton/LargeCardSkeleton"
import EliminarCategoria from "./sections/eliminar/EliminarCategoria"
import { CrearCategoria } from "./sections/crear-editar/CrearCategoria"
import { AuthSuccess } from "./Configuracion.constants"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

const ConfiguracionCategoria = () => {
    const navigate = useNavigate()
    const { hotel_id } = useProfile()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const [authSuccess, setAuthSuccess] = useState<AuthSuccess>({ state: false, type: "" })
    const [visibleModalCrear, setVisibleModalCrear] = useState<boolean>(false)
    const [visibleModalEliminar, setVisibleModalEliminar] = useState<boolean>(false)
    const [categoriaSelected, setCategoriaSelected] = useState<CategoriaArticulo>({
        nombre: "",
        categoria_id: "",
        descripcion: "",
        hotel_id: "",
        eliminado: false,
        porcentaje_aportacion_propinas: 0,
    })

    const [getCategoriasArticulos, { loading, data }] = useCategoriasArticulosLazyQuery()

    const getDataCategoriasArticulos = async () => {
        try {
            await getCategoriasArticulos({
                variables: {
                    hotel_id: hotel_id,
                },
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!data) {
            getDataCategoriasArticulos()
        }
    }, [data])

    useEscapeKey({
        onEscape: () => {
            if (visibleModalCrear || visibleModalEliminar || authSuccess.state) {
                setVisibleModalEliminar(false)
                setVisibleModalCrear(false)
                setAuthSuccess({state: false, type: ""})
                return
            }
            navigate(-1)
        },
    })
    
    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                title="Autorización requerida"
                onClose={() => {
                    setAuthSuccess({ state: false, type: "" })
                }}
                onAuthFilled={() => {
                    if(authSuccess.type === "agregar" || authSuccess.type === "editar") {
                        setVisibleModalCrear(true)
                        setAuthSuccess({ state: false, type: "" })
                    }
                    if(authSuccess.type === "eliminar") {
                        setVisibleModalEliminar(true)
                        setAuthSuccess({ state: false, type: "" })
                    }
                }}
                isOpen={authSuccess.state}
            />
        ),
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.roomService, RoleNames.recepcionista],
        isOpen: authSuccess.state,
        onClose: () => setAuthSuccess({ state: false, type: "" }),
    })

    return (
        <Screen
            className="configuracion-categorias__screen"
            title={"Configuración de Room service"}
            contentClassName="configuracion-categorias"
            close={true}
            onClose={() => navigate(-1)}
        >
            <section className="configuracion-categorias__container">
                <div className="configuration-categorias-gestion">
                    {data?.categorias_articulos?.map((categoria, index) => (
                        <Card
                            title={categoria.nombre}
                            subtitle={categoria.descripcion}
                            total={categoria.total_articulos || 0}
                            onDelete={validateIsColabActive(() => {
                                setCategoriaSelected({
                                    ...categoriaSelected,
                                    nombre: categoria.nombre,
                                    categoria_id: categoria.categoria_id,
                                })
                                skip ? setVisibleModalEliminar(true) : setAuthSuccess({ state: true, type: "eliminar" })
                            })}
                            onEdit={validateIsColabActive(() => {
                                setCategoriaSelected({
                                    hotel_id,
                                    nombre: categoria.nombre,
                                    descripcion: categoria.descripcion,
                                    categoria_id: categoria.categoria_id,
                                    eliminado: categoria.eliminado,
                                    porcentaje_aportacion_propinas: categoria.porcentaje_aportacion_propinas,
                                })
                                skip ? setVisibleModalCrear(true) : setAuthSuccess({ state: true, type: "editar" })
                            })}
                            edit={categoria.nombre !== "Alimentos" && categoria.nombre !== "Bebidas"}
                            key={index}
                            containerClassName="configuration-categorias__container-cards"
                        />
                    ))}
                    {loading && <LargeCardSkeleton icon={false} />}
                    <div
                        className="configuration-categorias__button-container"
                        onClick={validateIsColabActive(() => {
                            setCategoriaSelected({
                                nombre: "",
                                hotel_id: "",
                                descripcion: "",
                                categoria_id: "",
                                eliminado: false,
                                porcentaje_aportacion_propinas: 0,
                            })
                            skip ? setVisibleModalCrear(true) : setAuthSuccess({ state: true, type: "agregar" })
                        })}
                    >
                        <div className="configuration-categorias__float-button">
                            <Icon name="plus" color={"#fff"} width={28} height={28} />
                        </div>
                    </div>
                </div>
                {Modal}
                <CrearCategoria
                    visible={visibleModalCrear}
                    onClose={() => {
                        setVisibleModalCrear(false)
                        getDataCategoriasArticulos()
                    }}
                    categoria_id={categoriaSelected.categoria_id}
                    values={categoriaSelected}
                />
                <EliminarCategoria
                    visible={visibleModalEliminar}
                    onClose={() => {
                        setVisibleModalEliminar(false)
                        getDataCategoriasArticulos()
                    }}
                    onConfirm={getCategoriasArticulos}
                    categoria_id={categoriaSelected.categoria_id}
                    nombre={categoriaSelected.nombre}
                />
            </section>
            {InactiveModal}
        </Screen>
    )
}

export { ConfiguracionCategoria }
