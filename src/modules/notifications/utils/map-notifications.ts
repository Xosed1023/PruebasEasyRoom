import { formatDateShort } from "@/utils/formatDate";
import { getNotificationStyle } from "../utils/notification-style";
import type { NotificationItem } from "../pages/notification-list/Notification.type";
import type { ObtenerBandejaNotificacionesQuery } from "@/gql/schema";

export const mapNotificationsToUI = (
  rows: NonNullable<ObtenerBandejaNotificacionesQuery["obtener_bandeja_notificaciones"]>
): NotificationItem[] =>
  rows.map((n) => {
    const { icon, title, bgColor, iconColor } = getNotificationStyle(n?.tipo);
    return {
      id: String(n?.bandeja_notificaciones_id),
      icon,
      bgColor,
      iconColor,
      title,
      description: n?.mensaje ?? "",
      date: n?.fecha_registro ? formatDateShort(n.fecha_registro as string) : "",
      unread: !n?.leido,
    };
  });
