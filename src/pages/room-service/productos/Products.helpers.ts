export const getIcon = (key: string): string => {
    const collection = {
        Alimentos: "Cutlery",
        Bebidas: "cupFill",
        Farmacia: "giftFill",
        Abarrotes: "giftFill",
        Paquetes: "giftFill",
        Sex_spa: "heart",
        Varios: "giftFill",
        defaultIcon: "giftFill",
    }
    return collection[key] || collection.defaultIcon
}

export const getEmptyMessage = (key: string): string => {
    const collection = {
        alimentos: "No hay alimentos disponibles",
        bebidas: "No hay bebidas disponibles",
        farmacia: "No hay productos de farmacia disponibles",
        abarrotes: "No hay productos de abarrotes disponibles",
        paquetes: "No hay paquetes disponibles",
        sex_spa: "No hay productos de sex & spa disponibles",
        varios: "No hay productos disponibles",
        defaultMessage: "No hay productos disponibles",
    }
    return collection[key] || collection.defaultMessage
}

export const getSortCategories = (categories: any[]) => {
    const keys = ["alimentos", "bebidas", "sex_spa", "varios"]
    const array = keys.map((key) => {
        return categories.find(({ icono = "" }) => icono === key)
    })

    const clear = categories.filter(({ icono = "" }) => {
        return !keys.includes(icono)
    })

    return [...array, ...clear].filter((item) => !!item)
}

export const getSaveItems = (): any[] => {
    const data = sessionStorage.getItem("@selected_products")
    const collection: any[] = data ? JSON.parse(data) : []
    return collection
}

export const setItems = (items: any[]) => {
    const clear = items?.filter((i) => i?.number > 0); 
    sessionStorage.setItem("@selected_products", JSON.stringify([...clear]));
};