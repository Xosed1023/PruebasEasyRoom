import { ReactElement } from "react"
import { Navigate } from "react-router"
import { isActiveSession, onClearSession } from "src/utils/session"
import { useAppUrlListener } from "@/hooks/app-listener/useAppUrlListener"

function PrivateRoute({ children }: { children: ReactElement }) {
    //Hook para abrir links externos a la app
    useAppUrlListener()

    if (!isActiveSession()) {
        onClearSession()
        return <Navigate to={"/"} replace />
    }

    return children
}

export default PrivateRoute
