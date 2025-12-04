export const normalizeOrigen = (
  value?: string | null
): "instalaciones" | "habitaciones" | "huesped" => {
  const v = (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 

  if (v.includes("huesped")) return "huesped"
  if (v.includes("habitacion")) return "habitaciones"
  return "instalaciones"
}

export const normalizeTurno = (value?: string | null): "matutino" | "vespertino" | "nocturno" => {
  const v = (value || "").toLowerCase()
  if (v === "vespertino") return "vespertino"
  if (v === "nocturno") return "nocturno"
  return "matutino"
}

export const normalizeUrgencia = (value?: string | null): "alta" | "media" | "baja" => {
  const v = (value || "").toLowerCase()
  if (v === "alta" || v === "baja") return v
  return "media"
}
export const normalizePrioridad = (value?: string | null): "alta" | "media" | "baja" => {
  const v = value?.toLowerCase()
  return v === "alta" || v === "baja" ? v : "media"
}
