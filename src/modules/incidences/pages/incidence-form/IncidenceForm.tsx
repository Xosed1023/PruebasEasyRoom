import ScreenDetail from "@/components/core/layout/screen-detail/ScreenDetail"
import { useColaboradoresQuery } from "@/gql/schema"
import { CREATE_INCIDENCE } from "@/graphql/incidences/incidence"
import { useProfile } from "@/hooks/store/useProfile"
import useSnackbar from "@/hooks/useSnackbar"
import { useMutation } from "@apollo/client"
import { useNavigate, useSearchParams } from "react-router"
import FormHabitaciones from "./components/form-habitaciones/FormHabitaciones"
import FormHuesped from "./components/form-huesped/FormHuesped"
import FormInstalaciones from "./components/form-instalaciones/FormInstalaciones"
import styles from "./IncidenceForm.module.css"

const IncidenceForm = () => {
    const [params] = useSearchParams()
    const origen = params.get("origen")
    const navigate = useNavigate()
    const { showSnackbar } = useSnackbar()
    const { usuario, hotel_id } = useProfile()

    const { data, loading: queryLoading } = useColaboradoresQuery({
        variables: { usuario_id: usuario?.usuario_id },
    })

    const searchCollaborator = () => {
        if (queryLoading || !data?.colaboradores || !usuario) {
            return "No colaboradores found or user not defined" as any
        }
        return data.colaboradores[0].colaborador_id
    }

    const [crearIncidencia, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_INCIDENCE)

    const handleCreateIncidence = async (formData: any) => {
        try {
            const evidenciasUrls: string[] = Array.isArray(formData.evidencias)
                ? formData.evidencias.filter(Boolean)
                : []

            const imagenes = evidenciasUrls.map((url) => ({ imagen: url }))

            const input = {
                area: formData.tipo_incidencia,
                fecha_registro: formData.fecha?.toISOString(),
                detalle: formData.descripcion,
                severidad: "alta",
                tipo_incidencia: formData.tipo_incidencia ?? "instalaciones",
                habitacion_id: formData.habitacion_id ?? null,
                turno_id: formData.turno,
                colaborador_id_reporta: searchCollaborator(),
                hotel_id,
                matricula: formData.matricula ?? null,
                imagenes,
            }

            await crearIncidencia({ variables: { createIncidenciaInput: input } })

            showSnackbar({
                status: "success",
                title: "Incidencia registrada",
                text: "Tu incidencia ha sido registrada exitosamente.",
            })

            navigate(-2)
        } catch (e) {
            console.error("Error al registrar incidencia:", e)
            showSnackbar({
                status: "error",
                title: "Error al registrar incidencia",
                text: "No fue posible registrar la incidencia. Inténtalo de nuevo más tarde.",
            })
        }
    }

    return (
        <ScreenDetail title="Nueva incidencia" className={styles["incidence-form__content"]}>
            {origen === "instalaciones" && (
                <FormInstalaciones onSubmit={handleCreateIncidence} loading={mutationLoading} error={mutationError} />
            )}
            {origen === "habitaciones" && (
                <FormHabitaciones onSubmit={handleCreateIncidence} loading={mutationLoading} error={mutationError} />
            )}
            {origen === "huesped" && (
                <FormHuesped onSubmit={handleCreateIncidence} loading={mutationLoading} error={mutationError} />
            )}
        </ScreenDetail>
    )
}

export default IncidenceForm
