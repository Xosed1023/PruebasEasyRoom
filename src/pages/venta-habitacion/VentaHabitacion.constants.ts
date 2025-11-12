import { PAYMENT_METHODS } from "src/constants/payments"
import { useModulos } from "src/shared/hooks/useModulos"
import { useProfile } from "src/shared/hooks/useProfile"
// import { formatShortDate } from "src/shared/helpers/formatShortDate"

export const defaultRoomId = "97a877dc-d425-4979-a834-e51f1a58c1a7"

export const defaultItems = [
    {
        icon: "openDoor",
    },
    {
        icon: "BedFilled",
    },
    {
        icon: "UserParentFill",
    },
    {
        icon: "userAdd",
    },
]

export const scheduleTypes = [
    { label: "Por horas", value: "motel", icon: "timer" },
    { label: "Por noche", value: "hotel", icon: "calendar" },
]

export const entryTypes = [
    { label: "A pie", value: "A_Pie", icon: "runner" },
    { label: "Con auto", value: "Auto", icon: "car" },
]

export const defaultValues = {
    type: scheduleTypes[0].value,
    date: "",
    amount: "",
    extraHours: 0,
    name: "",
    entryType: entryTypes[0].value,
    carId: "",
    users: 0,
    extraUsers: 0,
    extra: [],
    costs: {
        room: 0,
        users: 0,
        hours: 0,
        tax: 0,
        total: 0,
        general: 0,
    },
}

export const stateDefault = {
    extraHours: 0,
    extraUsers: 0,
    extraHoursCost: 0,
    extraUsersCost: 0,
    duraction: 0,
}

export const dataDefault = {
    roomNumber: "",
    extraUsersMax: 0,
    rateList: [],
}

export const inputIconStyle = {
    color: "var(--header-dark)",
    height: 16,
    width: 16,
}
export const paymentTypes = [
    { label: "Total", value: "total" },
    { label: "Parcial", value: "parcial" },
    { label: "Pendiente", value: "pendiente" },
];
const usePaymentOptions = () => {
    const { easyRewards: withEasyrewards } = useModulos();
    const { rolName } = useProfile(); 

    const paymentOptions = [
        PAYMENT_METHODS.efectivo,
        PAYMENT_METHODS.visaOMasterCard,
        PAYMENT_METHODS.amex,
        PAYMENT_METHODS.depositoOTransferencia,
        PAYMENT_METHODS.mixto,
        ...(withEasyrewards ? [PAYMENT_METHODS.lovePoints] : []),
        PAYMENT_METHODS.cortesia,
        PAYMENT_METHODS.consumoInterno,
        PAYMENT_METHODS.pendiente
    ];

    return rolName === "VALETPARKING"
        ? paymentOptions
        : paymentOptions.filter((method) => method !== PAYMENT_METHODS.pendiente);
};

export default usePaymentOptions;


