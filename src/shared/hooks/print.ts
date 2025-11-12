import useMiniSnackbar from "./useMiniSnackbar"
import useSnackbar from "./useSnackbar"

type Snackbar = "snackbar-complete" | "snackbar-mini"
export type PrintType = "original" | "copia" | "custom"

export function usePrintTicket(snackbar: Snackbar = "snackbar-complete") {
    const completeSnackbar = useSnackbar()
    const miniSnackbar = useMiniSnackbar()

    const handlePrint = (ticketId: string, printType: PrintType = "original", customType?: string) => {
        if (ticketId) {
            const path = `print://${ticketId}_${
                printType === "custom" ? customType : printType === "original" ? 0 : 1
            }/`
            try {
                window.location.href = path
            } catch (e) {
                if (snackbar === "snackbar-complete") {
                    completeSnackbar.showSnackbar({ status: "error", title: "Error de impresión" })
                } else {
                    miniSnackbar.showMiniSnackbar({ status: "error", title: "Error de impresión" })
                }
            }
        } else {
            console.log("ticket_id no válido")
            if (snackbar === "snackbar-complete") {
                completeSnackbar.showSnackbar({ status: "error", title: "No pudimos encontrar el ticket" })
            } else {
                miniSnackbar.showMiniSnackbar({ status: "error", title: "No pudimos encontrar el ticket" })
            }
        }
    }

    return {
        handlePrint,
    }
}
