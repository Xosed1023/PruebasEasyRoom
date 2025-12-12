import { ListView } from "../../../sections/views/Views"
import CardStaff from "src/shared/components/data-display/card-staff/CardStaff"
import { Block, PrimaryButton } from "../../../sections/elements/Elements"
import { useColaborador } from "../../../hooks/colaborador"
import { SectionProps } from "../index.type"
import { Puestos } from "src/constants/puestos"
import { useState } from "react"

const CleanStaff = ({ onNavigate }: SectionProps) => {
    const { data: camaristas } = useColaborador([Puestos.RECAMARISTA, Puestos.SUPERVISOR])
    const camaristasUnique = Array.from(new Map(camaristas.map(c => [c.colaborador_id, c])).values())

    const [colaboradoresSelected, setColaboradoresSelected] = useState<{ nombre: string; colaborador_id: string, puesto: string, puesto_id: string }[]>([])

    const confirmSelection = () => {
        onNavigate("clean-tyoe", { colaboradores: colaboradoresSelected })
    }
    const allColaboradores = [
        ...(camaristasUnique || []),
    ]
    return (
        <ListView
            title="Asigna tu personal para limpieza"
            subtitle="Camaristas disponibles"
            titleStyle={{ width: "80%" }}
            subtitleStyle={{ fontWeight: 400 }}
        >
            <Block list scroll className="detalle-h-venta__clean-staff__block">
                {allColaboradores?.map(
                    (
                        {
                            nombre = "",
                            apellido_materno = "",
                            apellido_paterno = "",
                            colaborador_id = "",
                            ultima_habitacion = "",
                            tiempo_disponible = "",
                            puesto = "",
                            puesto_id = "",
                            foto = "",
                        },
                        index
                    ) => {
                        return (
                            <CardStaff
                                key={index}
                                name={nombre}
                                disabled={
                                    colaboradoresSelected.length >= 4 &&
                                    !colaboradoresSelected.some((c) => c.colaborador_id === colaborador_id)
                                }
                                description={`Disponible desde hace: ${tiempo_disponible}`}
                                text={`Última habitación asignada: ${ultima_habitacion}`}
                                picture={foto}
                                active={colaboradoresSelected.some((c) => c.colaborador_id === colaborador_id)}
                                onClick={() => {
                                    if (colaboradoresSelected.find((c) => c.colaborador_id === colaborador_id)) {
                                        setColaboradoresSelected((colabs) =>
                                            colabs.filter((c) => c.colaborador_id !== colaborador_id)
                                        )
                                        return
                                    }
                                    if (colaboradoresSelected.length >= 4) {
                                        return
                                    }
                                    const colaborador = {
                                        nombre: `${nombre} ${apellido_materno} ${apellido_paterno}`,
                                        colaborador_id: colaborador_id || "",
                                        puesto: puesto || "",
                                        puesto_id: puesto_id || ""
                                    }
                                    setColaboradoresSelected((c) => [...c, colaborador])
                                }}
                            />
                        )
                    }
                )}
            </Block>
            <PrimaryButton text="Asignar a limpieza" onClick={() => confirmSelection()} disabled={!colaboradoresSelected.length} />
        </ListView>
    )
}

export default CleanStaff