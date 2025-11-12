export interface ListItem {
    id: string
    num_hab: string
    selected: boolean
    coord?: {
        x: number,
        y: number
    }
}
