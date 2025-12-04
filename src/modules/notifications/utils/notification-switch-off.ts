//Desde cuando está "apagado"
export type SwitchOffAtMap = Record<string, string>; 

const STORAGE_VERSION = "v2";
const keyFor = (userId: string, hotelId: string) =>
  `notifMuteSince:${STORAGE_VERSION}:${userId}:${hotelId}`;

// Lee lo guardado; si no hay nada, devuelve un objeto vacío
export const loadSwitchOff = (userId: string, hotelId: string): SwitchOffAtMap => {
  try {
    const raw = localStorage.getItem(keyFor(userId, hotelId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// Guarda el estado actual (lo que está apagado por tipo)
export const saveSwitchOff = (userId: string, hotelId: string, map: SwitchOffAtMap) => {
  localStorage.setItem(keyFor(userId, hotelId), JSON.stringify(map));
};
// Actualiza el estado según lo que se enciende/apaga
export const updateSwitchOffAt = (
  userId: string,
  hotelId: string,
  activar: string[],    
  desactivar: string[]    
) => {
  const nowISO = new Date().toISOString();
  const map = loadSwitchOff(userId, hotelId);

  desactivar.forEach((t) => { map[t] = nowISO; });
  activar.forEach((t) => { delete map[t]; });

  saveSwitchOff(userId, hotelId, map);
  return map;
};
