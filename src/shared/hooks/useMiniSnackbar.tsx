import BoldedText from "../components/data-display/bolded-text/BoldedText"
import MiniSnackBar from "../components/data-display/MiniSnackbar/MiniSnackbar"
import { SnackBarProps } from "../components/data-display/SnackBar/SnackBar"
import { useDispatch, useSelector } from "react-redux"
import { toggleMiniSnackbar } from "src/store/snackbar/snackbarSlice"
import { RootState } from "src/store/store"
import ReactDOM from "react-dom/client"
import { useRef } from "react"

const snackbarMiniRoot = ReactDOM.createRoot(document.getElementById("mini-snackbar") as HTMLElement)

export interface RenderSnackbarProps extends Pick<SnackBarProps, "title" | "status"> {
    text?: string
}

const useMiniSnackbar = (timeout = 5000) => {
    const timerRef = useRef<NodeJS.Timer>()

    const dispatch = useDispatch()
    const { isMiniSnackbarOpen } = useSelector((root: RootState) => root.snackbar)

    const closeSnackbar = () => {
        if (isMiniSnackbarOpen) {
            snackbarMiniRoot?.render(<></>)
            dispatch(toggleMiniSnackbar(false))
        }
    }

    const showMiniSnackbar = ({ text = "", title, status }: RenderSnackbarProps) => {
        clearTimeout(timerRef.current)
        if (isMiniSnackbarOpen) {
            snackbarMiniRoot?.render(<></>)
            dispatch(toggleMiniSnackbar(false))
        }
        dispatch(toggleMiniSnackbar(true))
        snackbarMiniRoot.render(
            <MiniSnackBar
                title={title}
                status={status}
                onClose={() => {
                    dispatch(toggleMiniSnackbar(false))
                    snackbarMiniRoot?.render(<></>)
                }}
            >
                <BoldedText className="mini-snackbar__content__children--success">
                    {status === "error"
                        ? text || "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente."
                        : text}
                </BoldedText>
            </MiniSnackBar>
        )

        timerRef.current = setTimeout(() => {
            dispatch(toggleMiniSnackbar(false))
            snackbarMiniRoot?.render(<></>)
        }, timeout)
    }

    return {
        showMiniSnackbar,
        closeSnackbar,
    }
}

export default useMiniSnackbar
