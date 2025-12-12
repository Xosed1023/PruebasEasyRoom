import { useState } from "react"
import { ProductItemModalExtras } from ".."

export function useSelectedExtras() {
    const [selectedList, setSelected] = useState<ProductItemModalExtras[]>([])

    const appenedProduct = (payload: ProductItemModalExtras) => {
        if (selectedList.length > 0) {
            const findProduct = selectedList.find((item) => item.id === payload.id)
            if (findProduct) {
                setSelected(
                    selectedList.map((item) => {
                        const element = {
                            ...payload,
                            comment: item?.comment || "",
                        }
                        return item.id === payload.id ? element : item
                    })
                )
            } else {
                setSelected([...selectedList, payload])
            }
        } else {
            setSelected([payload])
        }
    }

    const remove = (productId: string) => {
        const list = selectedList.filter(({ id }) => id !== productId)
        setSelected([...list])
    }

    const getSelectedValue = (productId: string) => {
        return selectedList.find(({ id }) => id === productId)?.number || 0
    }

    const reset = (value: ProductItemModalExtras[]) => setSelected(value)

    return {
        selectedList,
        appenedProduct,
        getSelectedValue,
        remove,
        reset,
    }
}
