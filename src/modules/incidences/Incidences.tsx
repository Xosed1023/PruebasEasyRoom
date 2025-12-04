import { useEffect, useState } from "react"
import Header from "@/components/core/layout/header/Header"
import NavbarNavigator from "@/components/core/navigation/navbar"
import Icon from "@/icons"
import Screen from "@/components/core/layout/screen/Screen"

import IncidenceEmpty from "./pages/incidence-empty/IncidenceEmpty"
import IncidenceList from "./pages/incidence-list/IncidenceList"
import IncidenceSkeleton from "./components/incidence-skeleton/IncidenceSkeleton"

import { MONTH_NAMES } from "@/utils/month-names"
import { IncidenceFilterSheet } from "./sections/incidence-filter-sheet/IncidenceFilterSheet"
import IncidenceEmptyFilter from "./sections/incidence-empty-filter/IncidenceEmptyFilter"
import { Incidence } from "./pages/incidence-list/IncidenceList.type"
import { IncidenceDetailSheet } from "./sections/incidence-detailSheet/IncidenceDetailSheet"
import styles from "./Incidences.module.css"
import { useProfile } from "@/hooks/store/useProfile"
import {
    GetIncidenciasQuery,
    useGetIncidenciasQuery,
    useObtenerBandejaIncidenciasQuery,
    useMarcarComoLeidaMutation,
} from "@/gql/schema"
import { formatDateShort } from "@/utils/formatDate"
import { getIncidenceStyle } from "./utils/incidence-style"
import { normalizeOrigen, normalizePrioridad, normalizeTurno, normalizeUrgencia } from "./utils/normalize"
import SectionTitle from "@/components/core/layout/section-title/SectionTitle"
import { Button } from "@/components/ui/Button/Button"

const Incidences = () => {
    const { usuario, hotel_id } = useProfile()
    const currMonth = new Date().getMonth()

    const [incidences, setIncidences] = useState<Incidence[]>([])
    const [selectedIncidence, setSelectedIncidence] = useState<Incidence | null>(null)
    const [showFilter, setShowFilter] = useState(false)
    const [hasFiltered, setHasFiltered] = useState(false)

    const [selectedFilters, setSelectedFilters] = useState({
        months: [currMonth],
        origenes: [] as string[],
        turnos: [] as string[],
        urgencias: [] as string[],
    })

    const { data, loading } = useGetIncidenciasQuery({
        skip: !hotel_id,
        variables: {
            hotel_id,
        },
    })
    const { data: bandejaIncidencia, refetch: refetchBandeja } = useObtenerBandejaIncidenciasQuery({
        variables: { usuarioId: [usuario?.usuario_id], hotelId: [hotel_id] },
    })
    const [marcarComoLeida] = useMarcarComoLeidaMutation({
        onCompleted: () => {
            refetchBandeja()
        },
    })

    const isAppReady = !loading && !!data?.incidencias && !!bandejaIncidencia?.obtener_bandeja_incidencias
   

    const toPhotoUrls = (imgs: GetIncidenciasQuery["incidencias"][number]["imagenes"]): string[] => {
        if (!Array.isArray(imgs)) return []
        return imgs
            .map((n) => (n && typeof n.imagen === "string" ? n.imagen : undefined))
            .filter((u): u is string => !!u)
    }
    useEffect(() => {
        if (!loading && data?.incidencias) {
            const mapped: Incidence[] = data.incidencias.map((item) => {
                const origen = normalizeOrigen(item.area)
                const { icon, bgColor, iconColor } = getIncidenceStyle(origen)
                const bandejaItem = bandejaIncidencia?.obtener_bandeja_incidencias?.find(
                    (b) => b.incidencia_id === item.incidencia_id
                )
                const leido = bandejaItem?.leido ?? false

                return {
                    id: item.incidencia_id,
                    folio: item.folio,
                    date: formatDateShort(item.fecha_registro),
                    fechaRegistro: item.fecha_registro,
                    category:
                        origen === "habitaciones" ? "Habitaciones" : origen === "huesped" ? "Huésped" : "Instalaciones",
                    description: item.detalle || "",
                    icon,
                    iconColor,
                    bgColor,
                    unread: item.estado === "activa" && leido === false,
                    estado: item.estado === "activa" ? "abierta" : "cerrada",
                    prioridad: normalizePrioridad(item.severidad),
                    origen,
                    turno: normalizeTurno(item.turno?.nombre),
                    urgencia: normalizeUrgencia(item.severidad),
                    habitacion: item.habitacion?.numero_habitacion || "",
                    tipoHabitacion: item.habitacion?.tipo_habitacion?.nombre || "",
                    tipoIncidencia: item.tipo_incidencia || "",
                    reportadoPor: `${item.colaborador_reporta?.nombre ?? ""} ${
                        item.colaborador_reporta?.apellido_paterno ?? ""
                    }`.trim(),
                    responsable: `${item.colaborador_cierra?.nombre ?? ""} ${
                        item.colaborador_cierra?.apellido_paterno ?? ""
                    }`.trim(),

                    matricula: item.matricula || "",
                    photos: toPhotoUrls(item.imagenes),
                    month: new Date(item.fecha_registro).getMonth(),
                }
            })

            const incidencesSorted = mapped.sort(
                (a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
            )

            setIncidences(incidencesSorted)
        }
    }, [data, loading, hotel_id, bandejaIncidencia])

    const handleOpenFilter = () => setShowFilter(true)
    const handleCloseFilter = () => setShowFilter(false)

    const handleFilterChange = (filters: typeof selectedFilters) => {
        setSelectedFilters(filters)
        setHasFiltered(true)
    }

    const handleClearFilters = () => {
        setSelectedFilters({
            months: [currMonth],
            origenes: [],
            turnos: [],
            urgencias: [],
        })
        setHasFiltered(false)
        setShowFilter(false)
    }

    const handleOpenIncidence = async (item: Incidence) => {
        setSelectedIncidence(item)

        const bandejaItem = bandejaIncidencia?.obtener_bandeja_incidencias?.find((b) => b.incidencia_id === item.id)

        if (bandejaItem && !bandejaItem.leido) {
            try {
                await marcarComoLeida({
                    variables: { bandejaNotificacionesId: bandejaItem.bandeja_notificaciones_id },
                })
            } catch (err) {
                console.error("Error al marcar como leída:", err)
            }
        }
    }

    const filteredIncidences = isAppReady
        ? incidences.filter((item) => {
              const itemMonth = item.month
              const isFilteringByMonth = hasFiltered && selectedFilters.months.length > 0

              const isOpenInSelectedMonth =
                  isFilteringByMonth && item.estado === "abierta" && selectedFilters.months.includes(itemMonth)

              const isClosedInCurrentMonth =
                  isFilteringByMonth &&
                  item.estado === "cerrada" &&
                  itemMonth === currMonth &&
                  selectedFilters.months.includes(currMonth)

              const isDefaultVisible =
                  !isFilteringByMonth &&
                  item.estado === "abierta" &&
                  (item.prioridad === "alta" || item.prioridad === "media" || item.prioridad === "baja")

              const matchOrigen =
                  selectedFilters.origenes.length === 0 || selectedFilters.origenes.includes(item.origen)
              const matchTurno = selectedFilters.turnos.length === 0 || selectedFilters.turnos.includes(item.turno)
              const matchUrgencia =
                  selectedFilters.urgencias.length === 0 || selectedFilters.urgencias.includes(item.urgencia)

              return (
                  (isOpenInSelectedMonth || isClosedInCurrentMonth || isDefaultVisible) &&
                  matchOrigen &&
                  matchTurno &&
                  matchUrgencia
              )
          })
        : []

   return (
    <Screen header={<Header />} footer={<NavbarNavigator />} padding={false} className="flex flex-col gap-y-[20px]">
        
        {/*Mostrar skeleton antes del contenido real */}
        {!isAppReady && (
            <div className="w-full h-full flex flex-col gap-4 pt-[24px] px-[20px]">
                <SectionTitle title="Incidencias" semiBold />
                <IncidenceSkeleton />
            </div>
        )}

        {/* Contenido real SOLO cuando ya está listo */}
        {isAppReady && (
            <div className="w-full h-full flex flex-col gap-4">

                <div className="flex justify-between items-center s:px-[35px] xs:px-[20px] pt-[24px]">
                    <SectionTitle title="Incidencias" semiBold />
                    <Button variant="ghost" aria-label="Filtrar" onClick={handleOpenFilter}>
                        <Icon name="FilterFunnel" width={20} height={20} color="#5E3EDA" />
                    </Button>
                </div>

                {/* Filtros aplicados */}
                {hasFiltered &&
                    (selectedFilters.months.length > 0 ||
                        selectedFilters.origenes.length > 0 ||
                        selectedFilters.turnos.length > 0 ||
                        selectedFilters.urgencias.length > 0) && (
                        <div className={styles["incidences__filters"]}>
                            {selectedFilters.months.map((month) => (
                                <span key={`month-${month}`} className={styles["incidences__filter-tag"]}>
                                    {MONTH_NAMES[month]}
                                    <Icon
                                        name="Close"
                                        height={14}
                                        width={14}
                                        color="#9E77ED"
                                        className={styles["incidences__filter-tag-close"]}
                                        onClick={() =>
                                            setSelectedFilters((prev) => ({
                                                ...prev,
                                                months: prev.months.filter((m) => m !== month),
                                            }))
                                        }
                                    />
                                </span>
                            ))}

                            {selectedFilters.origenes.map((o) => (
                                <span key={`origen-${o}`} className={styles["incidences__filter-tag"]}>
                                    {o[0].toUpperCase() + o.slice(1)}
                                    <Icon
                                        name="Close"
                                        height={14}
                                        width={14}
                                        color="#9E77ED"
                                        className={styles["incidences__filter-tag-close"]}
                                        onClick={() =>
                                            setSelectedFilters((prev) => ({
                                                ...prev,
                                                origenes: prev.origenes.filter((x) => x !== o),
                                            }))
                                        }
                                    />
                                </span>
                            ))}

                            {selectedFilters.turnos.map((t) => (
                                <span key={`turno-${t}`} className={styles["incidences__filter-tag"]}>
                                    {t[0].toUpperCase() + t.slice(1)}
                                    <Icon
                                        name="Close"
                                        height={14}
                                        width={14}
                                        color="#9E77ED"
                                        className={styles["incidences__filter-tag-close"]}
                                        onClick={() =>
                                            setSelectedFilters((prev) => ({
                                                ...prev,
                                                turnos: prev.turnos.filter((x) => x !== t),
                                            }))
                                        }
                                    />
                                </span>
                            ))}

                            {selectedFilters.urgencias.map((u) => (
                                <span key={`urgencia-${u}`} className={styles["incidences__filter-tag"]}>
                                    {u[0].toUpperCase() + u.slice(1)}
                                    <Icon
                                        name="Close"
                                        height={14}
                                        width={14}
                                        color="#9E77ED"
                                        className={styles["incidences__filter-tag-close"]}
                                        onClick={() =>
                                            setSelectedFilters((prev) => ({
                                                ...prev,
                                                urgencias: prev.urgencias.filter((x) => x !== u),
                                            }))
                                        }
                                    />
                                </span>
                            ))}
                        </div>
                    )}

                {/* Lista / Empty */}
                {filteredIncidences.length === 0 ? (
                    hasFiltered ? (
                        <IncidenceEmptyFilter onClear={handleClearFilters} />
                    ) : (
                        <IncidenceEmpty />
                    )
                ) : (
                    <div className={styles["incidences__list"]}>
                        <IncidenceList incidences={filteredIncidences} onClickItem={handleOpenIncidence} />
                    </div>
                )}

            </div>
        )}

        <IncidenceFilterSheet
            open={showFilter}
            selectedFilters={selectedFilters}
            onChange={handleFilterChange}
            onClose={handleCloseFilter}
            onClearFilters={handleClearFilters}
        />

        <IncidenceDetailSheet
            open={!!selectedIncidence}
            incidence={selectedIncidence}
            onClose={() => setSelectedIncidence(null)}
        />

    </Screen>
)

}

export default Incidences
