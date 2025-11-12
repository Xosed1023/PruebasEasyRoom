import { ReactElement } from "react"
import { Navigate } from "react-router-dom"
import { isActiveSession, clearSession } from "src/utils/session"

function PrivateRoute({ children }: { children: ReactElement }): JSX.Element {
    if (!isActiveSession()) {
        clearSession()
        return <Navigate to={"/"} replace />
    }

    return children
}

export default PrivateRoute
