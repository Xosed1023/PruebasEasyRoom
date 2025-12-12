import { useEffect, useRef, useState } from "react"
import { pagination_options } from "src/constants/pagination"
import { AlmacenArticulo, useSearchRecipesProcessLazyQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"

const useSearchRecipesProcess = ({ name }: { name: string }) => {
    const [search] = useSearchRecipesProcessLazyQuery()

    const { hotel_id } = useProfile()

    const [articulosFound, setarticulosFound] = useState<AlmacenArticulo[]>([])
    const timerRef = useRef<NodeJS.Timer>()
    const nameRef = useRef<string>()

    useEffect(() => {
        nameRef.current = name
    }, [name])

    useEffect(() => {
        clearTimeout(timerRef.current)
        if(!name) {
            return setarticulosFound([])
        }
        timerRef.current = setTimeout(() => {
            search({
                variables: {
                    hotel_id,
                    nameFilter: name,
                    pagination_options: pagination_options,
                },
            }).then((d) => {
                setarticulosFound((d.data?.almacenes_articulos.almacenes_articulos as AlmacenArticulo[]) || [])
            })
        }, 300)
    }, [name])

    return { articulosFound }
}

export default useSearchRecipesProcess
