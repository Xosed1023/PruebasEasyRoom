import { IconProps } from "src/shared/icons/interfaces/IconProps.interface"

function Maintenance(props: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 12 12" fill="none" {...props}>
            <circle cx={6} cy={6} r={6} fill="#7A83A0" />
            <g clipPath="url(#a)">
                <path
                    fill="#fff"
                    d="M4.073 3.482a1.01 1.01 0 0 1 1.29 1.29l3.129 3.129-.612.612L4.75 5.385a1.01 1.01 0 0 1-1.29-1.291l.645.645a.433.433 0 1 0 .612-.612l-.645-.645Zm2.99.543.919-.51.408.408-.51.918-.51.102-.612.612-.408-.408.612-.612.102-.51ZM5.025 6.27l.612.612L4.208 8.31a.433.433 0 0 1-.64-.581l.028-.031 1.428-1.428Z"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M2.536 2.538H9.46v6.923H2.536z" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default Maintenance
