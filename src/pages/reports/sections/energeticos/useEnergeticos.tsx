import React, { useRef } from "react"
import { Button } from "src/shared/components/forms"
import Energeticos, { EnergeticosRef } from "./Energeticos"

const useEnergeticos = ({ apiDateFilter }: { apiDateFilter: string[] | null }) => {
    const energeticosRef = useRef<EnergeticosRef>(null)
    const AgregarEnergeticoButton = () => {
        return (
            <Button
                text="Agregar registro"
                theme="secondary"
                onClick={() => energeticosRef.current?.onAddEnergetico?.()}
            />
        )
    }

    const GetEnergeticos = () => {
        return <Energeticos apiDateFilter={apiDateFilter} ref={energeticosRef} />
    }
    return { AgregarEnergeticoButton, GetEnergeticos }
}

export default useEnergeticos
