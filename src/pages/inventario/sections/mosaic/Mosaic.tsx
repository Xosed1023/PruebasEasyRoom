import React, { useEffect, useMemo, useState } from "react"
import { v4 as uuid } from "uuid"

import "./Mosaic.css"
import Card from "./card/Card"
import { useProfile } from "src/shared/hooks/useProfile"
import {
    AlmacenArticulo,
    EstadosAlmacenesArticulos,
    EstadosArticulo,
    TipoArticulo,
    UnidadMedidasArticulo,
    useActualizarProductoMutation,
    useAlmacenesQuery,
} from "src/gql/schema"
import { ModalConfirm } from "src/shared/components/layout"
import BoldText from "src/shared/components/layout/modal-confirm/component-helpers/BoldText/BoldText"
import Icon from "src/shared/icons"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import {
    setIsModalActivateProductFromMosaicOpen,
    setIsModalRefillProductFromMosaicOpen,
    setProductFroMosaicSelected,
} from "src/store/inventario/inventario.slice"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import RefillProduct from "../../modals/RefillProduct/RefillProduct"
import { MosaicCategoryFilter } from "../../constants/mosaic-filters"
import { iLikeText } from "src/shared/helpers/ILikeText"
import useInfiniteScroll from "src/shared/hooks/useInfiniteScroll"
import useArticulosMosaicQuery from "./hooks/useArticulosMosaicQuery"
import { TODOS_ALMACEN_FILTER } from "../.."
import { emptyCards } from "src/pages/room-service/productos/Products.constants"
import ProductCard from "src/shared/sections/room-service/Card/ProductCard"

const Mosaic = ({
    filterEstadoSelected,
    filterCategoriaSelected,
    onSelectItem,
    searchValue,
}: {
    filterEstadoSelected: EstadosArticulo | EstadosAlmacenesArticulos | "Todos"
    filterCategoriaSelected: MosaicCategoryFilter
    onSelectItem: (id: string) => void
    searchValue?: AlmacenArticulo | null
}) => {
    const dispatch = useDispatch()
    const [isLoading, setisLoading] = useState(false)
    const {
        isModalActivateProductFromMosaicOpen,
        productFormMosaicSelected,
        isModalRefillProductFromMosaicOpen,
        productosMosaic,
    } = useSelector((state: RootState) => state.inventario)
    const { showMiniSnackbar } = useMiniSnackbar()

    const { hotel_id } = useProfile()
    const [updateProduct] = useActualizarProductoMutation()

    const [page, setpage] = useState(1)

    const { data: dataAlmacenes, refetch: reloadAlmacenes } = useAlmacenesQuery({
        variables: {
            hotel_id: hotel_id,
            eliminado: false,
        },
    })

    const almacenesIds = useMemo(() => dataAlmacenes?.almacenes.map((a) => a.almacen_id), [dataAlmacenes])

    const filterSortState = useMemo(
        () =>
            filterEstadoSelected !== TODOS_ALMACEN_FILTER.label
                ? {
                    disponibilidadFilters: [
                        {
                            filter: filterEstadoSelected,
                            fromHeader: "Disponibilidad",
                            idx: 1,
                        },
                    ],
                }
                : undefined,
        [filterEstadoSelected]
    )

    const {
        articulos,
        currentPage,
        totalPages,
        refecth: refecthArticulos,
        isLoading: isLoadingItems,
    } = useArticulosMosaicQuery({
        page,
        almacenSelected: filterCategoriaSelected,
        almacenes: almacenesIds || [],
        filterSortState,
    })

    const setContainer = useInfiniteScroll(() => {
        if (currentPage > totalPages) {
            return
        }
        setpage((p) => p + 1)
    })

    useEffect(() => {
        console.log(productosMosaic)
    }, [productosMosaic])

    const filterAlmacerArticulo = (
        almacenArticulo: AlmacenArticulo,
        filter: EstadosArticulo | EstadosAlmacenesArticulos | "Todos"
    ) => {
        if (filterEstadoSelected === "Todos") {
            return true
        }
        if (filter === EstadosArticulo.Activado) {
            return almacenArticulo.articulo?.estado === EstadosArticulo.Activado
        }
        if (filter === EstadosArticulo.Desactivado) {
            return almacenArticulo.articulo?.estado === EstadosArticulo.Desactivado
        }
        if (filter === EstadosAlmacenesArticulos.Agotado) {
            return almacenArticulo.estado === EstadosAlmacenesArticulos.Agotado
        }
        if (filter === EstadosAlmacenesArticulos.Disponible) {
            return almacenArticulo.estado === EstadosAlmacenesArticulos.Disponible
        }
        if (filter === EstadosAlmacenesArticulos.PorAgotarse) {
            return almacenArticulo.estado === EstadosAlmacenesArticulos.PorAgotarse
        }
    }

    return (
        <>
            <div className="inventory-mosaic__container">
                <div className="inventory-mosaic__main" ref={setContainer}>
                    {articulos
                        ?.filter((a) => filterAlmacerArticulo(a as AlmacenArticulo, filterEstadoSelected))
                        ?.filter((a) => filterCategoriaSelected === "Todos" || a.almacen_id === filterCategoriaSelected)
                        ?.filter((a) =>
                            searchValue
                                ? iLikeText({
                                    searchText: searchValue.almacen_articulo_id,
                                    fullText: a.articulo?.marca || "",
                                }) ||
                                iLikeText({
                                    searchText: searchValue.almacen_articulo_id,
                                    fullText: a.articulo?.nombre || "",
                                })
                            : true
                        )
                        .map((almacenArticulo) => (
                            <Card
                                type={almacenArticulo.articulo?.tipo || TipoArticulo.Insumo}
                                key={uuid()}
                                article_id={almacenArticulo?.articulo?.articulo_id || ""}
                                content={almacenArticulo?.articulo?.contenido || 0}
                                estadoAlmacenArticulo={almacenArticulo.estado}
                                estadoArticulo={almacenArticulo.articulo?.estado as EstadosArticulo}
                                isInsumo={almacenArticulo?.articulo?.tipo === TipoArticulo.Insumo}
                                marca={almacenArticulo?.articulo?.marca || ""}
                                measurement={almacenArticulo?.articulo?.unidad || UnidadMedidasArticulo.Pz}
                                mediumLimit={almacenArticulo?.articulo?.cantidad_minima || 5}
                                name={almacenArticulo?.articulo?.nombre || ""}
                                price={almacenArticulo?.articulo?.precio?.monto || 0}
                                units={almacenArticulo?.cantidad || 0}
                                imgUrl={almacenArticulo?.articulo?.foto || undefined}
                                onClickButton={() => {
                                    dispatch(setProductFroMosaicSelected(almacenArticulo))
                                }}
                                onSelectItem={(id) => onSelectItem(id)}
                            />
                        ))}
                    {isLoadingItems &&
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
            </div>

            <ModalConfirm
                isOpen={isModalActivateProductFromMosaicOpen}
                title={"¿Deseas activar este producto?"}
                description={
                    <>
                        Al activar, este producto{" "}
                        <BoldText>estará disponible para resurtir el inventario y para su venta </BoldText>
                        en el servicio a la habitación.
                    </>
                }
                icon={<Icon name="Warning" color="#EB5757" />}
                iconTheme="danger"
                onCloseDialog={({ confirmed }) => {
                    dispatch(setIsModalActivateProductFromMosaicOpen(false))
                    if (confirmed) {
                        setisLoading(true)
                        updateProduct({
                            variables: {
                                articulo_input: {
                                    articulo_id: productFormMosaicSelected?.articulo_id || "",
                                    estado: EstadosArticulo.Activado,
                                },
                            },
                        })
                            .then(() => {
                                reloadAlmacenes()
                                showMiniSnackbar({
                                    text: "Se activó este producto correctamente",
                                    status: "success",
                                    title: "Producto desactivado",
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
                }}
                confirmLabel="Activar"
            />
            <RefillProduct
                isOpen={isModalRefillProductFromMosaicOpen}
                onConfirm={() => {
                    dispatch(setIsModalRefillProductFromMosaicOpen(false))
                    // TODO:
                    refecthArticulos({ almacenSelected: "", page: 1 })
                }}
                onClose={() => {
                    dispatch(setIsModalRefillProductFromMosaicOpen(false))
                }}
                product={{
                    id: productFormMosaicSelected?.articulo_id,
                    contenido: productFormMosaicSelected?.articulo?.contenido,
                    marca: productFormMosaicSelected?.articulo?.marca || "",
                    nombre: productFormMosaicSelected?.articulo?.nombre,
                    stock: productFormMosaicSelected?.cantidad,
                    unidad: productFormMosaicSelected?.articulo?.unidad,
                    tipo: productFormMosaicSelected?.articulo?.tipo,
                    unidades_disponibles: [],
                }}
            />
            <LoaderComponent visible={isLoading} />
        </>
    )
}

export default Mosaic
