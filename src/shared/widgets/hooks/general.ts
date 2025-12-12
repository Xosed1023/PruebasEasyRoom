import { useState } from "react"
import { useProfile } from "src/shared/hooks/useProfile"
import { RoleNames } from "src/shared/hooks/useAuth"
import { client } from "src/graphql"
import { GET_TURNOS } from "src/graphql/queries/dashboard"
import { useComponentLoad } from "./effect"

type rol = RoleNames.superadmin | RoleNames.admin | RoleNames.gerente | RoleNames.recepcionista | RoleNames.valet

export const useCurrentRol = (): rol => {
    const { myProfile } = useProfile()
    const rol = myProfile?.roles?.[0]?.nombre || ""
    return (rol as rol) || RoleNames.recepcionista
}

export const useCurrentTurno = (): string => {
    const [turno, setTurno] = useState<string>("")
    const { hotel_id } = useProfile()

    useComponentLoad(() => {
        client
            .query({ query: GET_TURNOS, variables: { hotel_id: [hotel_id] } })
            .then(({ data }) => {
                const find = data?.turnos?.find(({ estado }) => estado === "abierto")

                if (find?.nombre) {
                    setTurno(`${find?.nombre}`)
                }
            })
            .catch(console.log)
    })

    return turno
}
