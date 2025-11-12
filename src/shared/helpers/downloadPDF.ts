import axios from "axios"
import { REACT_APP_REST_API } from "src/config/environment"
import {v4 as uuid} from 'uuid'

const downloadPDF = ({ endpoint, params, title }: { endpoint: string; params: unknown, title?: string }) => {
    return axios
        .get(REACT_APP_REST_API + endpoint, {
            responseType: "blob",
            headers: {
                "Content-Type": "application/pdf",
            },
            params,
        })
        .then((res) => {
            const blob = new Blob([res.data], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)

            const link = document.createElement("a")
            link.href = url
            link.download = `${title || uuid}.pdf`
            link.click()

            URL.revokeObjectURL(url)
        })
}

export default downloadPDF
