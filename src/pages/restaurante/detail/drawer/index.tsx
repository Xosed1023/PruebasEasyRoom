import { EstadoMesa } from "src/gql/schema"
import { useMesa } from "../hooks/mesa"
import Disponible from "./disponible"
import Bloqueada from "./bloqueada"
import Servicio from "./servicio"
import Sucia from "./sucia"

function DrawerNavigator(): JSX.Element {
    const { estado } = useMesa()
    const mesa = useMesa()
    return estado === EstadoMesa.Disponible ? (
        <Disponible />
    ) : estado === EstadoMesa.Bloqueada ? (
        <Bloqueada />
    ) : estado === EstadoMesa.EnServicio ? (
        <Servicio paid={false}/>
    ) : estado === EstadoMesa.Sucia && mesa.estado_dinamico ? (
        <Servicio paid={true}/>
    ) : estado === EstadoMesa.Sucia ? (
        <Sucia />
    ) : (
        <></>
    )
}

export default DrawerNavigator
