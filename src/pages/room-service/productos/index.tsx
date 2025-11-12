import { useEffect, useState, useMemo, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Articulo, useConfiguracionInventarioQuery, useGetCategoriasRsQuery } from "src/gql/schema"
import Screen from "src/shared/components/layout/screen/Screen"
import ProductCard from "src/shared/sections/room-service/Card/ProductCard"
import EditAlertModal from "./../detalle-compra/sections/modals/edit-alert"
import AlertaPersonal from "./sections/modals/alerta-personal/AlertPersonal"
import PromptRS from "./../detalle-compra/sections/modals/CloseModal"
import Touchable from "src/shared/components/general/touchable/Touchable"
import ModalExtras from "src/shared/sections/room-service/modal-extras"
import Icon from "src/shared/icons"
import { Button } from "src/shared/components/forms"
import { useProfile } from "src/shared/hooks/useProfile"
import { useModulos } from "src/shared/hooks/useModulos"
import Ticket, { TicketContent, TicketBlock } from "src/shared/sections/ticket/Ticket"
import InputTabs from "src/shared/components/forms/input-tabs/InputTabs"
import Empty from "src/shared/components/data-display/empty/Empty"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useSelectedRoom } from "src/pages/home/room-detail/hooks/selected"
import useInfiniteScroll from "src/shared/hooks/useInfiniteScroll"
import useArticulosRoomServiceQuery from "./hooks/useArticulosRoomServiceQuery"
import Search, { SearchStaticRef } from "src/shared/sections/room-service/Search/SearchStatic"
import { AlmacenArticuloPlain } from "src/shared/sections/room-service/LazySearch/LazySearch.type"
import ProductCards from "./sections/ProductCards/ProductCards"
import { Link } from "./sections/Elements"
import { useRSNavigate } from "./hooks/navigate"
import { Subtotal, TicketItem, Total } from "./sections/Ticket"
import { ElementTicketSkeleton, TotalTicketSkeleton } from "./sections/skeleton/TicketSkeleton"
import { useSelectedProducts } from "./hooks/products"
import { capitalize } from "src/shared/helpers/capitalize"
import { removeItems } from "../detalle-compra/DetalleCompra.helpers"
import { getEmptyMessage, getIcon, setItems } from "./Products.helpers"
import { usePersonalRoomService } from "src/shared/sections/payment/propina/input-personal/InputPersonal.hooks"
//import { useCurrentRol } from "src/shared/widgets/hooks/general"
import { emptyCards } from "./Products.constants"
import { Product, RoomServiceProps } from "./Products.type"
import { v4 as uuid } from "uuid"
import "./Products.css"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

function RoomService({
    fullscreen = false,
    restaurantMode = false,
    showReset = true,
    defaultProducts = undefined,
    title = "",
    uniqueProduct = true,
    onConfirm = undefined,
    onPreventReduce = undefined,
    onChange = undefined,
}: RoomServiceProps): JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()
    const mesa = location.state?.mesa
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    //const rol = useCurrentRol()

    const [category, setCategory] = useState<string[]>([""])
    const [products, setProducts] = useState<any[]>([])
    const [selectedItem, setSelectedItem] = useState<Product | null>(null)

    const [alertModal, setAlertModal] = useState<boolean>(false)
    const [alertPersonal, setAlertPersonal] = useState<boolean>(false)
    const [ticketLoad, setTicketLoad] = useState<boolean>(true)
    const [search, setSearch] = useState<string>("")

    const { showSnackbar } = useSnackbar()
    const { hotel_id } = useProfile()
    const { cocina: withCocina, restaurante: withRestaurante } = useModulos()

    const room = useSelectedRoom()
    const { colaboradores } = usePersonalRoomService({ skip: restaurantMode })

    const {
        appenedCategories,
        appenedProduct,
        appenedComment,
        appenedExtras,
        remove,
        getSelectedValue,
        reset,
        selectedList,
        categoryList,
        total,
    } = useSelectedProducts({ defaultProducts, onChange })

    const { visiblePrompt, isDirty, setVisiblePrompt } = useRSNavigate(selectedList.length)

    const { data: categorias_articulos } = useGetCategoriasRsQuery({
        variables: { hotel_id },
        onCompleted(data) {
            const categories = data?.categorias_articulos || []
            appenedCategories(categories)
            setCategory([categories?.[0]?.categoria_id])
        },
    })

    const { almacenArticulos, loading, loadPage } = useArticulosRoomServiceQuery({
        filterCategoryId: category,
        search,
    })

    const categorias = useMemo(() => categorias_articulos?.categorias_articulos || [], [categorias_articulos])

    const fetchProducts = () => {
        try {
            const products: AlmacenArticuloPlain[] = almacenArticulos?.map((item) => {
                return {
                    ...item,
                    almacen: item?.almacen?.nombre || "",
                    articulo: item.articulo as Articulo,
                    cantidad_minima: item.articulo?.cantidad_minima || 0,
                    categoria_id: item.articulo?.categoria_id || "",
                    descripcion: item.articulo?.descripcion || "",
                    contenido: item.articulo?.contenido || 0,
                    extra: item.articulo?.extra || false,
                    fecha_registro: item.articulo?.fecha_registro,
                    nombre: item.articulo?.nombre || "",
                    tipo: item.articulo?.tipo || "",
                    foto: item.articulo?.foto || "",
                    marca: item.articulo?.marca || "",
                    unidad: item.articulo?.unidad || "",
                    sku: item.articulo?.sku || "",
                    estado: item.estado || "",
                    categoria_articulo: item?.articulo?.categoria_articulo,
                    cantidad: item?.cantidad || 0,
                    costo: item.articulo?.costo?.monto || 0,
                    precio: item.articulo?.precio?.monto || 0,
                }
            })
            setProducts(products || [])
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [categorias, almacenArticulos])

    const selectedCategories = useMemo(() => {
        const items = categorias.filter((i) => category.some((c) => c === i?.categoria_id)) || []

        return items.map((i) => ({
            name: `${i?.nombre}`,
            label: i?.nombre ? getEmptyMessage(capitalize(i?.nombre)) : getEmptyMessage("default"),
            value: i?.categoria_id,
            icon: getIcon(`${i?.nombre}`),
        }))
    }, [category])

    const configItems = useMemo(() => {
        const cocinaOptions = [
            { icon: "RecipeHistory", url: "/u/cocina" },
            { icon: "Clock", url: "/u/room-service/historial" },
        ]
        return [...(withCocina ? cocinaOptions : []), { icon: "Gear", url: "/u/room-service/categorias" }]
    }, [withCocina])

    if (selectedList.length === 1) {
        setTimeout(() => {
            setTicketLoad(false)
        }, 500)
    }

    const onSubmit = () => (onConfirm ? onConfirm(selectedList) : onAddSubmit())

    const onAddSubmit = () => {
        if (selectedList.length > 0) {
            setItems(selectedList)

            if (!restaurantMode) {
                if (withRestaurante && colaboradores.length === 0) {
                    setAlertPersonal(true)
                    return
                }

                navigate("/u/room-service/detalle-compra", {
                    state: {
                        productList: selectedList,
                        categoryList,
                        total,
                        fromRoomDetail: fullscreen,
                        room: {
                            nombre: room?.nombre || "",
                            rentaId: room?.ultima_renta?.renta_id || "",
                        },
                        selectedRoom: fullscreen ? room : {},
                    },
                })
            } else {
                navigate("/u/restaurante/detalle-compra", {
                    state: {
                        productList: selectedList,
                        categoryList,
                        total,
                        mesa,
                        fromRestaurant: restaurantMode,
                    },
                })
            }
        } else {
            showSnackbar({
                title: "Selecciona un producto",
                text: "Selecciona un producto del catálogo para continuar.",
                status: "error",
            })
        }
    }

    const handleRedirect = (path: string) => (isDirty ? setVisiblePrompt(path) : navigate(path))

    const { data: fetchConfig } = useConfiguracionInventarioQuery({ variables: { hotel_id } })
    const config = fetchConfig?.configuraciones_inventario?.[0]?.inventario_negativo

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0
        }
        if (!search && !category.some(Boolean)) setCategory([categorias?.[0]?.categoria_id])
    }, [search])

    const searchRef = useRef<SearchStaticRef>(null)

    const setContainer = useInfiniteScroll(() => {
        if (loading) {
            return
        }
        loadPage()
    })

    const handleSearchFocus = () => searchRef.current?.input?.current?.focus()

    useEffect(() => {
        handleSearchFocus()
    }, [selectedList.length])

    return (
        <Screen
            title={
                title
                    ? title
                    : restaurantMode
                    ? `Restaurante${mesa ? ` - ${mesa?.nombre}` : ""}`
                    : `Room service${fullscreen ? ` - ${room?.nombre}` : ""}`
            }
            className="room-service-screen"
            contentClassName={`room-service${!fullscreen ? " room-service-short" : ""}`}
            close={fullscreen}
            onClose={() => {
                navigate(-1)
                if (fullscreen) removeItems()
            }}
            headerRight={
                <div className="cortes-screen__header">
                    {!fullscreen ? (
                        <div className="room-service__right-button">
                            <Button
                                type="button"
                                text="Estatus de órdenes"
                                theme={"secondary"}
                                className="room-service__order-btn"
                                onClick={() => handleRedirect("/u/room-service/ordenes")}
                                icon="draft"
                            />
                            {configItems.map((item, index) => (
                                <Touchable
                                    className="room-service__header__icon"
                                    style={{
                                        height: 40,
                                        width: 48,
                                        alignItems: "center",
                                        justifyContent: "middle",
                                    }}
                                    onClick={() => handleRedirect(item.url)}
                                    key={index}
                                >
                                    <Icon name={item.icon} color="#0E0E0E" height={"20px"} width={"20px"} />
                                </Touchable>
                            ))}
                        </div>
                    ) : (
                        <div className="room-service__right-button" />
                    )}
                </div>
            }
        >
            <section className="room-service__left">
                <Search
                    ref={searchRef}
                    className="room-service__search"
                    onChange={(value) => {
                        setSearch(value)
                        if (value) {
                            setCategory([])
                        }
                    }}
                />
                <InputTabs
                    containerClassName="room-service__tabs scrollbar__light-fat"
                    label={""}
                    items={
                        categorias?.map((i) => {
                            return {
                                value: i?.categoria_id,
                                label: i?.nombre,
                                disabled: loading,
                            }
                        }) || []
                    }
                    value={category}
                    onChange={(value) => {
                        if (!value) {
                            return
                        }
                        searchRef.current?.setValue("")
                        setSearch("")
                        fetchProducts()
                        setCategory([value])
                    }}
                />
                {products.length > 0 ? (
                    search ? (
                        <div
                            className={`room-service__content room-service__content-cards scrollbar__light-fat${
                                fullscreen ? " room-service__content--fullscreen" : ""
                            }`}
                            ref={setContainer}
                        >
                            {products.map(
                                ({
                                    almacen_articulo_id = "",
                                    precio = 0,
                                    foto = "",
                                    cantidad = 0,
                                    marca = "",
                                    contenido = "",
                                    nombre = "",
                                    unidad = "",
                                    tipo = "",
                                    categoria_id = "",
                                    extra = false,
                                    categoria_articulo,
                                }) => {
                                    const cantidad_productos = getSelectedValue(almacen_articulo_id)
                                    return (
                                        <ProductCard
                                            className="room-service__card"
                                            key={`${almacen_articulo_id}`}
                                            name={nombre}
                                            description={`${marca}`}
                                            conenido={` - ${contenido} ${unidad}`}
                                            cost={precio}
                                            size={cantidad}
                                            image={foto}
                                            value={cantidad_productos}
                                            negative={config}
                                            type={tipo}
                                            onChange={validateIsColabActive((number) => {
                                                searchRef.current?.setValue("")
                                                if (number > cantidad_productos) {
                                                    appenedProduct({
                                                        id: almacen_articulo_id,
                                                        name: nombre,
                                                        cost: precio,
                                                        number,
                                                        categoryId: categoria_id || "search",
                                                        category: categoria_articulo?.nombre || "Búsqueda",
                                                        extras: [],
                                                        type: tipo,
                                                        price: precio,
                                                        extra,
                                                        unique: uniqueProduct,
                                                        selection_id: uuid(),
                                                    })
                                                } else {
                                                    remove(almacen_articulo_id)
                                                }
                                            })}
                                            onPreventDecrement={
                                                onPreventReduce ? () => onPreventReduce(almacen_articulo_id) : undefined
                                            }
                                        />
                                    )
                                }
                            )}
                            {loading &&
                                emptyCards.map((_, index) => (
                                    <ProductCard
                                        conenido=""
                                        size={0}
                                        className="room-service__card"
                                        key={index}
                                        load={true}
                                        name=""
                                        image=""
                                        description=""
                                        type=""
                                        value={0}
                                        cost={0}
                                        onChange={() => null}
                                    />
                                ))}
                        </div>
                    ) : (
                        <ProductCards
                            category={category}
                            className={`room-service__content room-service__content-cards scrollbar__light-fat${
                                fullscreen ? " room-service__content--fullscreen" : ""
                            }`}
                            ref={setContainer}
                        >
                            <>
                                {products.map(
                                    ({
                                        almacen_articulo_id = "",
                                        precio = 0,
                                        foto = "",
                                        cantidad = 0,
                                        marca = "",
                                        contenido = "",
                                        nombre = "",
                                        unidad = "",
                                        tipo = "",
                                        extra = false,
                                        categoria_id = "",
                                        categoria_articulo,
                                    }) => {
                                        const cantidad_productos = getSelectedValue(almacen_articulo_id)
                                        return (
                                            <ProductCard
                                                className="room-service__card"
                                                key={`${almacen_articulo_id}`}
                                                name={nombre}
                                                description={`${marca}`}
                                                conenido={`- ${contenido} ${unidad}`}
                                                cost={precio}
                                                size={cantidad}
                                                image={foto}
                                                value={cantidad_productos}
                                                negative={config}
                                                type={tipo}
                                                onChange={validateIsColabActive((number) => {
                                                    searchRef.current?.setValue("")
                                                    if (number > cantidad_productos) {
                                                        appenedProduct({
                                                            id: almacen_articulo_id,
                                                            name: nombre,
                                                            cost: precio,
                                                            number,
                                                            categoryId: categoria_id,
                                                            category: categoria_articulo.nombre,
                                                            extras: [],
                                                            type: tipo,
                                                            price: precio,
                                                            extra,
                                                            unique: uniqueProduct,
                                                            selection_id: uuid(),
                                                        })
                                                    } else {
                                                        remove(almacen_articulo_id)
                                                    }
                                                })}
                                                onPreventDecrement={
                                                    onPreventReduce
                                                        ? () => onPreventReduce(almacen_articulo_id)
                                                        : undefined
                                                }
                                            />
                                        )
                                    }
                                )}
                                {loading &&
                                    emptyCards.map((_, index) => (
                                        <ProductCard
                                            conenido=""
                                            size={0}
                                            className="room-service__card"
                                            key={index}
                                            load={true}
                                            name=""
                                            image=""
                                            description=""
                                            type=""
                                            value={0}
                                            cost={0}
                                            onChange={() => null}
                                        />
                                    ))}
                            </>
                        </ProductCards>
                    )
                ) : loading ? (
                    <ProductCards
                        category={category}
                        className={`room-service__content room-service__content-cards scrollbar__light-fat${
                            fullscreen ? " room-service__content--fullscreen" : ""
                        }`}
                    >
                        {emptyCards.map((_, index) => (
                            <ProductCard
                                conenido=""
                                size={0}
                                className="room-service__card"
                                key={index}
                                load={true}
                                name=""
                                image=""
                                description=""
                                type=""
                                value={0}
                                cost={0}
                                onChange={() => null}
                            />
                        ))}
                    </ProductCards>
                ) : (
                    <Empty
                        className={`room-service__empty${fullscreen ? " room-service__empty--fullscreen" : ""}`}
                        title={search ? "Sin resultados" : selectedCategories?.[0]?.label}
                        description={search ? `No hay resultados para **'${search}'**. Intenta de nuevo.` : ""}
                        icon={search ? "searchLg" : selectedCategories?.[0]?.icon}
                    />
                )}
            </section>
            <section className="room-service__right">
                <Ticket title={"Resumen"} className="room-service__ticket" withButton={false}>
                    {selectedList.length > 0 && showReset ? (
                        <Link
                            className="room-service__ticket-link"
                            onClick={() => {
                                reset()
                                removeItems()
                            }}
                        >
                            {"Borrar orden"}
                        </Link>
                    ) : null}
                    <TicketContent>
                        {selectedList.length === 1 && ticketLoad ? (
                            <div className="element-ticket-skeleton-container">
                                {[1, 2, 3, 4, 5, 6].map((index) => (
                                    <ElementTicketSkeleton key={index} />
                                ))}
                            </div>
                        ) : selectedList.length > 0 ? (
                            <TicketBlock className="room-service__ticket__block">
                                {selectedList.map((item, index) => {
                                    return (
                                        <TicketItem
                                            key={index}
                                            number={item.number}
                                            name={item.name}
                                            cost={item.cost}
                                            price={item.price}
                                            comment={item.comment || ""}
                                            extras={item.extras || []}
                                            type={item?.type}
                                            extra={item.extra}
                                            onRemove={() =>
                                                onPreventReduce ? onPreventReduce(item.id) : remove(item.id)
                                            }
                                            onChange={(value) => appenedComment(item.id, value)}
                                            onClickExtra={() => setSelectedItem(item)}
                                            onCloseModal={handleSearchFocus}
                                        />
                                    )
                                })}
                            </TicketBlock>
                        ) : (
                            <Empty className="room-service__ticket__empty" title="No hay productos" icon="shopCart" />
                        )}
                        {selectedList.length === 1 && ticketLoad ? (
                            <div className="total-ticket-skeleton-container">
                                {[1, 2, 3].map((index) => (
                                    <TotalTicketSkeleton key={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="room-service__ticket__currency">
                                <Subtotal categories={categoryList} />
                                <Total total={total} />
                            </div>
                        )}
                    </TicketContent>
                    <div className="ticket__footer">
                        <Button onClick={validateIsColabActive(onSubmit)} className="ticket__button" text="Continuar" />
                    </div>
                </Ticket>
            </section>
            <EditAlertModal
                visible={alertModal}
                onClose={() => {
                    setAlertModal(false)
                    handleSearchFocus()
                }}
            />
            {selectedItem && (
                <ModalExtras
                    isOpen={true}
                    product={selectedItem as any}
                    onChange={(value) => {
                        appenedExtras(
                            value.map((v) => {
                                return {
                                    ...v,
                                    cost: v?.price || 0,
                                    selection_id: selectedItem.selection_id,
                                }
                            }),
                            selectedItem?.selection_id || ""
                        )
                    }}
                    onClose={() => {
                        setSelectedItem(null)
                        handleSearchFocus()
                    }}
                />
            )}
            {visiblePrompt && (
                <PromptRS
                    visible={true}
                    onClose={() => {
                        setVisiblePrompt("")
                        handleSearchFocus()
                    }}
                    onConfirm={() => {
                        reset()
                        navigate(visiblePrompt)
                    }}
                />
            )}
            {alertPersonal && (
                <AlertaPersonal visible={true} onClose={() => setAlertPersonal(false)} onConfirm={() => null} />
            )}
            {InactiveModal}
        </Screen>
    )
}

export default RoomService
