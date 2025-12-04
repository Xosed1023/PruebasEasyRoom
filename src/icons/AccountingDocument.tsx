import { IconProps } from "./Icon.type"

const AccountingDocument = ({ color = "#000", ...props }: IconProps) => {
    return (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M23.5625 23.5625C23.5625 23.9935 23.3913 24.4068 23.0865 24.7115C22.7818 25.0163 22.3685 25.1875 21.9375 25.1875H4.0625C3.63152 25.1875 3.2182 25.0163 2.91345 24.7115C2.6087 24.4068 2.4375 23.9935 2.4375 23.5625V2.4375C2.4375 2.00652 2.6087 1.5932 2.91345 1.28845C3.2182 0.983705 3.63152 0.8125 4.0625 0.8125H15.5773C16.0079 0.812592 16.421 0.983647 16.7256 1.28808L23.0869 7.64942C23.3914 7.95405 23.5624 8.36707 23.5625 8.79775V23.5625Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M23.5625 8.9375H17.0625C16.6315 8.9375 16.2182 8.7663 15.9135 8.46155C15.6087 8.1568 15.4375 7.74348 15.4375 7.3125V0.8125"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.71667 12.5605C6.95128 12.8686 7.25673 13.1157 7.60711 13.2807C7.9575 13.4457 8.34251 13.5238 8.7295 13.5084C9.96342 13.5084 10.9644 12.7576 10.9644 11.8325C10.9644 10.9073 9.96667 10.1576 8.73383 10.1576C7.501 10.1576 6.5 9.40687 6.5 8.48062C6.5 7.55437 7.501 6.80471 8.73383 6.80471C9.12086 6.78902 9.50596 6.86701 9.8564 7.03204C10.2068 7.19707 10.5122 7.44427 10.7467 7.75262"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.73438 13.5078V14.6247"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.73438 5.6875V6.80442"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M13 16.25H19.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M7.3125 21.125H19.5"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default AccountingDocument
