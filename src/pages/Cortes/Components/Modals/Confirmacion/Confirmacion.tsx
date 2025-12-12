import { Modal } from "src/shared/components/layout/modal/Modal"
import HeaderIcon from "src/shared/components/data-display/header-icon/HeaderIcon"
import { Button } from "src/shared/components/forms"
import "./Confirmacion.css"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useProfile } from "src/shared/hooks/useProfile"
import { useFetch } from "src/shared/hooks/useFetch"
import { useNavigate } from "react-router-dom"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useOnLogout } from "src/shared/components/navigation/header/Header.helpers"
import {
    Corte,
    useAbrirTurnoMutation,
    useCerrar_CorteMutation,
    useCerrarTurnoMutation,
    useGetTurnosQuery,
    usePagarPropinasVentasMutation,
} from "src/gql/schema"
import { useEffect, useState } from "react"
import { CrearCorteRes } from "src/pages/Cortes/interfaces/CrearCorteRes"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { getNextSchedule } from "src/pages/personal/components/Board/ColumnFooter/ColumnFooter"
import { parseTimeString } from "src/shared/helpers/parseTimeString"
import { setTurn } from "src/store/turn/turnSlice"
import corteDiaOpener from "src/shared/openers/corteDiaOpener"
import { useDate } from "src/shared/hooks/useDate"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

const Confirmacion = ({
    openImpresion,
    setOpenImpresion,
    isUltimoCorte,
    corteSelected,
    numero_total_movimientos,
    suma_total_montos,
    fechaCorte,
    nombreTurnoCorte,
    corte_id = "",
}: {
    openImpresion: boolean
    setOpenImpresion: React.Dispatch<React.SetStateAction<boolean>>
    isUltimoCorte?: boolean
    corteSelected?: Corte
    numero_total_movimientos?: number
    suma_total_montos?: number
    fechaCorte?: Date
    nombreTurnoCorte?: string
    corte_id?: string
}) => {
    const dispatch = useDispatch()
    const { UTCStringToLocalDate } = useDate()
    const { onLogout } = useOnLogout()

    const navigate = useNavigate()
    const { hotel_id, usuario_id, turno_hotel_id, rolName, myProfile } = useProfile()
    const { efectivo_ingresado } = useSelector((state: RootState) => state.cortes)
    const [success, setSuccess] = useState<boolean>(false)
    const [successData, setSuccessData] = useState<any>({})
    const turnoActual = useTurnoActual()
    const [openNextTurno] = useAbrirTurnoMutation()
    const [closeTurno] = useCerrarTurnoMutation()
    const { formatCustomDate } = useFormatDate()

    const { showSnackbar } = useSnackbar()

    const variables = { hotel_id, efectivo_ingresado, usuario_id, turno_id: turno_hotel_id }

    const { refetch: crearCorte } = useFetch<CrearCorteRes>("/cortes/crear_corte", {
        variables: { ...variables },
        startFetch: false,
    })

    const { data: turnos } = useGetTurnosQuery({
        variables: {
            hotel_id,
        },
    })

    const [allCols, setAllCols] = useState<any>([])
    const [column, setColumn] = useState<any>({})
    const [pathSuccess, setPathSuccess] = useState<string>("/u")

    useEffect(() => {
        if (allCols.length === 0 || Object.keys(column).length === 0) {
            setAllCols(
                turnos?.turnos
                    ?.map((t) => ({
                        id: t.turno_id,
                        title: t.nombre,
                        hora_entrada: t.hora_entrada,
                        hora_salida: t.hora_salida,
                        estado: t.estado,
                    }))
                    .sort(
                        (a, b) => parseTimeString(a.hora_entrada).getTime() - parseTimeString(b.hora_entrada).getTime()
                    ) || []
            )

            turnos?.turnos.map((t) => {
                if (t.turno_id === turnoActual?.turno_id) {
                    setColumn({
                        id: t.turno_id,
                        title: t.nombre,
                        hora_entrada: t.hora_entrada,
                        hora_salida: t.hora_salida,
                        estado: t.estado,
                    })
                }
            })
        }
    }, [turnos, turnoActual])

    const cambiarTurno = () => {
        const nextTurno = getNextSchedule(allCols, column)
        closeTurno({
            variables: {
                cerrar_turno_input: {
                    hotel_id,
                    usuario_id,
                    turno_id: column.id,
                },
            },
        })
            .then(() => {
                openNextTurno({
                    variables: {
                        open_turno_input: {
                            hotel_id,
                            usuario_id,
                            turno_id: nextTurno.id,
                        },
                    },
                }).then((data) => {
                    setPathSuccess("/u/personal")
                    setSuccess(true)
                    dispatch(setTurn({ nombre: nextTurno.title, turno_id: nextTurno.id }))
                })
            })
            .catch((e) => {
                console.log("error", e)
            })
    }

    const onSuccessNewCorte = ({ corte_id }: { folio: string; corte_id: string }) => {
        setisCerrarCorteLoading(false)
        corteDiaOpener({
            stateNuevoCorteTurno: {
                corte_id,
            },
        })

        /*if (withLogout) {
            window.open(`/pdf/resumen-corte/${corte_id}/${WITH_LOGOUT}`, "_blank")
            return
        }
        navigate("/u")
        */
    }

    // Listener para que en caso de que se haya seleccinado "hacer corte y cerrar sesión" se cierre la sesión después de que carguen todos los datos para mostrar el pdf
    useEffect(() => {
        const onLogoutTriggered = (event) => {
            if (event.key === "triggerLogout") {
                onLogout()
            }
        }

        window.addEventListener("storage", onLogoutTriggered)

        return () => {
            window.removeEventListener("storage", onLogoutTriggered)
            localStorage.removeItem("triggerLogout")
        }
    }, [])

    const [isCerrarCorteLoading, setisCerrarCorteLoading] = useState(false)
    const [disableButtons, setdisableButtons] = useState(false)

    const [cerrarCorteMutate] = useCerrar_CorteMutation()
    const [pagarPropinasVentas] = usePagarPropinasVentasMutation()

    const cerrarCorte = async ({ corte_id, folio }: { corte_id?: string; folio?: string }) => {
        try {
            const { data: res } = await cerrarCorteMutate({
                variables: {
                    datos_corte: {
                        corte_id: corte_id || "",
                        usuario_cierra_corte: usuario_id,
                        efectivo_ingresado,
                    },
                    hotel_id,
                },
            })
            setisCerrarCorteLoading(false)
            if (res) {
                showSnackbar({
                    title: "Corte realizado",
                    text: `Se realizó el corte de turno exitosamente`,
                    status: "success",
                })
                navigate("/u")
            } else {
                showSnackbar({
                    title: "Error al crear corte",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
                setOpenImpresion(false)
            }
        } catch (error) {
            console.log("error, ", error)
            showSnackbar({
                title: "Error al crear corte",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                status: "error",
            })
            setisCerrarCorteLoading(false)
            setOpenImpresion(false)
        }
    }

    const onSubmit = async ({ withLogout }: { withLogout: boolean }) => {
        if (isCerrarCorteLoading) {
            return
        }
        setisCerrarCorteLoading(true)
        setdisableButtons(true)
        // Si es RECEPCIONISTA se sabe que en esta pantalla siempre va a crear cortes

        // Al crear un corte, independiente del perfil, se ejecuta la siguiente mutación para crear el reporte de propinas.
        if (!corte_id) {
            const pago = await pagarPropinasVentas({
                variables: {
                    payPropinasVentasInput: {
                        hotel_id,
                    },
                },
            })

            if (!pago.data?.pagar_propinas_ventas) return
        }

        if (rolName === RoleNames.recepcionista) {
            crearCorte(
                variables,
                (data) => {
                    setSuccessData(data)
                    if (withLogout) {
                        cambiarTurno()
                    } else {
                        setSuccess(true)
                    }
                    onSuccessNewCorte({
                        folio: String(data?.folio || ""),
                        corte_id: data?.corte_id || "",
                    })
                },
                (error) => {
                    console.log("error, ", error)
                    showSnackbar({
                        title: "Error al crear corte",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                },
                () => {
                    setOpenImpresion(false)
                    setisCerrarCorteLoading(false)
                }
            )
            return
        }
        // if(rolName === "ADMINISTRADOR" || rolName === "GERENTE" )
        // Si es ADMIN O GERENTE y no es el ultimo corte entonces solo cerrarlo
        if (!isUltimoCorte) {
            cerrarCorte({ corte_id: corteSelected?.corte_id, folio: String(corteSelected?.folio || "") }).finally(
                () => {
                    setisCerrarCorteLoading(false)
                    setOpenImpresion(false)
                    corteDiaOpener({
                        stateNuevoCorteTurno: {
                            corte_id: corteSelected?.corte_id || "",
                        },
                    })
                }
            )
            return
        }
        // Si es ADMIN O GERENTE al crear el corte se cierrar automáticamente
        if (isUltimoCorte) {
            crearCorte(variables, (data) => {
                setSuccessData(data)
                if (withLogout) {
                    cambiarTurno()
                } else {
                    setSuccess(true)
                }
                if (rolName === RoleNames.superadmin || rolName === RoleNames.admin || rolName === RoleNames.gerente) {
                    cerrarCorte({
                        corte_id: data?.corte_id,
                        folio: String(data?.folio || ""),
                    }).finally(() => {
                        setisCerrarCorteLoading(false)
                        setOpenImpresion(false)
                    })
                }
                onSuccessNewCorte({
                    folio: String(data?.folio || ""),
                    corte_id: data?.corte_id || "",
                })
            })
            return
        }
    }

    function checkNocturnoEnd(turnos) {
        if (!Array.isArray(turnos)) {
            return
        }

        const currentTime = new Date()
        const nocturnoTurn = turnos.find((turno) => turno.nombre === "Nocturno")

        if (!nocturnoTurn) {
            return
        }

        const horaEntrada = new Date()
        const [horaEntradaHours, horaEntradaMinutes, horaEntradaSeconds] = nocturnoTurn.hora_entrada.split(":")
        const entradaSeconds = horaEntradaSeconds.split("+")
        horaEntrada.setUTCHours(horaEntradaHours, horaEntradaMinutes, entradaSeconds[0])

        const horaSalida = new Date()
        const [horaSalidaHours, horaSalidaMinutes, horaSalidaSeconds] = nocturnoTurn.hora_salida.split(":")
        const salidaSeconds = horaSalidaSeconds.split("+")
        horaSalida.setUTCHours(horaSalidaHours, horaSalidaMinutes, salidaSeconds[0])

        // Restar 30 minutos a la hora de salida
        const adjustedHoraSalida = new Date(horaSalida.getTime() - 30 * 60000)

        // Verificar si la hora actual está dentro del turno nocturno
        if (currentTime >= horaEntrada && currentTime <= adjustedHoraSalida) {
            return false
        } else {
            return true
        }
    }

    const handleConfirm = (): void => {
        if (rolName === RoleNames.recepcionista) {
            onLogout()
        } else {
            navigate(pathSuccess)
        }
    }

    return (
        <>
            <Modal
                isOpen={openImpresion || (openImpresion && !isCerrarCorteLoading)}
                onClose={() => setOpenImpresion(false)}
                width={600}
                withCloseButton
                isCancelableOnClickOutside={false}
                className="modal-cortes-confirmacion"
            >
                <HeaderIcon
                    title={`¿Hacer corte ${nombreTurnoCorte?.toLowerCase() || ""} del ${formatCustomDate(
                        isUltimoCorte ? new Date() : fechaCorte || new Date(),
                        "DD/MMM/YY"
                    )}?`}
                    icon="DollarSquare"
                    className="modal-confirmacion__header-icon"
                />
                <p className="modal-confirmacion-subtitle">
                    Antes de hacer corte verifica que la cantidad recibida y las transacciones sean correctas. Cualquier
                    retiro de efectivo pendiente se añade al total de efectivo de este mismo corte.
                </p>
                {rolName === RoleNames.recepcionista ? (
                    <div className="modal-confirmacion-buttons-container">
                        <Button
                            disabled={disableButtons}
                            text="Hacer corte y cerrar sesión"
                            className="modal-confirmacion-button"
                            onClick={() => {
                                onSubmit({ withLogout: true })
                            }}
                        />
                    </div>
                ) : (
                    <div className="modal-confirmacion-buttons-container">
                        <Button
                            disabled={disableButtons}
                            theme="secondary"
                            text="Hacer corte"
                            className="modal-confirmacion-button"
                            onClick={() => onSubmit({ withLogout: false })}
                        />
                        {turnoActual?.nombre === "Nocturno" && checkNocturnoEnd(turnos?.turnos) && (
                            <Button
                                disabled={disableButtons}
                                text="Hacer corte y cerrar turno"
                                className="modal-confirmacion-button"
                                onClick={() => {
                                    onSubmit({ withLogout: true })
                                }}
                            />
                        )}
                        {turnoActual?.nombre !== "Nocturno" && (
                            <Button
                                disabled={disableButtons}
                                text="Hacer corte y cerrar turno"
                                className="modal-confirmacion-button"
                                onClick={() => {
                                    onSubmit({ withLogout: true })
                                }}
                            />
                        )}
                    </div>
                )}
            </Modal>
            <Modal
                isOpen={success}
                onClose={handleConfirm}
                width={600}
                withCloseButton
                className="modal-cortes-success"
            >
                <div>
                    <IconBorder
                        primaryBgColor="var(--green-card-available)"
                        primaryBgDiameter={32}
                        secondaryBgColor="var(--green-success-border)"
                        secondaryBgDiameter={48}
                        className="modal-cortes-success-icon"
                    >
                        <Icon name="checkFilled" color="var(--green-success)" height={24} width={24} />
                    </IconBorder>
                    <p className="modal-cortes-success-title">Corte de turno exitoso</p>
                    <span className="modal-cortes-success-folio">Folio: {successData?.folio}</span>
                    <div className="modal-cortes-success-info">
                        <Icon name="calendarSquare" height={16} width={16} />
                        <div className="modal-cortes-success-column" style={{ width: 180 }}>
                            <p className="modal-cortes-success-subtitle">Fecha de corte</p>
                            <p className="modal-cortes-success-value">
                                {formatCustomDate(UTCStringToLocalDate(successData?.fecha_inicio_corte), "DD/MMM/YY")}
                            </p>
                        </div>
                        <Icon name="calendarSquare" height={16} width={16} />
                        <div className="modal-cortes-success-column" style={{ width: 150 }}>
                            <p className="modal-cortes-success-subtitle">Turno</p>
                            <p className="modal-cortes-success-value">{turnoActual?.nombre}</p>
                        </div>
                        <Icon name="userFilled" height={16} width={16} />
                        <div className="modal-cortes-success-column" style={{ width: 150 }}>
                            <p className="modal-cortes-success-subtitle">Responsable</p>
                            <p className="modal-cortes-success-value">
                                {myProfile?.nombre} {myProfile?.apellido_paterno || ""}
                            </p>
                        </div>
                    </div>
                    <Button
                        text="Aceptar"
                        className="modal-confirmacion-button"
                        onClick={handleConfirm}
                        style={{ width: "100%" }}
                    />
                </div>
            </Modal>
            <LoaderComponent visible={isCerrarCorteLoading} />
        </>
    )
}

export default Confirmacion
