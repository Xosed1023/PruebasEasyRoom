export function getPercent(base: number, max: number): number {
    const percent = base > 0 && max > 0 ? Number(Math.round((base * 100) / max) || 0) : 0
    return percent
}
