import { useState } from "react"
import downloadPDF from "../helpers/downloadPDF"

const useDownloadPdf = () => {
    const [isLoading, setisLoading] = useState(false)

    const download = ({ endpoint, params, title }: { endpoint: string; params: unknown, title?: string }) => {
        if (isLoading) {
            return
        }
        setisLoading(true)
        downloadPDF({ endpoint, params, title }).finally(() => setisLoading(false))
    }

    return { download }
}

export default useDownloadPdf
