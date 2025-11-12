import { IconNamesProps } from "./Icon"

const coins02 = (props: IconNamesProps) => (
    <svg width="1em" height="1em" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M14.9377 14.9377C18.3603 14.4795 21 11.548 21 8C21 4.13401 17.866 1 14 1C10.452 1 7.52049 3.63967 7.06227 7.06227M6.5 12L8 11V16.5M6.5 16.5H9.5M15 14C15 17.866 11.866 21 8 21C4.13401 21 1 17.866 1 14C1 10.134 4.13401 7 8 7C11.866 7 15 10.134 15 14Z"
            stroke={props.color || "#000"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export default coins02
