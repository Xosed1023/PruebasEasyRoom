import { useState, useMemo, useEffect } from "react"
import { Product, Category, CategoryItem, ProductItem } from "../Products.type"
import { getTax } from "src/shared/sections/payment/Payment.helpers"
import { getSaveItems } from "../Products.helpers"
import { add, sum } from "src/shared/helpers/calculator"

type useSelectedProductsArgs = {
    defaultProducts?: Product[]
    onChange?: (value: Product[]) => void
}

export function useSelectedProducts({ defaultProducts = undefined, onChange }: useSelectedProductsArgs) {
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedList, setSelected] = useState<Product[]>([])

    useEffect(() => {
        const list = getSaveItems()
        if (defaultProducts) setSelected(defaultProducts)
        else if (list.length > 0) setSelected(list)
    }, [defaultProducts])

    useEffect(() => {
        if (onChange && JSON.stringify(defaultProducts) !== JSON.stringify(selectedList)) onChange(selectedList)
    }, [selectedList])

    const appenedProduct = (payload: Product) => {
        if (selectedList.length > 0) {
            const findProduct = selectedList.find((item) => item.id === payload.id)
            if (findProduct && !findProduct?.unique) {
                setSelected(
                    selectedList.map((item) => {
                        const element = {
                            ...item,
                            number: payload.number,
                        }
                        return item.id === payload.id ? element : item
                    })
                )
            } else {
                const item =
                    payload.unique
                        ? { ...payload, id: `${payload.id}__${getSelectedValue(payload.id) + 1}`, number: 1 }
                        : payload
                setSelected([...selectedList, item])
            }
        } else {
            setSelected([payload])
        }
    }

    const appenedExtras = (payload: ProductItem[],  selection_id: string) => {
        const findProduct = selectedList.find(({ selection_id }) => selection_id === selection_id)
        if (findProduct) {
            setSelected(
                selectedList.map((item) => {
                    const element = {
                        ...item,
                        extras: payload,
                    }
                    return item.selection_id === selection_id ? element : item
                })
            )
        }
    }

    const getProductsByCategory = (category: string[]) => {
        const products: Product[] = []
        let total = 0
        let totalIva = 0
        for (let index = 0; index < selectedList.length; index++) {
            if (category.some(c => c === selectedList[index].categoryId)) {
                const element = selectedList[index]
                const extras = sum(element.extras.map((i) => i.number * i.cost))
                const extrasIVA = sum(element.extras.map((i) => getTax(i.number * i.cost)))

                const base = element.number * element.cost
                const baseExtras = element.number * extras

                const precio = add(base, baseExtras)

                total += precio
                totalIva += add(getTax(base), extrasIVA * element.number)
                products.push(element)
            }
        }
        return {
            products,
            total,
            totalIva,
        }
    }

    const remove = (productId: string) => {
        const productIds = selectedList?.filter(({ id = "" }) => id.includes(productId)) || []
        const productRemoveId = productIds?.[productIds.length - 1]?.id || ""

        const list = selectedList.filter(({ id = "" }) => id !== productRemoveId)
        setSelected([...list])
    }

    const appenedComment = (productId: string, comment: string) => {
        const list = selectedList.map((item) => {
            if (item.id === productId) {
                return {
                    ...item,
                    comment,
                }
            } else {
                return item
            }
        })
        setSelected([...list])
    }

    const getSelectedValue = (productId: string) => {
        let value = 0
        const clear = (text: string) => text?.split("__")?.at(0)

        selectedList.forEach((i) => {
            if (clear(i.id) === clear(productId)) value += Number(i.number || 0)
        })

        return value
    }

    const reset = () => setSelected([])

    const categoryList = useMemo(() => {
        const list: CategoryItem[] = []
        for (let index = 0; index < categories.length; index++) {
            const item = categories[index]
            const { products, total, totalIva } = getProductsByCategory([item.categoria_id])
            if (products.length > 0) {
                list.push({
                    ...item,
                    products,
                    total,
                    totalIva,
                })
            }
        }
        return list
    }, [selectedList, categories])

    const total = useMemo(() => {
        return categoryList.reduce((acum, current) => acum + current.total, 0)
    }, [categoryList])

    return {
        categoryList,
        selectedList,
        total,
        appenedCategories: setCategories,
        appenedComment,
        appenedProduct,
        appenedExtras,
        getSelectedValue,
        remove,
        reset,
    }
}
