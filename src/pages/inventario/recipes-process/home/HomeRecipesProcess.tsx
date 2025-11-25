import { useEffect, useMemo, useRef, useState } from "react"
import "./HomeRecipesProcess.css"
import Screen from "src/shared/components/layout/screen/Screen"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import FlexibleTable, {
    FlexibleTableRef,
    SortFunction,
    TableFilter,
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"
import AuthRequiredModal from "../../modals/Auth/AuthRequiredModal/AuthRequiredModal"
import {
    AlmacenArticulo,
    EstadosArticulo,
    GetAggregationsAlmacenesArticulosOutput,
    TipoArticulo,
    useAgregacionesAlmacenesArticulosQuery,
} from "src/gql/schema"
import SelectProcessRecipeModal from "./components/SelectProcessRecipeModal/SelectProcessRecipeModal"
import useGetCategoriasAlimentosBebidas from "./hooks/useGetCategoriasAlimentosBebidas"
import useTableHeaders from "./hooks/useTableHeaders"
import useArticlesTabs from "./hooks/useArticlesTabs"
import { PathNames } from "./interfaces/pathnames"
import DetalleReceta from "../detalle"
import { TypeArticleActivate, TypeArticleDeactivate } from "../../constants/inventory"
import useGetRecetasProcesos from "./hooks/useGetRecetasProcesos"
import { FilterSortState } from "./interfaces/filterSortState"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import ArticlesToTable from "./helpers/ArticlesToTable"
import { useProfile } from "src/shared/hooks/useProfile"
import LazySearch, { LazySearchRef } from "src/shared/sections/room-service/LazySearch/LazySearch"
import useSearchRecipesProcess from "./hooks/useSearchRecipesProcess"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

const HomeRecipesProcess = () => {
    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const { hotel_id } = useProfile()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()
    const [isModalSelectOpen, setisModalSelectOpen] = useState(false)
    const { data: counters } = useAgregacionesAlmacenesArticulosQuery({
        variables: {
            hotel_id,
        },
    })

    const [searchText, setsearchText] = useState("")
    const { articulosFound } = useSearchRecipesProcess({ name: searchText })
    const [itemSelected, setItemSelected] = useState<any>(null)
    const [articleFromSearch, setarticleFromSearch] = useState<AlmacenArticulo | undefined | null>()
    const [selectedTableTab, setselectedTableTab] = useState<{
        name: PathNames | TipoArticulo.Proceso
        id: string
    }>({
        name: "Todo",
        id: "",
    })

    const { categoriasArticulos } = useGetCategoriasAlimentosBebidas()
    const [page, setpage] = useState(1)
    const [filterSortState, setFilterSortState] = useState<FilterSortState>()
    const [showGradient, setShowGradient] = useState(false)
    const categoriasArticulosFormatted = useMemo(
        () =>
            categoriasArticulos?.map((c) => ({
                name: c.nombre as PathNames | TipoArticulo.Proceso,
                id: c.categoria_id,
            })),
        [categoriasArticulos]
    )

    const { articulos, currentPage, refetch, totalPages } = useGetRecetasProcesos({
        categoria_tipoSelected: selectedTableTab,
        categorias_tipo: categoriasArticulosFormatted,
        page,
        filterSortState,
        articleFromSearch,
    })

    const tableHeaders = useMemo(
        () => useTableHeaders({ categoriasArticulos, selectedTableTab: selectedTableTab.name }),
        [categoriasArticulos, selectedTableTab]
    )
    const tabs = useMemo(
        () =>
            useArticlesTabs({
                counters: counters?.agregaciones_almacenes_articulos as GetAggregationsAlmacenesArticulosOutput,
                categoriasAlimentosBebidas: categoriasArticulos,
            }),
        [categoriasArticulos, counters]
    )

    const searchRef = useRef<LazySearchRef>(null)
    const tableRef = useRef<FlexibleTableRef>(null)

    const onSort: SortFunction = (sortValue) => {
        if (!sortValue) {
            return
        }
        setFilterSortState((v) => ({ ...v, nameSort: sortValue }))
    }

    const onAuthFilled = (v) => {
        setisModalSelectOpen(true)
    }

    const onSearch = (v?: AlmacenArticulo | null) => {
        setarticleFromSearch(v)
        if (v?.articulo?.tipo === TipoArticulo.Proceso) {
            setselectedTableTab({
                name: TipoArticulo.Proceso,
                id: "",
            })
            return
        }
        setselectedTableTab({
            name: (v?.articulo?.categoria_articulo?.nombre as PathNames) || "Todo",
            id: v?.articulo?.categoria_articulo?.categoria_id || "",
        })
    }

    const onSearchTextChange = (v: string) => {
        setsearchText(v)
    }

    useEffect(() => {
        if (page === 1) {
            return
        }
        setpage(1)
    }, [selectedTableTab.name, filterSortState])

    const onSelectedFilters = (value: TableFilter[]) => {
        const filtersFormated: FilterSortState = {}
        if (!value.length) {
            setFilterSortState(undefined)
            return
        }
        value.map((v) => {
            if (v.fromHeader === "Tipo") {
                filtersFormated.tipoFilters = [v]
            }
            if (v.fromHeader === "Categoría") {
                filtersFormated.categoriaFilters = [v]
            }
            if (v.fromHeader === "Estatus") {
                filtersFormated.estatusFilters = v.filter as EstadosArticulo
            }
        })
        searchRef.current?.handleClear()
        setFilterSortState((v) => ({ ...v, ...filtersFormated }))
    }

    const formattedRows = useMemo(
        () => ArticlesToTable(articulos, selectedTableTab.name),
        [articulos, selectedTableTab]
    )

    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                title="Autorización de proceso"
                isOpen={isAuthModalOpen}
                onAuthFilled={(v) => {
                    setisAuthModalOpen(false)
                    onAuthFilled(v)
                }}
                onClose={() => setisAuthModalOpen(false)}
            />
        ),
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.recepcionista, RoleNames.cocina, RoleNames.bar],
        noNeedAuthModalRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.cocina, RoleNames.bar],
        isOpen: isAuthModalOpen,
        onClose: () => setisAuthModalOpen(false),
    })

    return (
        <Screen
            title="Recetas/Procesos"
            back
            headerRight={
                <LazySearch
                    filtersTipoArticulo={[TipoArticulo.Receta, TipoArticulo.Proceso]}
                    className="recipes-process-screen__search"
                    onChangeText={onSearchTextChange}
                    articulosList={articulosFound}
                    onClear={() => {
                        setsearchText("")
                        onSearch()
                    }}
                    onChange={onSearch}
                    ref={searchRef}
                />
            }
        >
            <TabMenu
                className="recipes-process-screen__tabs"
                tabList={tabs}
                value={selectedTableTab.name}
                showNumerOnNoItems
                onChange={(v) => {
                    if (v === TipoArticulo.Proceso || v === "Todo") {
                        return setselectedTableTab({
                            name: v,
                            id: "",
                        })
                    }
                    const cat = categoriasArticulosFormatted.find((c) => c.name === v)
                    setselectedTableTab(cat!)
                    searchRef.current?.handleClear()
                    tableRef?.current?.setFiltersFromOuterState([])
                }}
            />
            <TablePaginatorWrapper currentPage={currentPage} onChange={(p) => setpage(p)} pages={totalPages}>
                <div className={`recipes-process-screen__table-container${showGradient ? " show-gradient" : ""}`}>
                    {/* {isLoading ? (
                        <TableSkeleton headers={tableHeaders} />
                    ) : ( */}
                    <FlexibleTable
                        ref={tableRef}
                        onSort={onSort}
                        onSelectedFilters={onSelectedFilters}
                        tableItems={{
                            headers: tableHeaders,
                            rows: formattedRows,
                        }}
                        goTo={(id) => {
                            const data = articulos.find((i) => i.almacen_articulo_id === id)
                            if (data) setItemSelected(data)
                        }}
                        emptyState={{
                            titile: "Sin recetas registradas",
                            headerIcon: "roomServiceCommand",
                            subTitle:
                                "¡Aún no tienes recetas registradas en tu inventario! Comienza agregando nuevas recetas para poder gestionarlas y mantener tu stock actualizado.",
                            button: "Agregar receta",
                            onClick: validateIsColabActive(() =>
                                skip ? setisModalSelectOpen(true) : setisAuthModalOpen(true)
                            ),
                        }}
                        onHasScrollChange={setShowGradient}
                    ></FlexibleTable>
                    {/* )} */}
                </div>
            </TablePaginatorWrapper>
            <FloatButon
                icon="plus"
                className="recipes-process-screen__float-button"
                onAdd={validateIsColabActive(() => (skip ? setisModalSelectOpen(true) : setisAuthModalOpen(true)))}
            />
            {Modal}
            <SelectProcessRecipeModal
                isModalSelectOpen={isModalSelectOpen}
                setisModalSelectOpen={setisModalSelectOpen}
            />
            {itemSelected && (
                <DetalleReceta
                    resetSearch={() => searchRef.current?.handleClear()}
                    almacenArticulo={itemSelected}
                    isOpen={true}
                    onClose={() => setItemSelected(null)}
                    onConfirmChange={() => {
                        setItemSelected(null)
                        refetch({
                            almacenSelected: selectedTableTab.name,
                            page,
                        })
                    }}
                    deactivateType={TypeArticleDeactivate[itemSelected?.articulo?.tipo || ""]}
                    activateType={TypeArticleActivate[itemSelected?.articulo?.tipo || ""]}
                />
            )}
            {InactiveModal}
        </Screen>
    )
}

export default HomeRecipesProcess
