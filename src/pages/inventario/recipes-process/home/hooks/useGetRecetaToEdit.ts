import { useEffect, useState } from "react"
import { Receta, useGetRecetaToEditLazyQuery } from "src/gql/schema"

const useGetRecetaToEdit = (articulo_id) => {
    const [getReceta] = useGetRecetaToEditLazyQuery()

    const [receta, setreceta] = useState<Receta>()

    useEffect(() => {
        if (articulo_id) {
            getReceta({ variables: { articulo_id } }).then((res) => setreceta(res.data?.receta as Receta))
        }
    }, [articulo_id])

    return { receta }
}

export default useGetRecetaToEdit
