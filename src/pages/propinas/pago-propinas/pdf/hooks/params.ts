import { useParams } from "react-router-dom"

export function usePDFParams() {
    const params = useParams()
    const date = params?.date || ""
    const paths: string[] = date?.split("&")

    return {
        fecha_inicio: paths[0],
        fecha_fin: paths?.[1] || null,
    }
}
