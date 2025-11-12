import { ListView } from "../../../sections/views/Views"
import CardStaff from "src/shared/components/data-display/card-staff/CardStaff"
import { Block, PrimaryButton } from "../../../sections/elements/Elements"
import { useColaborador } from "../../../hooks/colaborador"
import { SectionProps } from "../index.type"
import { v4 as uuid } from "uuid"
import { Puestos } from "src/constants/puestos"
import { EmptyColaborador } from "./Empty"
import profileDefault from "src/assets/webp/profile_default.webp"

import "./CleanStaff.css"
import { useState } from "react"

const CleanStaff = (onNavigate: SectionProps) => {
    const { data: camaristas, load: loadingCamaristas } = useColaborador([Puestos.RECAMARISTA, Puestos.SUPERVISOR])
    const camaristasUnique = Array.from(new Map(camaristas.map(c => [c.colaborador_id, c])).values())

    const [colaboradoresSelected, setColaboradoresSelected] = useState<{ nombre: string; colaborador_id: string }[]>([])

    const confirmSelection = () => {
        onNavigate.onNavigate?.("clean-tyoe", { colaboradores: colaboradoresSelected })
        onNavigate?.onConfirmItem?.({ state: "tipoLimpieza", colaboradores: colaboradoresSelected })
    }

    const allColaboradores = [
        ...(camaristasUnique || []).map((colaborador) => ({ ...colaborador, role: "Camarista" })),
    ]

    return (
        <ListView
            title="Asigna tu personal para limpieza"
            subtitle="Camaristas disponibles"
            titleStyle={{ width: "80%" }}
            subtitleStyle={{ fontWeight: 400 }}
        >
            {!loadingCamaristas ? (
                allColaboradores.length > 0 ? (
                    <>
                        <Block
                            list
                            scroll
                            className="detalle-h-general__clean-staff__block animante__opacity-transform__ease"
                        >
                            {allColaboradores?.map(

                                (
                                    {
                                        nombre = "",
                                        apellido_materno = "",
                                        apellido_paterno = "",
                                        colaborador_id = "",
                                        ultima_habitacion = "",
                                        tiempo_disponible = "",
                                        foto = "",
                                    },
                                    index
                                ) => {
                                    return (
                                        <CardStaff
                                            key={uuid()}
                                            name={nombre}
                                            disabled={
                                                colaboradoresSelected.length >= 4 && !colaboradoresSelected.some((c) => c.colaborador_id === colaborador_id)
                                            }
                                            description={`Disponible desde hace: **${tiempo_disponible ?? "-"}**`}
                                            text={`Última habitación asignada: **${ultima_habitacion ?? "-"}**`}
                                            picture={foto || profileDefault}
                                            active={
                                                colaboradoresSelected.some(
                                                    (c) => c.colaborador_id === colaborador_id
                                                )
                                            }
                                            onClick={() => {
                                                if (
                                                    colaboradoresSelected.find(
                                                        (c) => c.colaborador_id === colaborador_id
                                                    )
                                                ) {
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
                                                    colaborador_id,
                                                }
                                                setColaboradoresSelected((c) => [...c, colaborador])
                                            }}
                                        />
                                    )
                                }
                            )}
                        </Block>
                        <PrimaryButton text="Asignar a limpieza" onClick={() => confirmSelection()} disabled={!colaboradoresSelected.length} />
                    </>
                ) : (
                    <EmptyColaborador
                        title="Sin personal de limpieza disponible"
                        className="detalle-h-general__mantenance__box"
                    />
                )
            ) : null}
        </ListView>
    )
}

export default CleanStaff