import { useEffect, useState } from "react"
import { UseFormReturn, useFormContext, useWatch } from "react-hook-form"
import { useLocation } from "react-router-dom"
import { FormValues } from "./DetalleCompra.type"
import { isVisibleCardNumber } from "src/shared/sections/payment/Payment.helpers"
import { setItems } from "../productos/Products.helpers"
import { add, sum } from "src/shared/helpers/calculator"
import { TiposPagos } from "src/gql/schema"

export const useCompra = ({ setValue, getValues, control }: UseFormReturn<FormValues, any, undefined>) => {
    const [isDirty, setDirty] = useState<boolean>(false)
    const location = useLocation()

    const products = useWatch({ control, name: "products" })

    const getProductsByCategory = (category: string) => {
        const selectedList = getValues("products")
        const products: any[] = []
        let total = 0
        for (const element of selectedList) {
            if (element.categoryId === category) {
                const extras = sum(element.extras.map((i) => i.number * i.cost))
                const precio = add(element.number * element.cost, element.number * extras)

                total += precio
                products.push(element)
            }
        }
        return {
            products,
            total,
        }
    }

    useEffect(() => {
        const params: any = location.state || {}
        const productList = params?.productList || []
        const categoryList = params?.categoryList || []
        const total = params?.total || 0

        if (Object.values(params).length > 0) {
            setValue("products", productList)
            setValue("categoryList", categoryList)
            setValue("costs", {
                general: total,
                total,
                payment: 0,
            })
        }
    }, [])

    useEffect(() => {
        const values = getValues()
        const { categoryList, extra, paymentMethod, paymentType } = values
        const list = categoryList
            .map((category) => {
                const { products, total } = getProductsByCategory(category.categoria_id)
                return {
                    ...category,
                    products,
                    total,
                }
            })
            .filter(({ products }) => products.length > 0)

        if (JSON.stringify(list) !== JSON.stringify(location.state?.categoryList) || isDirty) {
            
            const total = list.reduce((acum, current) => acum + current.total, 0)
            setValue("categoryList", list)
            setValue("costs", {
                general: total,
                total,
                payment: total,
            })

            if (paymentType && (paymentType === "pendiente" || paymentMethod) && extra.length > 0) {
                setValue("extra", [
                    {
                        number: isVisibleCardNumber(paymentMethod) ? "" : values.extra?.[0]?.number || "",
                        amount: total,
                        type: paymentMethod as TiposPagos,
                    },
                ])
            }
            setDirty(true)
        }

        setItems(products)
    }, [products])

    return {
        orden: location.state?.orden || "",
    }
}

export const useCompraMethods = () => {
    const { getValues, setValue } = useFormContext<FormValues>()

    const getTotal = (): number => {
        const values = getValues("categoryList")
        return values.reduce((acum, current) => acum + current.total, 0) || 0
    }

    const appenedCost = () => {
        const total = getTotal()
        setValue("costs", {
            total,
            general: total,
            payment: total,
        })
    }

    const appenedPayment = () => {
        const values = getValues()
        const total = getTotal()

        setValue("extra", [
            {
                number: "",
                amount: total,
                type: values.paymentMethod as TiposPagos,
            },
        ])
        setValue("extraAbonar", [
            {
                number: "",
            },
        ])
    }

    const clearPayments = () => {
        const extra = getValues("extra")

        if (extra.length > 0) {
            setValue("extra", [])
        }
    }

    return {
        appenedPayment,
        clearPayments,
        appenedCost,
    }
}

export const useCompraContext = () => {
    const location = useLocation()
    return {
        fromRoomDetail: !!location.state?.fromRoomDetail,
        room: location.state?.room,
        selectedRoom: location.state?.selectedRoom,
        mesa: location.state?.mesa,
        fromRestaurant: !!location.state?.fromRestaurant,
        total: Number(location.state?.total || 0),
    }
}
