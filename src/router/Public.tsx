import { ReactElement } from "react"
import { Navigate } from "react-router-dom"
import { isActiveSession } from "src/utils/session"

function PublicRoute({ children }: { children: ReactElement }): JSX.Element {
    return !isActiveSession() ? children : <Navigate to={"/u"} replace />
}

export default PublicRoute
