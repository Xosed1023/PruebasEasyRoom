import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import { Modal, ModalProps } from "src/shared/components/layout/modal/Modal"
import Icon from "src/shared/icons"
import "./AlertaListaEspera.css"
import { Button } from "src/shared/components/forms"
import { Controller, useForm } from "react-hook-form"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { useProfile } from "src/shared/hooks/useProfile"
import { useGetModalTurnosAtencionQuery } from "src/gql/schema"
import { useEffect } from "react"

type FormValues = {
    folio_turno_id: string
}

interface AlertaListaEsperaProps extends ModalProps {
    habitacionID?: string
    onConfirm?: (folio_turno_id?: string, autorizacionRequerida?: boolean) => void
}

const AlertaListaEspera = ({ isOpen, onClose, onConfirm, habitacionID }: AlertaListaEsperaProps) => {
    const { hotel_id } = useProfile()
    const { data } = useGetModalTurnosAtencionQuery({
        variables: {
            hotel_id,
            tipo_habitacion_id: [habitacionID || ""],
        },
    })
    const folioTurno = data?.turnos_atencion[0]?.folio_turno || "Sin turno"
    const folioTurnoId = data?.turnos_atencion[0]?.turno_atencion_id || "Sin turno"

    const { control, setValue } = useForm<FormValues>({
        defaultValues: {
            folio_turno_id: folioTurnoId,
        },
    })

    const options = [
        { value: "Sin turno", label: "Sin turno" },
        ...(data?.turnos_atencion
            ?.filter((i) => i.folio_turno)
            .map((i) => ({
                value: i.turno_atencion_id || "",
                label: i.folio_turno || "",
            })) || []),
    ]

    useEffect(() => {
        if (data?.turnos_atencion?.length) {
            setValue("folio_turno_id", folioTurnoId)
        } else {
            setValue("folio_turno_id", "Sin turno")
        }
    }, [data, setValue, folioTurnoId])

    return (
        <Modal
            height={304}
            width={572}
            withCloseButton
            isOpen={isOpen}
            isCancelableOnClickOutside={true}
            onClose={() => {
                onClose?.()
            }}
        >
            <div className="modal-alert">
                <div className="modal-alert__header">
                    <IconBorder
                        terciaryBgColor={"#ECFDF3"}
                        terciaryBgDiameter={60}
                        secondaryBgColor={"#DBF6D4"}
                        secondaryBgDiameter={40}
                        primaryBgColor={"#408232"}
                        primaryBgDiameter={20}
                    >
                        <Icon name={"check"} height={10} width={10} color={"#fff"}></Icon>
                    </IconBorder>
                </div>
                <p className="modal-alert__title">Huéspedes en espera de habitación</p>
                <span className="modal-alert__text">
                    El turno <span className="modal-alert__text--bold">{folioTurno}</span> es el siguiente en linea para
                    la asignación de esta habitación.
                    <span className="modal-alert__text--bold">¿Quieres proceder con el check-in del huésped? </span>
                </span>
                <div className="modal-alert__select">
                    <Controller
                        control={control}
                        name={"folio_turno_id"}
                        rules={{ required: true }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <Dropdown
                                icon={"habitacion"}
                                iconInOptions={false}
                                className={"modal-alert__input"}
                                label={"Turno a atender"}
                                placeholder={"Selecciona una opción"}
                                errorHintText={error ? "Selecciona una opción" : ""}
                                options={options}
                                value={value}
                                onClick={({ value }) => {
                                    onChange(value)
                                }}
                            />
                        )}
                    />
                </div>
                <div className="modal-alert__divider"></div>
                <div className="modal-alert__buttons">
                    <Button
                        className="modal-alert__button"
                        type={"button"}
                        text={"Continuar"}
                        onClick={() => {
                            const folioSeleccionado = control._formValues.folio_turno_id
                            const autorizacionRequerida = folioSeleccionado !== folioTurnoId

                            if (folioSeleccionado && folioSeleccionado !== "Sin turno") {
                                onConfirm?.(folioSeleccionado, autorizacionRequerida)
                            } else {
                                onConfirm?.(undefined, autorizacionRequerida)
                            }

                            onClose?.()
                        }}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default AlertaListaEspera
