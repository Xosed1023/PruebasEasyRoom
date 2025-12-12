import { useEffect, useState } from "react"
import { entryTypes } from "../VentaHabitacion.constants"
import { UseFormSetValue } from "react-hook-form"
import { DefaultValuesType } from "../VentaHabitacion"
import { ventaHabitacionDefaultValues } from "../helpers/genDefaultValues"

const useModalMatricula = ({
    setValue,
    tipoEntrada,
}: {
    setValue: UseFormSetValue<DefaultValuesType>
    tipoEntrada: string
}) => {
    const [isModalMatriculaOpen, setIsModalMatriculaOpen] = useState(false)
    const [isModalMatriculaOpenFromState, setIsModalMatriculaOpenFromState] = useState<"canceled" | "toEdit">("toEdit")

    useEffect(() => {
        if (tipoEntrada === entryTypes[1].value) {
            setIsModalMatriculaOpenFromState("canceled")
            return setIsModalMatriculaOpen(true)
        }
        if (tipoEntrada === entryTypes[0].value) {
            setValue("matricula", ventaHabitacionDefaultValues.matricula)
            setValue("color", ventaHabitacionDefaultValues.color)
            setValue("modelo", ventaHabitacionDefaultValues.modelo)
            setValue("marca", ventaHabitacionDefaultValues.marca)
        }
    }, [tipoEntrada])
    return {
        isModalMatriculaOpen,
        setIsModalMatriculaOpen,
        isModalMatriculaOpenFromState,
        setIsModalMatriculaOpenFromState,
    }
}

export default useModalMatricula
