import Icon from "@/icons";

export type NotificationGroup = "incidencias" | "cortes" | "habitaciones" | "gastos";

export const GROUP_META: Record<
  "incidencias" | "cortes" | "habitaciones" | "gastos",
  { icon: React.ComponentProps<typeof Icon>["name"]; title: string; bgColor: string; iconColor: string }
> = {
  incidencias:  { icon: "AlertLine", title: "Incidencias",  bgColor: "#FDEFCB", iconColor: "#DC6803" },
  cortes:       { icon: "Analysis",  title: "Cortes",       bgColor: "#DBF6D4", iconColor: "#408232" },
  habitaciones: { icon: "BedRoom",   title: "Habitaciones", bgColor: "#F3EFFF", iconColor: "#7F56D9" },
  gastos:       { icon: "Wallet",    title: "Gastos",       bgColor: "#D6EEF9", iconColor: "#5374AE" },
};

const FALLBACK = { icon: "AlertLine" as const, title: "Notificación", bgColor: "#EEF2F7", iconColor: "#667085" };

export const getNotificationStyle = (rawTipo?: string) => {
  const group = (rawTipo ?? "").toLowerCase().split("_")[0] as keyof typeof GROUP_META;
  return GROUP_META[group] ?? FALLBACK;
};

export const SUBTYPE_LABEL: Record<string, string> = {
  incidencias_incidencias_altas: "Incidencias altas",
  cortes_cortes_diarios: "Cortes diarios",  
  cortes_caratula_mensual: "Carátula mensual",
  habitaciones_ocupacion_maxima_alcanzada: "Ocupación máxima alcanzada",
  habitaciones_sin_habitaciones_disponibles: "Sin habitaciones disponibles",
  gastos_presupuesto_excedido: "Presupuesto excedido",
};

export type NotificationSubtype = keyof typeof SUBTYPE_LABEL;

export const SUBTYPES_BY_GROUP: Record<NotificationGroup, NotificationSubtype[]> = {
  incidencias:  ["incidencias_incidencias_altas"],
  cortes:       ["cortes_cortes_diarios", "cortes_caratula_mensual"],
  habitaciones: ["habitaciones_ocupacion_maxima_alcanzada", "habitaciones_sin_habitaciones_disponibles"],
  gastos:       ["gastos_presupuesto_excedido"],
};



