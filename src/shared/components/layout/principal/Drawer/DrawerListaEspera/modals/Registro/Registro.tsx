import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { EstadosTurnosAtencion, useCrearTurnoAtencionMutation, useGetTiposHabitacionQuery } from "src/gql/schema"
import { Button, InputText } from "src/shared/components/forms"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { useProfile } from "src/shared/hooks/useProfile"
import useSnackbar from "src/shared/hooks/useSnackbar"
import AlertaModal from "../Alerta/Alerta"
import { usePrintTicket } from "src/shared/hooks/print"
import { ModalProps } from "../../DrawerListaEspera.types"
import Icon from "src/shared/icons"
import "./Registro.css"

type FormValues = {
    tipo_habitacion_id: string
    nombre_o_matricula: string
}

function RegistroTurnoModal({ onClose, onConfirm, onLoader }: ModalProps) {
    const [alertModal, setAlert] = useState<boolean>(false)
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            tipo_habitacion_id: "",
            nombre_o_matricula: "",
        },
    })
    const { hotel_id, usuario_id } = useProfile()
    const { data } = useGetTiposHabitacionQuery({ variables: { hotel_id } })
    const [crearTurnoAtencion] = useCrearTurnoAtencionMutation()
    const { showSnackbar } = useSnackbar()
    const { handlePrint } = usePrintTicket()

    const options =
        data?.tipo_habitaciones
            ?.filter((i) => i.nombre)
            .map((i) => {
                return {
                    value: i?.tipo_habitacion_id || "",
                    label: i?.nombre || "",
                }
            }) || []

    const onSubmit = ({ tipo_habitacion_id, nombre_o_matricula }: FormValues) => {
        onLoader(true)
        crearTurnoAtencion({
            variables: {
                input: {
                    tipo_habitacion_id,
                    nombre_o_matricula,
                    hotel_id,
                    usuario_id,
                    estado: EstadosTurnosAtencion.EnEspera,
                },
            },
        })
            .then(({ data }) => {
                const turno_atencion_id = data?.crear_turno_atencion?.turno_atencion_id || ""
                showSnackbar({
                    title: "Turno registrado",
                    text: `Se registró el turno **${data?.crear_turno_atencion?.folio_turno}** exitosamente.`,
                    status: "success",
                })
                onConfirm()
                if (turno_atencion_id) {
                    handlePrint(turno_atencion_id, "custom", "9")
                }
            })
            .catch((e) => {
                showSnackbar({ status: "error", title: "Error al registrar turno" })
                console.log(e)
            })
            .finally(() => {
                onClose()
                onLoader(false)
            })
    }

    return (
        <>
            <Modal
                className="registro-le__modal"
                width={572}
                height={420}
                isOpen={true}
                onClose={onClose}
                withCloseButton
            >
                <form className="registro-le__form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="registro-le__content">
                        <div className="registro-le__circle">
                            <Icon name={"TurnoFill"} height={24} width={26} color={"var(--primary)"} />
                        </div>
                        <p className="registro-le__title">{"Registro de turno"}</p>
                        <Controller
                            control={control}
                            name={"tipo_habitacion_id"}
                            rules={{ required: true }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <Dropdown
                                    icon={"habitacion"}
                                    iconInOptions={false}
                                    className={"registro-le__select"}
                                    label={"Tipo de habitación"}
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
                        <Controller
                            control={control}
                            name={"nombre_o_matricula"}
                            rules={{ required: false }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputText
                                    type="text"
                                    icon={Icon}
                                    iconProps={{ name: "userFilled", height: 16, width: 16, color: "var(--tipografa)" }}
                                    inputWrapperClass={"registro-le__input"}
                                    label={"Nombre de huésped (opcional)"}
                                    placeholder={"Escribe el nombre o matrícula"}
                                    errorhinttext={error ? "" : ""}
                                    value={value}
                                    onChange={(e) => onChange(`${e.target.value}`)}
                                    error={!!error}
                                />
                            )}
                        />
                    </div>
                    <div className="registro-le__footer">
                        <Button className="registro-le__btn" type={"submit"} text={"Registrar turno"} />
                    </div>
                </form>
            </Modal>
            {alertModal && <AlertaModal onClose={() => setAlert(false)} />}
        </>
    )
}

export default RegistroTurnoModal
