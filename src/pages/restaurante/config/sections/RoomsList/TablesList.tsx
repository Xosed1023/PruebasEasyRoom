import { ListItem } from '../../constants/initTablesList'
import './TablesList.css'

const TablesList = ({ tablesList }: { tablesList: ListItem[] }) => {

    return (
        <div className="config-tables__tables-to-drag">
            {tablesList
                .filter((item) => !item.selected)
                .map((item) => (
                    <div
                        key={item.id}
                        style={{ width: "100px", backgroundColor: "gray", cursor: "pointer" }}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("roomListItemId", item.id)}
                    >
                        Habitación: {item.num_hab}
                    </div>
                ))}
        </div>
    )
}

export default TablesList
