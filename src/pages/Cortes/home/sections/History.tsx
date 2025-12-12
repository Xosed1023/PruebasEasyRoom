import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useEffectMouseDown } from "src/shared/hooks/handle-mousedown"
import { useDate } from "src/shared/hooks/useDate"
import ChevronUp from "src/shared/icons/ChevronUp"
import InputDateModal from "src/shared/components/forms/input-date/sections/InputDateModal/InputDateModal"
import "src/shared/components/forms/input-tabs/InputTabs.css"

type Option = {
    label: string
    onClick: () => void
}

export function Drop({ options = [], title = "Historial", width }: { options: Option[]; title?: string, width?: string }): JSX.Element {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState<boolean>(false)

    useEffectMouseDown(ref, () => setVisible(false))

    return (
        <div style={{ position: "relative", marginRight: 15 }}>
            <div
                className="input-tab input-tab--active"
                style={{
                    height: 40,
                    width: width ? width : 110,
                    fontSize: 12,
                    padding: "8px 7px 8px 15px",
                    color: "var(--primary)",
                    backgroundColor: "var(--white)",
                    justifyContent: "space-between",
                }}
                onClick={() => setVisible(true)}
            >
                <span style={{ fontFamily: "var(--font-third)", fontWeight: 400 }}>{title}</span>
                <ChevronUp style={{ transform: `rotate(${visible ? 180 : 0}deg)` }} />
            </div>
            <div className="cortes-screen__history-drop__wrapper">
                <div
                    ref={ref}
                    style={{
                        display: visible ? "block" : "none",
                    }}
                    className="cortes-screen__history-drop"
                >
                    {options.map(({ label, onClick }, index) => (
                        <div
                            key={index}
                            className="cortes-screen__history-item"
                            onClick={() => {
                                setVisible(false)
                                onClick()
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function History(): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)
    const [value, setValue] = useState<Date[]>([])
    const navigate = useNavigate()

    const { areSameDay } = useDate()

    return (
        <>
            <Drop
                options={[
                    // { label: "Cierre mensual", onClick: () => navigate("/u/cortes/caratula/mensual") },
                    { label: "Corte por fechas", onClick: () => setVisible(true) },
                ]}
            />
            <InputDateModal
                isOpen={visible}
                height={"65dvh"}
                width={"494px"}
                onClose={() => setVisible(false)}
                onConfirm={() => {
                    if (!value?.length || value?.length < 1) {
                        return
                    }
                    setVisible(false)
                    navigate(
                        `/u/cortes/caratula/fecha/${value?.[0]?.toISOString()}${
                            value?.[1] ? `&${value?.[1]?.toISOString()}` : ""
                        }`
                    )
                }}
                onReset={() => setValue([])}
                isRange={true}
                onChange={(date) => {
                    if (value.length === 0 || date <= value[0]) {
                        setValue([date])
                        return
                    }
                    if (value?.length === 2 && areSameDay(new Date(), date)) {
                        setValue([date])
                        return
                    }
                    if (value?.length === 2) {
                        setValue([])
                        return
                    }
                    setValue([value[0], date])
                }}
                value={value}
            />
        </>
    )
}

export default History
