import { useEffect, useState } from "react"
import { UnidadMedidasArticulo, useGetAlmacenArticuloMedidasLazyQuery } from "src/gql/schema"

const useGetMedidasArticulo = (articuloId) => {
    const [getUnidadesMedidasArticulo] = useGetAlmacenArticuloMedidasLazyQuery()

    const [unidadesMedidas, setunidadesMedidas] = useState<UnidadMedidasArticulo[]>([])

    useEffect(() => {
        if (articuloId) {
            getUnidadesMedidasArticulo({
                variables: {
                    almacen_articulo_id: articuloId,
                },
            }).then((u) => {
                setunidadesMedidas(u.data?.almacen_articulo.articulo?.unidades_disponibles || [])
            })
        }
    }, [articuloId])

    return { unidadesMedidas }
}

export default useGetMedidasArticulo
