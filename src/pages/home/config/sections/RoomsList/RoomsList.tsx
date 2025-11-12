import { ListItem } from "../../constants/initRoomsList"
import './RoomsList.css'

const RoomsList = ({ roomsList }: { roomsList: ListItem[] }) => {

    return (
        <div className="config-rooms__rooms-to-drag">
            {roomsList
                .filter((item) => !item.selected)
                .map((item) => (
                    <div
                        key={item.id}
                        style={{ width: "100px", backgroundColor: "gray", cursor: "pointer" }}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("roomListItemId", item.id)}
                    >
                        Habitación: {item.tipo} {item.num_hab}
                    </div>
                ))}
        </div>
    )
}

export default RoomsList
