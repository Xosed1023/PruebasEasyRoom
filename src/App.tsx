import { Outlet, Route, Routes } from "react-router"

// wrappers
import PublicRoute from "./router/Public"
import PrivateRoute from "./router/Private"

// auth pages
import Login from "./modules/auth/login/Login"
import ForgotPassword from "./modules/auth/forgot-password/Forgot"
import ChangePassword from "./modules/auth/change-password/ChangePassword"

// pages
import Home from "./modules/home/Home"
import TotalDailyIncome from "./modules/home/pages/total-daily-income/TotalDailyIncome"
import Cortes from "./modules/cortes/Cortes"
import TurnCut from "./modules/cortes/pages/turn-cut/TurnCut"
import Notifications from "./modules/notifications/Notifications"
import ProfileChangePassword from "./modules/perfil/pages/change-password/ChangePassword"
import DayCut from "./modules/cortes/pages/day-cut/DayCut"
import MonthCut from "./modules/cortes/pages/month-cut/MonthCut"
import TurnCutScreen from "./modules/cortes/pages/turn-cut-screen/TurnCutScreen"
import Hotels from "./modules/hotels/Hotels"
import Expenses from "./modules/expenses/Expenses"
import Incidences from "./modules/incidences/Incidences"
import Profile from "./modules/perfil/Perfil"
import IncidenceNew from "./modules/incidences/pages/incidence-new/IncidenceNew"
import IncidenceForm from "./modules/incidences/pages/incidence-form/IncidenceForm"
import DayCutScreen from "./modules/cortes/pages/day-cut-screen/DayCutScreen"
import MonthCutScreen from "./modules/cortes/pages/month-cut-screen/MonthCutScreen"
import WrapperMobile from "./components/core/layout/wrapper-mobile/WrapperMobile"
import RangeCut from "./modules/cortes/pages/range-cut/RangeCut"
import RangeCutScreen from "./modules/cortes/pages/range-cut-screen/RangeCutScreen"
import { PushNotifications } from "@capacitor/push-notifications"
import { FCM } from "@capacitor-community/fcm"

// listener hooks
import { useUserDataListener } from "./hooks/app-listener/useUserDataListener"
import Error from "./modules/error/Error"
import { useEffect, useState } from "react"
import PullToRefreshLoader from "./components/ui/loader/SmartPullToRefresh"
import { useApolloClient } from "@apollo/client"
import { useNetwork } from "./hooks/network/useNetwork"
import SnackbarOffline from "./components/core/data-display/snack-bar/SnackbarOffline"
import { useProfile } from "./hooks/store/useProfile"
import { useNotificacionesQuery } from "./gql/schema"

function Pages() {
    const { hotel_id } = useProfile(); 
  const { data, loading } = useNotificacionesQuery({
    variables: { hotelIds: hotel_id ? [hotel_id] : [] },
    skip: !hotel_id, // evita la query si aún no hay hotel_id
  });
    const requestPermission = async () => {
        PushNotifications.requestPermissions().then((result) => {
            if (result.receive === "granted") {
                PushNotifications.register()
            }
        })

        PushNotifications.addListener("registration", () => {
            if (!loading && data?.notificaciones?.length) {
                const topics = data.notificaciones.map((n) => n.topic)

                topics.forEach((topic) => {
                    FCM.subscribeTo({ topic })
                        .then(() => console.log("Subscribed to topic:", topic))
                        .catch((e) => console.error("Error subscribing:", e))
                })
            } else {
                console.warn("⚠️ No topics found or query still loading")
            }
        })

        PushNotifications.addListener("pushNotificationReceived", (notification) => {
            console.log("Push received: ", notification)
        })
    }

    useEffect(() => {
        requestPermission()
    }, [])

    return (
        <Routes>
            <Route
                index
                path="/"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route path="/auth">
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="change-password" element={<ChangePassword />} />
            </Route>
            <Route
                path="/u"
                element={
                    <PrivateRoute>
                        <Outlet />
                    </PrivateRoute>
                }
            >
                <Route path="home/:hotel_id" element={<Outlet />}>
                    <Route path="" element={<Home />} />
                    <Route path="daily-income" element={<TotalDailyIncome />} />
                </Route>
                <Route path="hotels" element={<Hotels />} />
                <Route path="cortes/:hotel_id" element={<Outlet />}>
                    <Route path="" element={<Cortes />} />
                    <Route path="turn" element={<Outlet />}>
                        <Route path="" element={<TurnCut />} />
                        <Route path="pdf/:cut_id" element={<TurnCutScreen />} />
                    </Route>
                    <Route path="day" element={<Outlet />}>
                        <Route path="" element={<DayCut />} />
                        <Route path="pdf/:cut_dates" element={<DayCutScreen />} />
                    </Route>
                    <Route path="range" element={<Outlet />}>
                        <Route path="" element={<RangeCut />} />
                        <Route path="pdf/:cut_id" element={<RangeCutScreen />} />
                    </Route>
                    <Route path="month" element={<Outlet />}>
                        <Route path="" element={<MonthCut />} />
                        <Route path="pdf/:month/:year" element={<MonthCutScreen />} />
                    </Route>
                </Route>
                <Route path="expenses/:hotel_id" element={<Expenses />} />
                <Route path="notifications/:hotel_id" element={<Notifications />} />
                <Route path="incidences/:hotel_id" element={<Outlet />}>
                    <Route path="" element={<Incidences />} />
                    <Route path="new" element={<IncidenceNew />} />
                    <Route path="new/form" element={<IncidenceForm />} />
                </Route>
                <Route path="profile" element={<Outlet />}>
                    <Route path="" element={<Profile />} />
                    <Route path="change-password" element={<ProfileChangePassword />} />
                    <Route path="forgot-password" element={<ForgotPassword withSession={true} />} />
                </Route>
            </Route>
            <Route path="*" element={<Error />} />
        </Routes>
    )
}

function App() {
    const { onLine } = useNetwork()

    //Hook para actualizar información de los usuarios en distintas sesiones
    useUserDataListener()

    const client = useApolloClient()
    const [refreshKey, setRefreshKey] = useState(0)

    const handleGlobalRefresh = async () => {
        //Mostrar tu loader
        const loader = document.createElement("div")
        loader.className = "loader-wrapper"
        const circle = document.createElement("div")
        circle.className = "custom-loader-mobile"
        loader.appendChild(circle)

        const header = document.querySelector("header, .header, [class*='Header']") as HTMLElement | null
        header?.insertAdjacentElement("afterend", loader)

        await new Promise((resolve) => setTimeout(resolve, 400))
        //Refrescar queries de Apollo
        await client.reFetchObservableQueries()
        // actualiza pagina
        setRefreshKey((prev) => prev + 1)
        loader.remove()
    }

    return (
        <WrapperMobile>
            <PullToRefreshLoader onRefresh={handleGlobalRefresh}>
                <Pages key={refreshKey} />
                {!onLine && <SnackbarOffline />}
            </PullToRefreshLoader>
        </WrapperMobile>
    )
}

export default App
