import { useMemo, useCallback } from "react"
import { NotificationsHeader } from "./components/notifications-header/NotificationsHeader"
import { NotificationSkeleton } from "./components/notification-skeleton/NotificationSkeleton"
import { NotificationEmpty } from "./pages/notification-empty/NotificationEmpty"
import { NotificationList } from "./pages/notification-list/NotificationList"

import { useProfile } from "@/hooks/store/useProfile"
import { formatDateShort } from "@/utils/formatDate"
import {
    useObtenerBandejaNotificacionesQuery,
    useMarcarNotificacionComoLeidaMutation,
    ObtenerBandejaNotificacionesDocument,
    useGetUsuariosNotificacionesQuery,
} from "@/gql/schema"
import { getNotificationStyle } from "./utils/notification-style"
import { loadSwitchOff } from "./utils/notification-switch-off"

const Notifications = () => {
    const { usuario: currentUser, hotel_id } = useProfile()

    const userId = currentUser?.usuario_id ?? ""

    // Notificaciones lista
    const { data, loading } = useObtenerBandejaNotificacionesQuery({
        skip: !hotel_id || !userId,
        variables: { usuarioId: [userId], hotelId: [hotel_id] },
        fetchPolicy: "cache-and-network",
    })

    // notificaciones configuracion
    const { data: userNotificationSettings } = useGetUsuariosNotificacionesQuery({
        skip: !hotel_id || !userId,
        variables: { usuario_id: userId, hotel_id: hotel_id },
        fetchPolicy: "cache-and-network",
    })

    // invalidar memo cuando cambie la configuración
    const settingsSignature =
        userNotificationSettings?.usuarios_notificaciones?.map((s) => `${s?.tipo}:${s?.activado}`).join("|") ?? ""

    // se oculta dependiendo el tipo de notificación
    const switchOffAtByType = useMemo(() => loadSwitchOff(userId, hotel_id), [userId, hotel_id, settingsSignature])

    const [markNotificationAsRead] = useMarcarNotificacionComoLeidaMutation()

    const notificationItems = useMemo(() => {
        const notifications = data?.obtener_bandeja_notificaciones ?? []

        const visibleNotifications = notifications.filter((notification) => {
            const type = notification?.tipo ?? ""
            const muteCutoffISO = switchOffAtByType[type]
            if (!muteCutoffISO) return true

            const muteCutoff = Date.parse(muteCutoffISO)
            const registrationDate = notification?.fecha_registro
                ? Date.parse(notification.fecha_registro as string)
                : 0

            // Mantener solo las anteriores al apagar el switch
            return registrationDate < muteCutoff
        })

        return visibleNotifications.map((notification) => {
            const style = getNotificationStyle(notification?.tipo)
            return {
                id: String(notification?.bandeja_notificaciones_id),
                icon: style.icon,
                bgColor: style.bgColor,
                iconColor: style.iconColor,
                title: style.title,
                description: notification?.mensaje ?? "",
                date: notification?.fecha_registro ? formatDateShort(notification.fecha_registro as string) : "",
                unread: !notification?.leido,
            }
        })
    }, [data, switchOffAtByType])

    const handleMarkRead = useCallback(
        (notificationId: string) =>
            markNotificationAsRead({
                variables: { bandejaNotificacionId: notificationId },
                optimisticResponse: { marcar_como_leida: true },
                refetchQueries: [
                    {
                        query: ObtenerBandejaNotificacionesDocument,
                        variables: { usuarioId: [userId], hotelId: [hotel_id] },
                    },
                ],
            }),
        [markNotificationAsRead, userId, hotel_id]
    )

    return (
        <>
            <NotificationsHeader />
            <div className="h-[calc(100%-72px)] overflow-y-scroll">
                {loading ? (
                    <NotificationSkeleton />
                ) : notificationItems.length > 0 ? (
                    <NotificationList items={notificationItems} onMarkRead={handleMarkRead} />
                ) : (
                    <NotificationEmpty />
                )}
            </div>
        </>
    )
}

export default Notifications
