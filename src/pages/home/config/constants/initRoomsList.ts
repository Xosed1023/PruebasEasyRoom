export interface ListItem {
    id: string
    num_hab: number
    selected: boolean
    tipo: string
    coord?: {
        x: number,
        y: number
    }
}
