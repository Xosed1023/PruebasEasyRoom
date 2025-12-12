import { useState, useEffect } from "react"
import { ProductItem } from "src/pages/room-service/productos/Products.type"
import Empty from "src/shared/components/data-display/empty/Empty"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { Button } from "src/shared/components/forms/button/Button"
import Counter from "src/shared/components/forms/counter/Counter"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { getCurrencyFormat } from "src/utils/string"
import { useSelectedExtras } from "./hooks"
import "./ModalExtras.css"
import useInfiniteScroll from "src/shared/hooks/useInfiniteScroll"
import useGetProducts from "./hooks/useGetProducts"
import LazySearch from "../LazySearch/LazySearch"

export type ProductItemModalExtras = {
    id: string
    name: string
    cost: number
    price: number
    number: number
    comment?: string
    categoryId: string
    category: string
    extra_detalle_orden_id: string | null
    almacen_articulo_id: string
}

export interface Product extends ProductItem {
    type: string
    extra?: boolean
    extras: ProductItemModalExtras[]
}

export type ModalExtrasProps = {
    isOpen: boolean
    product: Product
    value?: ProductItemModalExtras[]
    onChange: (param: ProductItemModalExtras[]) => void
    onClose: () => void
}

function ModalExtras({ isOpen, product, onChange, onClose }: ModalExtrasProps): JSX.Element {
    const [category, setCategory] = useState<string>("todas")

    const [page, setPage] = useState(1)
    const { products, categories } = useGetProducts({ page, categorySelected: category })

    useEffect(() => {
        setPage(1)
    }, [category])

    useEffect(() => {
        if(!products.length) {
            return
        }
        setData(products)
    }, [products])
    

    const setScrollRef = useInfiniteScroll(() => setPage((p) => p + 1))

    const [search, setSearch] = useState<string>("")
    const [data, setData] = useState<any[]>([])

    const editMode = product?.extras?.length > 0

    const { appenedProduct, getSelectedValue, remove, reset, selectedList } = useSelectedExtras()

    const { showSnackbar } = useSnackbar()

    useEffect(() => {
        reset(product?.extras || [])
    }, [product])

    const onSubmit = () => {
        const countLabel = selectedList.length > 1 ? "s" : ""
        const extraLabel = `Extra${countLabel}`
        showSnackbar({
            title: !editMode ? `${extraLabel} agregado${countLabel}` : "Extras actualizados",
            text: !editMode
                ? `Se agrego **${selectedList.length} ${extraLabel}** a la orden de **${product.name} exitosamente.**`
                : `Se actualizaron los extras de **${product?.name}**.`,
            status: "success",
        })
        onChange(selectedList)
        setData(products)
        setCategory("todas")
        onClose()
    }

    return (
        <Modal
            className="modal-extras"
            title="Extras"
            isOpen={isOpen}
            width={780}
            height={"75vh"}
            maxHeight={570}
            withCloseButton
            onClose={() => {
                setCategory("todas")
                setData(products)
                onClose()
            }}
        >
            <div className="modal-extras__head">
                <p className="modal-extras__title">{"Extras"}</p>
                <span className="modal-extras__subtitle">{"Agrega los extras a la orden"}</span>
            </div>
            <div className="modal-extras__form">
                <LazySearch
                    categoryDescription={true}
                    filterOnlyName={true}
                    placeholder={"Busca por nombre de artículo"}
                    onChange={(value) => {
                        setData(value ? [value] : [])
                    }}
                    onClear={() => {
                        setSearch("")
                        setData(products)
                        if (category !== "todas") setCategory("todas")
                    }}
                />
                <Dropdown
                    containerClassName="modal-extras__drop"
                    label=""
                    placeholder={"Selecciona una opción"}
                    value={category}
                    options={[
                        { label: "Todas", value: "todas" },
                        ...(categories?.map((i) => {
                            return {
                                value: i?.categoria_id,
                                label: i?.nombre,
                            }
                        }) || []),
                    ]}
                    iconInOptions={false}
                    onClick={({ value }) => {
                        setCategory(value)
                        const filter =
                            value !== "todas" ? products.filter((i) => i?.articulo?.categoria_id === value) : products

                        setData([...filter])
                    }}
                />
            </div>
            {data.length > 0 ? (
                <div className="modal-extras__content" ref={setScrollRef}>
                    {data.map((i, index) => {
                        const name = i?.articulo?.nombre
                        const categoryLabel = i?.articulo?.categoria_articulo?.nombre || ""
                        const value = getSelectedValue(i?.almacen_articulo_id)

                        return (
                            <div
                                key={index}
                                className={`modal-extras__item${value ? " modal-extras__item--active" : ""}`}
                            >
                                <div className="modal-extras__item-base">
                                    <p className="modal-extras__item-title">
                                        {`${i?.articulo?.descripcion || ""} - `}{" "}
                                        <span>{getCurrencyFormat(i?.precio || 0)}</span>
                                    </p>
                                    <span className="modal-extras__item-subtitle">{categoryLabel}</span>
                                </div>
                                <Counter
                                    className="product-card__counter"
                                    disable={false}
                                    min={0}
                                    value={value}
                                    onClick={(number) => {
                                        if (number > 0) {
                                            appenedProduct({
                                                id: i?.almacen_articulo_id,
                                                name: name,
                                                cost: i?.costo,
                                                number,
                                                price: i.precio || 0,
                                                categoryId: i?.articulo?.categoria_id,
                                                category: categoryLabel,
                                                almacen_articulo_id: i.almacen_articulo_id,
                                                extra_detalle_orden_id: i.extra_detalle_orden_id || null,
                                            })
                                        } else {
                                            remove(i?.almacen_articulo_id)
                                        }
                                    }}
                                />
                            </div>
                        )
                    })}
                </div>
            ) : (
                <Empty
                    className="modal-extras__empty"
                    title="Sin resultados"
                    description={`No hay resultados${search ? ` para **'${search}'**` : ""}.\nIntenta de nuevo.`}
                    icon="searchLg"
                />
            )}
            <Button
                disabled={!editMode ? selectedList.length <= 0 : false}
                className="modal-extras__button"
                text={`${!editMode ? "Agregar" : "Actualizar"} extras`}
                onClick={onSubmit}
            />
        </Modal>
    )
}

export default ModalExtras
