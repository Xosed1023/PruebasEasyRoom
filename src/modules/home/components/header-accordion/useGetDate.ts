import { useEffect, useState } from "react";

const MONTHS_ES_SHORT = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

type Options = {
  timeZone?: string; // ej: "America/Mexico_City"
  locale?: string;   // ej: "es-ES"
};

function formatNow({ timeZone, locale = "es-MX" }: Options = {}) {
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour12: false,
    year: "2-digit",
    month: "numeric",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date());

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find(p => p.type === type)?.value ?? "";

  const day = get("day").padStart(2, "0");
  const monthNum = Math.max(1, Math.min(12, Number(get("month") || 1)));
  const month = MONTHS_ES_SHORT[monthNum - 1];
  const year = get("year").padStart(2, "0");
  const hour = get("hour").padStart(2, "0");
  const minute = get("minute").padStart(2, "0");
  const second = get("second").padStart(2, "0");

  return {date: `${day}/${month}/${year}`, timer: `${hour}:${minute}:${second}`};
}

export function useFormattedDate(options?: Options) {
  const [now, setNow] = useState(() => formatNow(options));

  useEffect(() => {
    // actualiza inmediatamente si cambian las opciones
    setNow(formatNow(options));
    const id = setInterval(() => setNow(formatNow(options)), 1000);
    return () => clearInterval(id);
  }, [options?.timeZone, options?.locale]);

  return now;
}
