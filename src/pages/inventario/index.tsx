import Screen from "src/shared/components/layout/screen/Screen"
import "./Inventario.css"
import { headers, TypeArticleDeactivate, TypeArticleActivate } from "./constants/inventory"
import { useNavigate } from "react-router-dom"
import {
    useAlmacenesQuery,
    useGetAlmacenArticuloByIdLazyQuery,
    useInforme_InventarioQuery,
    GetAlmacenArticuloByIdQuery,
    TipoArticulo,
    Almacen,
    AlmacenArticulo,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { useEffect, useMemo, useRef, useState } from "react"
import { Drop } from "../Cortes/home/sections/History"
import Touchable from "src/shared/components/general/touchable/Touchable"
import Icon from "src/shared/icons"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import { AddButton } from "../gastos/components/AddButton/AddGasto"
import SkeletonCards from "../gastos/components/gastos-list/SkeletonCard/SkeletonCard"
import { TableSkeleton, tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { toggleInventarioDetailDrawer } from "src/store/inventario/inventario.slice"
import Carousel from "src/pages/inventario/components/carousel/Carousel"
import { MOSAIC_ESTADO_FILTERS, MosaicCategoryFilter } from "./constants/mosaic-filters"
import { CardsHome } from "./sections/home/cards/CardsHome"
import { getCurrencyFormat } from "src/utils/string"
import FlexibleTable, {
    FlexibleTableRef,
    SortFilterValue,
    TableFilter,
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Mosaic from "./sections/mosaic/Mosaic"
import ProductDetails from "./sections/product-details/ProductDetails"
import DetalleProduccion from "./recipes-process/detalle/DetalleProduccion"
import useSortTable from "src/shared/hooks/useSortTable"
import Selector from "src/shared/components/forms/Selector/Selector"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import useArticulosTableQuery from "./hooks/useArticulosTableQuery"
import { getDataTabs } from "./helpers/getDataTabs"
import { getDataTable } from "./helpers/getDataTable"
import getHeaders from "./hooks/getHeaders"
import LazySearch, { LazySearchRef } from "src/shared/sections/room-service/LazySearch/LazySearch"
import { FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

export const TODOS_ALMACEN_FILTER = { label: "Todos", value: "" }

export interface FilterSortState {
    almacenFilters?: TableFilter[]
    tipoFilters?: TableFilter[]
    disponibilidadFilters?: TableFilter[]
    nameSort?: SortFilterValue
}

function Inventario(): JSX.Element {
    const [load, setLoad] = useState<boolean>(true)
    const skeletonCardsRef = useRef<HTMLDivElement>(null)

    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    useEffect(() => {
        if (load && skeletonCardsRef.current) {
            skeletonCardsRef.current.scrollIntoView({ block: "start" })
        }
    }, [load])

    useEffect(() => {
        if (load) {
            const mainContainer = document.querySelector(".screen")
            if (mainContainer) {
                (mainContainer as HTMLElement).scrollTo(0, 0)
            } else {
                window.scrollTo(0, 0)
            }
        }
    }, [load])

    const navigate = useNavigate()
    const [productionDetail, setProductionDetail] = useState<boolean>(false)

    const { isInventarioDetailDrawerOpen, productosMosaic } = useSelector((root: RootState) => root.inventario)
    const dispatch = useDispatch()
    const { hotel_id } = useProfile()
    const [almacenHeader, setAlmacenHeader] = useState<{ value: string; valueToDisplay: string }[]>([])

    const [mosaicSelectedEstadoFilter, setMosaicSelectedEstadoFilter] = useState<any>(MOSAIC_ESTADO_FILTERS[0].value)
    const [mosaicSelectedCategoriaFilter, setMosaicSelectedCategoriaFilter] = useState<MosaicCategoryFilter>(
        TODOS_ALMACEN_FILTER.value
    )

    const [GetAlmacenArticuloByIdQuery] = useGetAlmacenArticuloByIdLazyQuery()

    const [listView, setListView] = useState<boolean>(true)
    const [dataCards, setDataCards] = useState<any>([])

    const [itemSelected, setItemSelected] = useState<GetAlmacenArticuloByIdQuery>()

    const { data: informe, refetch: reloadInforme } = useInforme_InventarioQuery({
        variables: {
            hotel_id,
        },
    })

    useEffect(() => {
        const variables = { hotel_id: hotel_id }
        reloadInforme(variables)
    }, [])

    useEffect(() => {
        if (informe) {
            setDataCards([
                {
                    title: "Valor comercial",
                    number: getCurrencyFormat(informe?.informe_inventario?.valor_comercial),
                    titleToolTip: "Valor comercial",
                    toolTip: "Tu inventario al precio de venta.",
                },
                {
                    title: "Costo total de inventario",
                    number: getCurrencyFormat(informe?.informe_inventario?.costo_total_inventario),
                    titleToolTip: "Costo total de inventario",
                    toolTip: "Costo de tu inventario con base en el costo final de tus productos.",
                },
                {
                    title: "Cantidad de artículos",
                    number: informe?.informe_inventario?.cantidad_articulos,
                    titleToolTip: "Cantidad de artículos",
                    toolTip: "Total de unidades con las que cuenta tu inventario.",
                },
                {
                    title: "Artículos por agotarse",
                    number: informe?.informe_inventario?.articulos_por_agotarse,
                },
                {
                    title: "Artículos agotados",
                    number: informe?.informe_inventario?.articulos_agotados,
                },
            ])
        }
    }, [informe])

    const onSortData = (value: { sort: "up" | "down" | null; fromHeader: string; idx: number } | null) => {
        if (!value) {
            return
        }
        setDataTables(
            useSortTable({
                i: value.idx,
                sortedData: dataTables,
                startList: dataTables,
                sortState: value.sort,
            })
        )
        setfilterSortState((v) => ({ ...v, nameSort: value }))
    }

    const [almacenSelected, setAlmacen] = useState<string>(TODOS_ALMACEN_FILTER.value)
    const [search, setSearch] = useState<AlmacenArticulo | undefined | null>()
    const [onboarding, setOnboarding] = useState<boolean>(true)
    const [almacenes, setAlmacenes] = useState<any[]>([])
    const [dataTables, setDataTables] = useState<FlexibleTableRow[]>([])
    const [filterSortState, setfilterSortState] = useState<FilterSortState>()
    const [showGradient, setShowGradient] = useState(false)

    const [page, setpage] = useState(1)

    useEffect(() => {
        if (page === 1) {
            return
        }
        setpage(1)
    }, [almacenSelected, filterSortState])

    const { data: dataAlmacenes, refetch: reloadAlmacenes } = useAlmacenesQuery({
        variables: {
            hotel_id: hotel_id,
            eliminado: false,
        },
    })

    const almacenesIds = useMemo(() => dataAlmacenes?.almacenes.map((a) => a.almacen_id), [dataAlmacenes])

    const {
        articulos,
        currentPage,
        totalPages,
        refecth: refecthArticulos,
        isLoading,
    } = useArticulosTableQuery({
        page,
        almacenSelected: almacenSelected || TODOS_ALMACEN_FILTER.label,
        almacenes: almacenesIds || [],
        filterSortState,
    })

    const isEmptyInventario = useMemo(() => !articulos?.length && onboarding && !isLoading, [onboarding, articulos])

    useEffect(() => {
        if (search) {
            return setAlmacen(search.almacen?.almacen_id || "")
        }
    }, [search])

    useEffect(() => {
        if (!isLoading && articulos && page === currentPage) {
            setDataTables(
                getDataTable({
                    almacenSelected,
                    articulos,
                    search,
                })
            )
            setOnboarding(false)
        }
    }, [articulos, search, almacenHeader, isLoading, page, currentPage])

    useEffect(() => {
        const data = getDataTabs({ almacenes: (dataAlmacenes?.almacenes as Almacen[]) || [] })
        setAlmacenes(data.resultado)
        setAlmacenHeader(data.headers)
    }, [dataAlmacenes])

    useEffect(() => {
        if (articulos.length && dataTables) setLoad(false)
    }, [articulos, dataTables])

    const { headersAll } = getHeaders({ almacenHeader })

    function obtenerIdAlmacenArticuloPorArticulo(articuloId) {
        const articuloAlmacen = productosMosaic?.almacenes_articulos?.find(
            (almacenArticulo) => almacenArticulo.articulo_id === articuloId
        )
        return articuloAlmacen?.almacen_articulo_id || ""
    }

    const onConfirmChange = () => {
        const almacen_articulo_id = itemSelected?.almacen_articulo.almacen_articulo_id || ""
        GetAlmacenArticuloByIdQuery({
            variables: {
                almacen_articulo_id,
            },
        }).then(({ data }) => {
            setItemSelected(data)
        })
        setLoad(true)
        reloadInforme({ hotel_id: hotel_id, almacen_id: almacenSelected || null })
        reloadAlmacenes({
            hotel_id: hotel_id,
            eliminado: false,
        })
        setMosaicSelectedCategoriaFilter(TODOS_ALMACEN_FILTER.label)
        refecthArticulos({ almacenSelected: almacenSelected, page: 1 }).then(() => {
            setLoad(false)
        })
    }

    const onSelectedFilters = (value: TableFilter[]) => {
        const filtersFormated: FilterSortState = {}
        value.map((v) => {
            if (v.fromHeader === "Disponibilidad") {
                filtersFormated.disponibilidadFilters = [v]
            }
            if (v.fromHeader === "Tipo") {
                filtersFormated.tipoFilters = [v]
            }
            if (v.fromHeader === "Almacén") {
                filtersFormated.almacenFilters = [v]
            }
        })
        lazySearchRef.current?.handleClear()
        setfilterSortState((v) => ({ ...v, ...filtersFormated }))
    }

    const lazySearchRef = useRef<LazySearchRef>(null)
    const flexibleTableRef = useRef<FlexibleTableRef>(null)
    const { skeletonRows } = tableSkeletonRows({ headers: almacenSelected ? headers : headersAll })

    return (
        <Screen
            className="inventario__screen"
            title={isEmptyInventario ? "¡Bienvenido a tu Inventario!" : "Inventario"}
            contentClassName="inventario"
            close={true}
            onClose={() => navigate("/u")}
            headerRight={
                isEmptyInventario ? null : (
                    <div className="inventario-screen-right">
                        <div className="inventario-screen-right-search">
                            <LazySearch
                                filtersTipoArticulo={[TipoArticulo.Insumo, TipoArticulo.Proceso, TipoArticulo.Venta]}
                                ref={lazySearchRef}
                                className="inventario-screen__table-input"
                                almacen
                                onChange={(v?: AlmacenArticulo | null) => {
                                    setSearch(v)
                                }}
                                onClear={(searched) => {
                                    setSearch(undefined)
                                }}
                            />
                            <Drop
                                title="Gestión de inventario"
                                options={[
                                    {
                                        label: "Transferencia de artículos",
                                        onClick: validateIsColabActive(() => navigate("/u/inventario/transfer-items")),
                                    },
                                    {
                                        label: "Surtido de artículos",
                                        onClick: validateIsColabActive(() => navigate("/u/inventario/surtido-articulos")),
                                    },
                                    {
                                        label: "Historial de inventario",
                                        onClick: () => navigate("/u/inventario/historial-movimientos"),
                                    },
                                ]}
                            />
                        </div>
                        <Touchable
                            className="cortes-screen-header-icon"
                            style={{ height: 40, width: 40, alignItems: "center", padding: "10px", marginRight: 16 }}
                            onClick={() => {
                                navigate("receta-proceso")
                            }}
                        >
                            <Icon name="RecipeHistory" color="#0E0E0E" height={"20px"} width={"20px"} />
                        </Touchable>
                        <Touchable
                            className="cortes-screen-header-icon"
                            style={{ height: 40, width: 40, alignItems: "center", padding: "10px" }}
                            onClick={() => {
                                navigate("categoria")
                            }}
                        >
                            <Icon name="Gear" color="#0E0E0E" height={"20px"} width={"20px"} />
                        </Touchable>
                    </div>
                )
            }
        >
            {load ? (
                <section className="inventario__container">
                    <div className="inventario_tabs_container">
                        <TabMenu
                            className="inventario_tabs scrollbar__light-fat"
                            tabList={almacenes}
                            value={almacenSelected}
                        />
                    </div>
                    <div className="inventario_home_cards_container">
                        <SkeletonCards />
                    </div>
                    <div className="inventario_list_container">
                        <TableSkeleton headers={headersAll} />
                    </div>
                </section>
            ) : isEmptyInventario ? (
                <Carousel onConfirm={() => setOnboarding(false)} />
            ) : (
                <section className="inventario__container">
                    <section className="inventario_tabs_container">
                        <div className="inventario_tabs scrollbar__light-fat">
                            <TabMenu
                                tabList={almacenes}
                                value={almacenSelected}
                                onChange={(value) => {
                                    // setNewInfo(true)
                                    setLoad(true)
                                    setOnboarding(false)
                                    setAlmacen(value || TODOS_ALMACEN_FILTER.value)
                                    lazySearchRef.current?.handleClear()
                                    flexibleTableRef.current?.setFiltersFromOuterState([])
                                    setSearch(undefined)
                                    reloadInforme({ hotel_id: hotel_id, almacen_id: value || null })
                                    setMosaicSelectedCategoriaFilter(value || TODOS_ALMACEN_FILTER.value)
                                    setTimeout(() => setLoad(false), 3000)
                                }}
                                showNumerOnNoItems={true}
                            />
                        </div>
                        <div
                            style={{
                                height: "40px",
                                justifyContent: "space-between",
                                alignItems: "center",
                                display: "flex",
                                columnGap: "10px",
                            }}
                        >
                            {!listView && (
                                <Selector
                                    dropdownPlacement="rtl"
                                    iconMode
                                    iconProps={{
                                        color: "var(--header)",
                                    }}
                                    value={mosaicSelectedEstadoFilter}
                                    options={MOSAIC_ESTADO_FILTERS}
                                    title=""
                                    icon="filterFill"
                                    onChange={(v) => {
                                        setMosaicSelectedEstadoFilter({
                                            label: v.label,
                                            value: v.value,
                                        })
                                    }}
                                />
                            )}
                            <Touchable
                                className="cortes-screen-header-icon"
                                style={{ height: 40, alignItems: "center" }}
                                onClick={() => {
                                    // toggle mosaic / table
                                    setListView(!listView)
                                    // set category and filters to "Todos"
                                    setMosaicSelectedEstadoFilter(MOSAIC_ESTADO_FILTERS[0].value)
                                    setMosaicSelectedCategoriaFilter(MOSAIC_ESTADO_FILTERS[0].value.value)
                                }}
                            >
                                <Icon
                                    name={listView ? "dashboardFill" : "list"}
                                    color="#0E0E0E"
                                    height={"20px"}
                                    width={"20px"}
                                />
                            </Touchable>
                        </div>
                    </section>
                    <div className="inventario_home_cards_container">
                        <CardsHome data={dataCards} />
                    </div>
                    {listView ? (
                        <TablePaginatorWrapper
                            currentPage={currentPage}
                            onChange={(p) => setpage(p)}
                            pages={totalPages}   
                        >
                            <div className={`inventario_list_container${showGradient ? ' show-gradient' : ''}`}>
                                <FlexibleTable
                                    ref={flexibleTableRef}
                                    onSort={(value) => onSortData(value)}
                                    onSelectedFilters={onSelectedFilters}
                                    tableItems={{
                                        ...{
                                            headers: almacenSelected ? headers : headersAll,
                                            rows: isLoading
                                                ? skeletonRows
                                                : dataTables?.map((row) => ({
                                                    value: row.value.map(({ value }, index) => ({
                                                        value:
                                                              !almacenSelected && index === headersAll.length - 1 ? (
                                                                  <p
                                                                      className={
                                                                          "inventario-list-cell " +
                                                                          value?.toString().toLowerCase()
                                                                      }
                                                                  >
                                                                      {value}
                                                                  </p>
                                                              ) : almacenSelected && index === headers.length - 1 ? (
                                                                  <p
                                                                      className={
                                                                          "inventario-list-cell " +
                                                                          value?.toString().toLowerCase()
                                                                      }
                                                                  >
                                                                      {value}
                                                                  </p>
                                                              ) : (
                                                                  value
                                                              ),
                                                    })),
                                                    goTo: row.goTo,
                                                })),
                                        },
                                    }}
                                    goTo={(id) => {
                                        if (id) {
                                            GetAlmacenArticuloByIdQuery({
                                                variables: {
                                                    almacen_articulo_id: id,
                                                },
                                            }).then(({ data }) => {
                                                setItemSelected(data)
                                                if (data?.almacen_articulo?.articulo?.tipo === TipoArticulo.Proceso) {
                                                    setProductionDetail(true)
                                                } else {
                                                    dispatch(toggleInventarioDetailDrawer(true))
                                                }
                                            })
                                        }
                                    }}
                                    emptyState={
                                        search === null
                                            ? {
                                                subTitle: "No se encontraron productos",
                                                headerIcon: "searchLg",
                                            }
                                            : {
                                                titile: "Sin artículos registrados",
                                                subTitle:
                                                      "¡Aún no tienes artículos registrados en tu almacén! Comienza agregando nuevos artículos para poder gestionarlos y mantener tu stock actualizado.",
                                                headerIcon: "packageFill",
                                                button: "Agregar artículo",
                                                onClick: validateIsColabActive(() => navigate("/u/inventario/producto/agregar")),
                                            }
                                    }
                                    onHasScrollChange={setShowGradient}
                                ></FlexibleTable>
                            </div>
                        </TablePaginatorWrapper>
                    ) : (
                        <div className="inventario_cards_container">
                            <Mosaic
                                searchValue={search}
                                onSelectItem={(id) => {
                                    const almacen_articulo_id = obtenerIdAlmacenArticuloPorArticulo(id)
                                    if (almacen_articulo_id) {
                                        GetAlmacenArticuloByIdQuery({
                                            variables: {
                                                almacen_articulo_id,
                                            },
                                        }).then(({ data }) => {
                                            setItemSelected(data)
                                            if (data?.almacen_articulo?.articulo?.tipo === TipoArticulo.Proceso) {
                                                setProductionDetail(true)
                                            } else {
                                                dispatch(toggleInventarioDetailDrawer(true))
                                            }
                                        })
                                    }
                                }}
                                filterCategoriaSelected={mosaicSelectedCategoriaFilter}
                                filterEstadoSelected={mosaicSelectedEstadoFilter.value}
                            ></Mosaic>
                        </div>
                    )}
                </section>
            )}
            <ProductDetails
                isOpen={isInventarioDetailDrawerOpen}
                almacenArticulo={itemSelected}
                onClose={() => {
                    dispatch(toggleInventarioDetailDrawer(false))
                }}
                onConfirmChange={onConfirmChange}
                deactivateType={TypeArticleDeactivate[itemSelected?.almacen_articulo.articulo?.tipo || ""]}
                activateType={TypeArticleActivate[itemSelected?.almacen_articulo.articulo?.tipo || ""]}
            />
            {productionDetail && (
                <DetalleProduccion
                    isOpen={true}
                    onClose={() => setProductionDetail(false)}
                    almacenArticulo={itemSelected?.almacen_articulo as any}
                    onConfirmChange={onConfirmChange}
                    deactivateType={TypeArticleDeactivate[itemSelected?.almacen_articulo.articulo?.tipo || ""]}
                    activateType={TypeArticleActivate[itemSelected?.almacen_articulo.articulo?.tipo || ""]}
                />
            )}
            {isEmptyInventario ? null : <AddButton onAdd={validateIsColabActive(() => navigate("/u/inventario/producto/agregar"))} />}
            {InactiveModal}
        </Screen>
    )
}

export default Inventario
