import { useState } from "react"
import { MemoryRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"

const list = [
    { label: "Elemento 1", path: "/1", number: 3452 },
    { label: "Elemento 2", path: "/2", number: 2 },
    { label: "Elemento 3", path: "/3", number: 1 },
    { label: "Sin elementos", path: "/4", number: 0 },
]

export const props = {
    className: "",
    style: {},
    tabList: list,
    value: list[0].path,
    fullscreen: false,
}

export function RouterWrapper({ children }) {
    return (
        <MemoryRouter>
            <Routes>
                <Route index path="/" element={<Navigate to={"/"} />} />
                <Route path="/:key" element={children} />
            </Routes>
        </MemoryRouter>
    )
}

export const TabsWithRouter = (args) => {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    return (
        <section className="section'stori">
            <div className="container-info-nav">
                <div>
                    <p>{JSON.stringify(list.find(({ path }) => path === pathname))}</p>
                </div>
            </div>
            <TabMenu {...args} value={pathname} onChange={(path) => navigate(path)} />
        </section>
    )
}

export const TabsWithState = (args) => {
    const [pathname, setPath] = useState<string>(list[0].path)
    return (
        <section>
            <TabMenu {...args} value={pathname} onChange={(path) => setPath(path)} />
            <div>
                <p>{JSON.stringify(list.find(({ path }) => path === pathname))}</p>
            </div>
        </section>
    )
}
