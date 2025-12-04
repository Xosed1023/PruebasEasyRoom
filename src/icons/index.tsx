import { IconProps } from "./Icon.type"
import Mail from "./Mail"
import Lock from "./Lock"
import EyeOff from "./EyeOff"
import EyeOn from "./EyeOn"
import Analysis from "./Analysis"
import BedRoom from "./BedRoom"
import Home from "./Home"
import CoinFill from "./CoinFill"
import AlertLine from "./AlertLine"
import Wallet from "./Wallet"
import AlertFill from "./AlertFill"
import Coin from "./Coin"
import Settings from "./Settings"
import Close from "./Close"
import LockLine from "./LockLine"
import Logout from "./Logout"
import Pencil from "./Pencil"
import Plus from "./Plus"
import Camera from "./Camera"
import Picture from "./Picture"
import Trash from "./Trash"
import Unlocked from "./Unlocked"
import FilterFunnel from "./FilterFunnel"
import { Building } from "lucide-react"
import UserFill from "./UserFill"
import User from "./User"
import CameraOff from "./CameraOff"
import ArrowLeft from "./ArrowLeft"
import Calendar from "./Calendar"
import CalendarFill from "./CalendarFill"
import Clock from "./Clock"
import Check from "./Check"
import CameraPlus from "./CameraPlus"
import ChevronDown from "./ChevronDown"
import UserIncidences from "./UserIncidences"
import Car from "./Car"
import SocialGoogle from "./SocialGoogle"
import Download from "./Download"
import IconLoader from "./IconLoader"
import SearchWatch from "./SearchWatch"

const COLLECTION = {
    Mail,
    Lock,
    EyeOff,
    EyeOn,
    AlertLine,
    Analysis,
    BedRoom,
    Wallet,
    Home,
    CoinFill,
    AlertFill,
    Coin,
    Settings,
    Close,
    Pencil,
    Plus,
    LockLine,
    Logout,
    Camera,
    Picture,
    Trash,
    Unlocked,
    FilterFunnel,
    Building,
    UserFill,
    User,
    CameraOff,
    ArrowLeft,
    Calendar,
    CalendarFill,
    Clock,
    Check,
    CameraPlus,
    ChevronDown,
    UserIncidences,
    Car,
    SocialGoogle,
    Download,
    IconLoader,
    SearchWatch,
}

export interface IconNamesProps extends IconProps {
    name: keyof typeof COLLECTION | (string & {})
}

function Icon({ name = "", ...rest }: IconNamesProps) {
    const docs: any = COLLECTION
    const IconComponent =
        name && docs[name]
            ? docs[name]
            : () => <div style={{ height: "1rem", width: "1rem", backgroundColor: "transparent", gap: "10px" }} />

    return <IconComponent {...rest} />
}

export default Icon
