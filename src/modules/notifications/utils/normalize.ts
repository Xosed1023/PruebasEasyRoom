export type NotiTipo = "incidencias" | "cortes" | "habitaciones" | "gastos" | "otro";

export const normalizeTipo = (tipo?: string): NotiTipo => {
  const t = (tipo || "").toLowerCase();
  if (t.startsWith("incidencias")) return "incidencias";
  if (t.startsWith("cortes")) return "cortes";
  if (t.startsWith("habitaciones")) return "habitaciones";
  if (t.startsWith("gastos")) return "gastos";
  return "otro";
};
