import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import InputText from "components/core/forms/input-text/InputText"
import Button from "components/core/forms/button/Button"
import TextareaWithCounter from "@/components/core/forms/textarea-with-counter/TextareaWithCounter"
import DatePickerSheet from "@/components/core/forms/date-picker-sheet/DatePickerSheet"
import DatePickerHeaderGeneral from "@/components/core/forms/date-picker-sheet/sections/DatePickerHeaderGeneral/DatePickerHeaderGeneral"
import SelectField from "@/components/core/forms/select-field/SelectField"
import EvidenceUpload from "@/modules/incidences/components/evidence-upload-item/EvidenceUploadItem"
import type { FormHuespedProps, FormHuespedValues as FormValues } from "./FormHuesped.type.ts"
import styles from "./FormHuesped.module.css"
import { EstadosTurno, useGetTurnosQuery } from "@/gql/schema"
import { useProfile } from "@/hooks/store/useProfile"
import { uploadIncidenceImage } from "@/modules/incidences/helpers/upload"
import { typesHuesped } from "../../IncidenceForm.constants.ts"
import { getDateSlashFormat } from "src/modules/incidences/pages/incidence-form/helpers/date.ts"
import maskMatricula from "@/helpers/mask-matricula.ts"

const FormHuesped = ({ onSubmit }: FormHuespedProps) => {
    const [calendarOpen, setCalendarOpen] = useState(false)
    const { hotel_id } = useProfile()
    const [loading, setLoading] = useState(false);

    const { data: turnosData } = useGetTurnosQuery({
        variables: { hotel_id: [hotel_id] },
    })

    const { control, handleSubmit, setValue } = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            fecha: new Date(),
            turno:
                turnosData?.turnos?.find((t) => t.estado === EstadosTurno.Abierto)?.turno_id ||
                turnosData?.turnos?.[0]?.turno_id ||
                "",
            tipo: "",
            responsable: "",
            descripcion: "",
            tipo_incidencia: "huésped",
        },
    })

    const turnoActivo = turnosData?.turnos?.find((turno) => turno.estado === EstadosTurno.Abierto)

    const turnoOptions =
        turnosData?.turnos?.map((turno) => ({
            label: turno.nombre,
            value: turno.turno_id,
        })) || []

    // valores por defecto
    useEffect(() => {
        setValue("fecha", new Date(), { shouldValidate: true })

        if (turnoActivo?.turno_id) {
            setValue("turno", turnoActivo.turno_id, { shouldValidate: true })
        } else if (turnosData?.turnos?.[0]?.turno_id) {
            setValue("turno", turnosData.turnos[0].turno_id, { shouldValidate: true })
        }
    }, [turnosData, turnoActivo, setValue])

    const [evidenceFiles, setEvidenceFiles] = useState<(string | null)[]>([null, null, null])

    const handleInternalSubmit = async (formData: FormValues) => {
         setLoading(true);

        try {
            const uploaded = await Promise.all(
                evidenceFiles.map((file, index) =>
                    file ? uploadIncidenceImage({ file, index }, "incidencias") : Promise.resolve(null)
                )
            )
            const evidencias = uploaded.filter((u): u is string => Boolean(u))

            onSubmit({ ...formData, evidencias })
        } catch (err) {
            console.error("Error subiendo evidencias:", err)
       } finally {
        setLoading(false); 
    }
    }
    return (
        <>
            <form onSubmit={handleSubmit(handleInternalSubmit)} className={styles["form-huesped__form"]}>
                <h2 className={styles["form-huesped__title"]}>Completa el formulario</h2>

                {/* Fecha */}
                <div className={styles["form-huesped__group"]}>
                    <p className={styles["form-huesped__label"]}>Fecha de incidencia</p>
                    <Controller
                        control={control}
                        name="fecha"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <InputText
                                icon="Calendar"
                                placeholder="21 / Diciembre / 2024"
                                value={field.value ? getDateSlashFormat(field.value) : ""}
                                readOnly
                                onClick={() => setCalendarOpen(true)}
                                onChange={() => {}}
                            />
                        )}
                    />
                </div>

                {/* Turno */}
                <div className={styles["form-huesped__group"]}>
                    <Controller
                        control={control}
                        name="turno"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <SelectField
                                icon="Clock"
                                label="Turno"
                                placeholder="Selecciona un turno"
                                options={turnoOptions}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                {/* Tipo de incidencia */}
                <div className={styles["form-huesped__group"]}>
                    <Controller
                        control={control}
                        name="tipo"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <SelectField
                                icon="AlertLine"
                                label="Tipo de incidencia"
                                placeholder="Selecciona una opción"
                                options={typesHuesped}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                {/* Matrícula del auto */}
                <div className={styles["form-huesped__group"]}>
                    <Controller
                        control={control}
                        name="matricula"
                        rules={{ required: false }}
                        render={({ field }) => (
                            <InputText
                                label="Matrícula del auto (opcional)"
                                icon="Car"
                                placeholder="Escribe la matrícula del auto"
                                value={maskMatricula(field.value ?? "")}
                                onChange={(val: string) => {
                                    const formattedValue = maskMatricula(val)
                                    field.onChange(formattedValue)
                                    return formattedValue
                                }}
                            />
                        )}
                    />
                </div>

                {/* Responsable */}
                <div className={styles["form-huesped__group"]}>
                    <Controller
                        control={control}
                        name="responsable"
                        rules={{ required: false }}
                        render={({ field }) => (
                            <InputText
                                label="Nombre del responsable (opcional)"
                                icon="User"
                                placeholder="Escribe tu nombre"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                {/* Descripción */}
                <div className={styles["form-huesped__group"]}>
                    <p className={styles["form-huesped__label"]}>Descripción de la incidencia</p>
                    <Controller
                        control={control}
                        name="descripcion"
                        rules={{ required: true, maxLength: 200 }}
                        render={({ field }) => (
                            <TextareaWithCounter
                                placeholder="Escribe un comentario..."
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                {/* Evidencia */}
                <div className={styles["form-huesped__group"]}>
                    <p className={styles["form-huesped__label"]}>Evidencia fotográfica (opcional)</p>
                    <div className={styles["form-huesped__evidence"]}>
                        <EvidenceUpload files={evidenceFiles} onFilesChange={setEvidenceFiles} />
                    </div>
                </div>

                {/* Botón */}
                <div className={styles["form-huesped__footer"]}>
                    <div className={styles["form-huesped__divider"]} />
                    <Button
                        type="submit"
                        text="Registrar incidencia"
                        className={styles["form-huesped__submit-button"]}
                        loading={loading} 
                    />
                </div>
            </form>
            <DatePickerSheet
                open={calendarOpen}
                onClose={() => setCalendarOpen(false)}
                header={(onAccept) => (
                    <DatePickerHeaderGeneral
                        handleAccept={() => {
                            onAccept()
                            setCalendarOpen(false)
                        }}
                        headerLeft="Fecha de incidencia"
                        headerRight="Aceptar"
                    />
                )}
                onSelectDate={(date) => {
                    setValue("fecha", date, { shouldDirty: true, shouldValidate: true })
                }}
                withDays={true}
            />
        </>
    )
}

export default FormHuesped
