import { ReactElement } from "react"
import { Navigate } from "react-router"
import { isActiveSession } from "src/utils/session"
import { useAppUrlListener } from "@/hooks/app-listener/useAppUrlListener"
import { useProfile } from "@/hooks/store/useProfile"

function PublicRoute({ children }: { children: ReactElement }) {
    const { hotel_id, usuario } = useProfile()
    const hoteles = usuario?.hotel || []

    //Hook para abrir links externos a la app
    useAppUrlListener()

    return !isActiveSession() ? children 
        : hoteles.length === 1
            ? <Navigate to={`/u/home/${hotel_id}`} replace />
            : <Navigate to="/u/hotels" replace />

}

export default PublicRoute
