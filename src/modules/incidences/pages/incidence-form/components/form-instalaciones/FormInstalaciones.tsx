import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import InputText from "components/core/forms/input-text/InputText"
import Button from "components/core/forms/button/Button"
import TextareaWithCounter from "@/components/core/forms/textarea-with-counter/TextareaWithCounter"
import type { FormInstalacionesValues as FormValues, Props } from "./FormInstalaciones.type"
import styles from "./FormInstalaciones.module.css"
import DatePickerSheet from "@/components/core/forms/date-picker-sheet/DatePickerSheet"
import DatePickerHeaderGeneral from "@/components/core/forms/date-picker-sheet/sections/DatePickerHeaderGeneral/DatePickerHeaderGeneral"
import SelectField from "@/components/core/forms/select-field/SelectField"
import EvidenceUpload from "@/modules/incidences/components/evidence-upload-item/EvidenceUploadItem"
import { useProfile } from "@/hooks/store/useProfile"
import { EstadosTurno, useGetTurnosQuery } from "@/gql/schema"
import { uploadIncidenceImage } from "@/modules/incidences/helpers/upload"
import { getDateSlashFormat } from "src/modules/incidences/pages/incidence-form/helpers/date.ts"
import { useEffect } from "react"

function FormInstalaciones({ onSubmit }: Props) {
    const [calendarOpen, setCalendarOpen] = useState(false)
    const { hotel_id } = useProfile()
    const [loading, setLoading] = useState(false);

    const { data: turnosData } = useGetTurnosQuery({ variables: { hotel_id: [hotel_id] } })

    // Encontrar el turno activo
    const turnoActivo = turnosData?.turnos?.find((turno) => turno.estado === EstadosTurno.Abierto)

    const turnoOptions =
        turnosData?.turnos.map((turno) => ({
            label: turno.nombre,
            value: turno.turno_id,
        })) || []

    const { control, handleSubmit, setValue } = useForm<FormValues>({
        defaultValues: {
            fecha: new Date(),
            turno:
                turnosData?.turnos?.find((t) => t.estado === EstadosTurno.Abierto)?.turno_id ||
                turnosData?.turnos?.[0]?.turno_id ||
                "",
            responsable: "",
            descripcion: "",
            tipo_incidencia: "instalaciones",
        },
    })

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
            <form onSubmit={handleSubmit(handleInternalSubmit)} className={styles["form-instalaciones__form"]}>
                <h2 className={styles["form-instalaciones__title"]}>Completa el formulario</h2>

                {/* FECHA */}
                <div className={styles["form-instalaciones__group"]}>
                    <p className={styles["form-instalaciones__label"]}>Fecha de incidencia</p>
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

                {/* TURNO */}
                <div className={styles["form-instalaciones__group"]}>
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
                {/* Responsable */}
                <div className={styles["form-instalaciones__group"]}>
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
                {/* DESCRIPCIÓN */}
                <div className={styles["form-instalaciones__group"]}>
                    <p className={styles["form-instalaciones__label"]}>Descripción de la incidencia</p>
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

                {/* EVIDENCIA */}
                <div className={styles["form-instalaciones__group"]}>
                    <p className={styles["form-instalaciones__label"]}>Evidencia fotográfica (opcional)</p>
                    <div className={styles["form-instalaciones__evidence"]}>
                        <EvidenceUpload files={evidenceFiles} onFilesChange={setEvidenceFiles} />
                    </div>
                </div>

                {/* BOTÓN */}
                <div className={styles["form-instalaciones__footer"]}>
                    <div className={styles["form-instalaciones__divider"]} />
                    <Button
                        type="submit"
                        text="Registrar incidencia"
                        className={styles["form-instalaciones__submit-button"]}
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

export default FormInstalaciones
