import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import Icon from "@/icons"
import styles from "./NotificationSettings.module.css"
import { Switch } from "@/components/ui/switchDemo/SwitchDemo"
import { Drawer, DrawerContent, DrawerClose, DrawerTrigger } from "@/components/ui/drawer/Drawer"
import Snackbar from "@/components/core/data-display/snack-bar/Snackbar"
import { useProfile } from "@/hooks/store/useProfile"

import {
    useGetUsuariosNotificacionesQuery,
    useActualizarConfiguracionNotificacionesMutation,
    GetUsuariosNotificacionesDocument,
    TipoNotificacion,
} from "@/gql/schema"

import { GROUP_META, SUBTYPE_LABEL, SUBTYPES_BY_GROUP, type NotificationGroup } from "../../utils/notification-style"

type Props = { triggerButton: React.ReactNode }

export const NotificationSettings = ({ triggerButton }: Props) => {
    const { usuario, hotel_id } = useProfile()
    const usuario_id = usuario?.usuario_id ?? ""

    const closeRef = useRef<HTMLButtonElement>(null)

    const [snack, setSnack] = useState<{ isOpen: boolean; status: "success" | "error" }>({
        isOpen: false,
        status: "success",
    })

    const { data, loading } = useGetUsuariosNotificacionesQuery({
        skip: !usuario_id || !hotel_id,
        variables: { usuario_id, hotel_id },
    })

    const initialFromServer = useMemo(() => {
        const base: Record<string, boolean> = {}
        ;(Object.keys(SUBTYPES_BY_GROUP) as NotificationGroup[]).forEach((group) => {
            SUBTYPES_BY_GROUP[group].forEach((key) => {
                base[key] = true
            })
        })

        for (const n of data?.usuarios_notificaciones ?? []) {
            if (n?.tipo) base[n.tipo] = !!n.activado
        }
        return base
    }, [data])

    const [settings, setSettings] = useState<Record<string, boolean>>({})
    const initialRef = useRef<Record<string, boolean>>({})

    useEffect(() => {
        if (!loading) {
            setSettings(initialFromServer)
            initialRef.current = initialFromServer
        }
    }, [initialFromServer, loading])

    const toggle = (key: string) =>
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }))

    const [actualizarConfig, { loading: saving }] = useActualizarConfiguracionNotificacionesMutation()

    const handleSave = useCallback(async () => {
        const activar: string[] = []
        const desactivar: string[] = []
        const current = settings
        const initial = initialRef.current

        Object.keys(current).forEach((key) => {
            const now = !!current[key]
            const was = !!initial[key]
            if (now !== was) {
                ;(now ? activar : desactivar).push(key)
            }
        })
        const toEnumList = (list: string[]): TipoNotificacion[] =>
            list.filter((v): v is TipoNotificacion => (Object.values(TipoNotificacion) as string[]).includes(v))
        try {
            await actualizarConfig({
                variables: {
                    configNotificacionesInput: {
                        usuario_id,
                        hotel_id,
                        notificaciones_activar: toEnumList(activar),
                        notificaciones_desactivar: toEnumList(desactivar),
                    },
                },
                refetchQueries: [{ query: GetUsuariosNotificacionesDocument, variables: { usuario_id, hotel_id } }],
            })

            setSnack({ isOpen: true, status: "success" })
            initialRef.current = { ...settings }
            closeRef.current?.click()
        } catch (e) {
            console.error(e)
            setSnack({ isOpen: true, status: "error" })
        } finally {
            setTimeout(() => setSnack((s) => ({ ...s, isOpen: false })), 3000)
        }
    }, [actualizarConfig, settings, usuario_id, hotel_id])

    return (
        <>
            <Drawer>
                <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>

                <DrawerContent className={styles["notification-settings__sheet-content"]}>
                    <DrawerClose asChild>
                        <button ref={closeRef} style={{ display: "none" }} aria-label="Cerrar" />
                    </DrawerClose>

                    <h3 className={styles["notification-settings__title"]}>Configuración de notificaciones</h3>

                    <div className={styles["notification-settings__groups"]}>
                        {(Object.keys(SUBTYPES_BY_GROUP) as NotificationGroup[]).map((group) => {
                            const meta = GROUP_META[group]
                            return (
                                <div key={group} className={styles["notification-settings__group"]}>
                                    <div className={styles["notification-settings__group-header"]}>
                                        <div
                                            className={styles["notification-settings__icon-wrapper"]}
                                            style={{ backgroundColor: meta.bgColor }}
                                        >
                                            <Icon name={meta.icon} width={16} height={16} color={meta.iconColor} />
                                        </div>
                                        <span className={styles["notification-settings__group-title"]}>
                                            {meta.title}
                                        </span>
                                    </div>

                                    {SUBTYPES_BY_GROUP[group].map((key) => (
                                        <div key={key} className={styles["notification-settings__option-row"]}>
                                            <span>{SUBTYPE_LABEL[key]}</span>
                                            <Switch
                                                checked={!!settings[key]}
                                                onCheckedChange={() => toggle(key)}
                                                disabled={loading || saving}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )
                        })}
                    </div>

                    <button
                        className={styles["notification-settings__save-button"]}
                        onClick={handleSave}
                        disabled={loading || saving}
                    >
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </button>
                </DrawerContent>
            </Drawer>

            <Snackbar
                isOpen={snack.isOpen}
                onClose={() => setSnack((prev) => ({ ...prev, isOpen: false }))}
                status={snack.status}
                title={snack.status === "success" ? "Cambios guardados" : "Error al guardar los cambios"}
                text={
                    snack.status === "success"
                        ? "Tus cambios se han guardado con éxito."
                        : "No se pudieron guardar los cambios de configuración."
                }
            />
        </>
    )
}
