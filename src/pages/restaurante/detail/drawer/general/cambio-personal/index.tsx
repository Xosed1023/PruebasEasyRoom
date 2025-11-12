import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { useMesa } from "src/pages/restaurante/detail/hooks/mesa"
import { useActualizarMesaAsignadaMutation } from "src/gql/schema"
import { Block, PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import CardStaff from "src/shared/components/data-display/card-staff/CardStaff"
import { useState } from "react"
import { EmptyColaborador } from "src/pages/home/room-detail/drawer/general/sections/Empty"
import { useRestaurantDarwer } from "../../../hooks/drawer"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useGetRestaurantColaboradores } from "../../disponible/sections/Personal/index.hooks"

function CambioPersonal(): JSX.Element {
    const { nombre } = useMesa()
    const mesa = useMesa()
    const [colaborador, setColaborador] = useState<string>("")

    const { data, load } = useGetRestaurantColaboradores()

    const [actualizarMesaAsignada] = useActualizarMesaAsignadaMutation()

    const { onClose } = useRestaurantDarwer()
    const { showSnackbar } = useSnackbar()

    const onSubmit = () => {
        if (!colaborador) return

        actualizarMesaAsignada({
            variables: { input: { mesa_asignada_id: mesa?.asignacion_actual?.mesa_asignada_id, colaborador_asignado_id: colaborador } },
        })
            .then(() => {
                showSnackbar({
                    title: "Cambio de personal",
                    text: `**${nombre}** está en servicio. Ya puedes empezar a tomar las órdenes.`,
                    status: "success",
                })
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al cambiar de personal",
                    status: "error",
                })
            })
            .finally(() => onClose())
    }

    return (
        <section className="detalle-m__c-a">
            <p className="detalle-m__c-a__title">{"Cambio de personal"}</p>
            <div className="detalle-m__c-a__labels">
                <DescriptionDetail icon={"Table"} label={"Área actual"} value={nombre} />
            </div>
            <div className="detalle-m__c-a__head">
                <span>{"Personal disponible"}</span>
            </div>
            {!load ? (
                data && data?.length > 0 ? (
                    <>
                        <Block
                            list
                            scroll
                            className="detalle-h-general__clean-staff__block animante__opacity-transform__ease"
                            style={{ height: "calc(100% - 230px)" }}
                        >
                            {data?.map(({ colaborador_id = "", nombre = "", foto = "", mesa = "" }, index) => {
                                return (
                                    <CardStaff
                                        key={index}
                                        name={nombre}
                                        disabled={false}
                                        description={""}
                                        text={`Última mesa asignada: **${mesa || "Ninguna"}**`}
                                        picture={foto || require("src/assets/webp/profile_default.webp")}
                                        active={colaborador === colaborador_id}
                                        onClick={() => {
                                            if (colaborador) {
                                                return
                                            }
                                            setColaborador(colaborador_id)
                                        }}
                                    />
                                )
                            })}
                        </Block>
                        <PrimaryButton text="Asignar" onClick={onSubmit} disabled={!colaborador} />
                    </>
                ) : (
                    <EmptyColaborador
                        className="detalle-m__disponible-personal__contain"
                        title="Sin personal disponible"
                    />
                )
            ) : null}
        </section>
    )
}

export default CambioPersonal
