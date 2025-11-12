import { useMemo } from "react"
import { CategoriaArticulo, useCategoriasArticulosQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"

const useGetCategoriasAlimentosBebidas = () => {
    const { hotel_id } = useProfile()

    const { data: categoriasArticulos } = useCategoriasArticulosQuery({
        variables: { hotel_id },
    })

    const cats = useMemo(() => categoriasArticulos?.categorias_articulos.filter(
        (cat) => cat.nombre === "Alimentos" || cat.nombre === "Bebidas"
    ) as CategoriaArticulo[] || [], [categoriasArticulos])

    return {
        categoriasArticulos: cats,
    }
}

export default useGetCategoriasAlimentosBebidas
