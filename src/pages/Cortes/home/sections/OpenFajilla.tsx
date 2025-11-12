import { useNavigate } from "react-router-dom"

export const OpenFajilla = () => {
    const navigate = useNavigate()

    return (
        <div
            className="input-tab"
            style={{ height: 40, width: 110, fontSize: 14, marginRight: 10 }}
            onClick={() => navigate("/u/cortes/fajillas")}
        >
            {`Ver fajillas`}
        </div>
    )
}
