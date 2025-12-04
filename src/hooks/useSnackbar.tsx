import { useRef } from "react"
import ReactDOM from "react-dom/client"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { toggleSnackbar } from "@/store/snackbar/snackbarSlice"
import { BaseProps } from "components/core/data-display/snack-bar/Snackbar.type"
import Snackbar from "components/core/data-display/snack-bar/Snackbar"

const snackbarRoot = ReactDOM.createRoot(document.getElementById("snackbar") as HTMLElement)

const useSnackbar = (timeout = 5000, style = {}) => {
    const { isSnackbarOpen } = useSelector((root: RootState) => root.snackbar)
    const dispatch = useDispatch()
    const timerRef = useRef<any>(null)

    const onClose = () => {
        snackbarRoot?.render(<></>)
        dispatch(toggleSnackbar(false))
    }

    const closeSnackbar = () => {
        if (isSnackbarOpen) onClose()
    }

    const showSnackbar = ({ text = "", title, status, image, close }: BaseProps) => {
        clearTimeout(timerRef.current)
        if (isSnackbarOpen) onClose()

        dispatch(toggleSnackbar(true))
        snackbarRoot.render(
            <Snackbar
                title={title}
                status={status}
                onClose={() => {
                    if (snackbarRoot) onClose()
                }}
                text={
                    status === "error"
                        ? text || "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente."
                        : text
                }
                image={image}
                style={style}
                containerStyle={{
                    width: "calc(100% - 70px)",
                    position: "fixed",
                    top: 20,
                    left: 35,
                    right: 35,
                    zIndex: 99,
                }}
                close={close}
            />
        )

        timerRef.current = setTimeout(onClose, timeout)
    }
    return {
        showSnackbar,
        closeSnackbar,
    }
}

export default useSnackbar
