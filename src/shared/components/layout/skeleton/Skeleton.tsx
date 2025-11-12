import { ItemProps, Props } from "./Skeleton.type"
import "./Skeleton.css"

function range(start: number, end: number): number[] {
    let array: number[] = []

    for (let i = start; i <= end; i++) {
        array = [...array, i]
    }

    return array
}

function Item(props: ItemProps): JSX.Element {
    const { className = "", style = {}, drawer = false } = props
    return <div className={`${className} ${drawer ? "skeleton-item-base-drawer" : "skeleton-item-base"} `} style={style}></div>
}

function Skeleton(props: Props): JSX.Element {
    const { className = "", style = {}, elements = 1, drawer = false } = props
    return (
        <div className={`${className} skeleton-base`} style={style}>
            {range(1, elements).map((number: number) => (
                <Item className="skeleton-item" key={number} drawer={drawer}/>
            ))}
        </div>
    )
}

Skeleton.Item = Item

export default Skeleton
