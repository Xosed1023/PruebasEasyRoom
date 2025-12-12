import { memo } from "react";
import { IconProps } from "./interfaces/IconProps.interface";

const shieldCheck = memo(({ color = "#667085", ...rest }: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none" {...rest}>
            <g>
                <path
                    d="M8.99857 1.55331L15.1605 2.9732C15.5032 3.05252 15.7476 3.36745 15.7476 3.73214V11.498C15.7476 13.0578 14.9955 14.5151 13.7439 15.3797L8.99857 18.6604L4.25323 15.3797C3.00091 14.5143 2.24951 13.0578 2.24951 11.4988V3.73214C2.24951 3.36745 2.49398 3.05252 2.83668 2.9732L8.99857 1.55331Z"
                    fill="white"
                />
                <path
                    d="M12.3371 7.16911L8.62512 11.0174L6.50442 8.81839L5.44407 9.91791L8.62587 13.2173L13.3982 8.26863L12.3371 7.16911V7.16911Z"
                    fill="#6941C6" 
                />
            </g>
            <defs>
                <clipPath id="clip0_1674_18329">
                    <rect width="17.9975" height="18.6623" fill="white" transform="translate(0 0.775726)" />
                </clipPath>
            </defs>
        </svg>
    );
});

export default shieldCheck;
