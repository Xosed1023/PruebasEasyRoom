import { useMemo } from "react"
import { IconNameType } from "../types/IconNameType"
import { RoleNames } from "./useAuth";

export const useMenuItems = (rolName, withEasyrewards, navigate, openModal) => {
    return useMemo<{ label: string; icon: IconNameType; onClick: () => void }[]>(() => {
        if (rolName === RoleNames.valet || rolName === RoleNames.restaurante) {
            return [...(withEasyrewards ? [{ label: "Easyrewards", icon: "giftFill", onClick: openModal }] : [])]
        }
        if (rolName === RoleNames.cocina) {
            return [{ label: "Inventario", icon: "packageFill", onClick: () => navigate("/u/inventario") }]
        }
        if (rolName === RoleNames.roomService) {
            return [
                { label: "Incidencias", icon: "spamFill", onClick: () => navigate("/u/incidencias") },
                ...(withEasyrewards ? [{ label: "Easyrewards", icon: "giftFill", onClick: openModal }] : []),
            ]
        }
        if (rolName === RoleNames.mantenimiento) {
            return [
                { label: "Enérgeticos", icon: "waterFlashFill", onClick: () => navigate("/u/mantenimiento") },
                { label: "Incidencias", icon: "spamFill", onClick: () => navigate("/u/incidencias") },
            ]
        }
        if (rolName === RoleNames.monitoreo) {
            return [
                { label: "Incidencias", icon: "spamFill", onClick: () => navigate("/u/incidencias") },
                { label: "Cortes", icon: "changeDollar", onClick: () => navigate("/u/cortes") },
            ]
        }
        return [
            { label: "Gastos", icon: "coinsFill", onClick: () => navigate("/u/gastos/table") },
            { label: "Cortes", icon: "changeDollar", onClick: () => navigate("/u/cortes") },
            { label: "Inventario", icon: "packageFill", onClick: () => navigate("/u/inventario") },
            { label: "Incidencias", icon: "spamFill", onClick: () => navigate("/u/incidencias") },
            { label: "Propinas", icon: "HandCoinFilled", onClick: () => navigate("/u/propinas") },
            ...(withEasyrewards ? [{ label: "Easyrewards", icon: "giftFill", onClick: openModal }] : []),
            { label: "Mantenimiento", icon: "tools", onClick: () => navigate("/u/mantenimiento") },
            { label: "Reportes", icon: "PieChartFilled", onClick: () => navigate("/u/reports") },
        ]
    }, [rolName, withEasyrewards, navigate, openModal])
}
