export interface SalesItemProps {
    title: string
    percentage: string | number
    items: { name: string; value: string | number }[]
    dotClass: string
}
