import { useEffect, useState } from "react"
import Screen from "src/shared/components/layout/screen/Screen"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import "./index.css"
import { useMesa } from "../../../hooks/mesa"
import CerrarCuentaContent from "./Content/CerrarCuentaContent"
import { useCerrarCuentaMesaAsignadaMutation } from "src/gql/schema"
import { useNavigate } from "react-router-dom"
import { usePrintTicket } from "src/shared/hooks/print"

function CerrarCuenta(): JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const mesa = useMesa()
    const [cerrarCuenta] = useCerrarCuentaMesaAsignadaMutation()
    const navigate = useNavigate()
    const { handlePrint } = usePrintTicket("snackbar-mini")
    const [showModule, setshowModule] = useState(false)

    useEffect(() => {
        cerrarCuenta({
            variables: {
                cerrarCuentaMesaAsignadaInput: {
                    mesa_asignada_id: mesa?.asignacion_actual?.mesa_asignada_id,
                },
            },
        })
            .then(() => {
                handlePrint(mesa?.asignacion_actual?.orden_id, "custom", "3")
                setshowModule(true)
            })
            .catch((e) => {
                console.log("error, ", e)
                navigate(-1)
            })
    }, [])

    return (
        <>
            {showModule ? (
                <Screen
                    title={"Pago de cuenta - " + mesa.nombre}
                    className="detalle-compra"
                    contentClassName={"detalle-compra__content"}
                    close={true}
                >
                    <CerrarCuentaContent loader={(value) => setIsLoading(value)} />
                    <LoaderComponent visible={isLoading} />
                </Screen>
            ) : (
                <LoaderComponent />
            )}
        </>
    )
}

export default CerrarCuenta
