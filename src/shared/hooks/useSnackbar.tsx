import { useRef } from "react"
import BoldedText from "../components/data-display/bolded-text/BoldedText"
import SnackBar, { SnackBarProps } from "../components/data-display/SnackBar/SnackBar"
import ReactDOM from "react-dom/client"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { toggleSnackbar } from "src/store/snackbar/snackbarSlice"

export interface RenderSnackbarProps extends Pick<SnackBarProps, "title" | "status"> {
    text?: string
}
const snackbarRoot = ReactDOM.createRoot(document.getElementById("snackbar") as HTMLElement)

const useSnackbar = (timeout = 5000, style = {}) => {
    const { isSnackbarOpen } = useSelector((root: RootState) => root.snackbar)
    const dispatch = useDispatch()
    const timerRef = useRef<NodeJS.Timer>()

    const closeSnackbar = () => {
        if (isSnackbarOpen) {
            snackbarRoot?.render(<></>)
            dispatch(toggleSnackbar(false))
        }
    }

    const showSnackbar = ({ text = "", title, status }: RenderSnackbarProps) => {
        clearTimeout(timerRef.current)
        if (isSnackbarOpen) {
            snackbarRoot?.render(<></>)
            dispatch(toggleSnackbar(false))
        }
        dispatch(toggleSnackbar(true))
        snackbarRoot.render(
            <SnackBar
                title={title}
                status={status}
                onClose={() => {
                    if (snackbarRoot) {
                        snackbarRoot?.render(<></>)
                    }
                }}
                style={style}
            >
                <BoldedText className="snackbar__content__children--success" style={{ overflowX: "hidden", maxWidth: 1000, whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {status === "error"
                        ? text || "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente."
                        : text}
                </BoldedText>
            </SnackBar>
        )

        timerRef.current = setTimeout(() => {
            snackbarRoot?.render(<></>)
            dispatch(toggleSnackbar(false))
        }, timeout)
    }
    return {
        showSnackbar, closeSnackbar
    }
}

export default useSnackbar
