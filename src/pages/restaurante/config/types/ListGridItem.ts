export interface ListGridItem {
    id: string
    coord: {
        x: number
        y: number
    }
    selected: boolean
    listItemId?: string
}