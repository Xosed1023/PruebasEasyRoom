import { useEffect, useState } from "react"
import { useCategoriaGastosConEliminadas } from "../../hooks/useCategoriaGastos"

export function useGastosList() {
    const { data: categorias } = useCategoriaGastosConEliminadas()

    const [categoriaList, setCategoriaList] = useState<any[]>([])
    const [subcategoriaList, setSubCategoriaList] = useState<any[]>([])

    useEffect(() => setCategoriaList(categorias?.categorias_gasto || []), [categorias])

    useEffect(() => {
        setSubCategoriaList(categorias?.categorias_gasto?.flatMap(c => c.subcategorias_de_categoria))
    }, [categoriaList])
    

    const handleSelectCategory = (categoriaId: string) => {
        if(!categoriaId.length) {
            setSubCategoriaList(categorias?.categorias_gasto?.flatMap(c => c.subcategorias_de_categoria))
            return    
        }
        const find = categorias?.categorias_gasto?.find((item) => item?.categoria_id === categoriaId)
        const filter = find?.subcategorias_de_categoria
            ? find?.subcategorias_de_categoria?.filter((item) => !item?.eliminado)
            : []

        setSubCategoriaList(filter.length ? filter : categorias?.categorias_gasto?.flatMap(c => c.subcategorias_de_categoria))
    }

    return {
        categorias: categorias?.categorias_gasto,
        selectedCategorias: categoriaList,
        selectedSubCategorias: subcategoriaList,
        handleSelectCategory,
    }
}
