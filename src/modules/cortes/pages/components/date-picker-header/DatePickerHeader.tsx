import { ReactNode } from 'react'
import styles from './DatePickerHeader.module.css'
import { cn } from '@/lib/utils'

const DatePickerHeader = ({title, back, next}: {title: string, back?: ReactNode, next?: ReactNode}) => {
  return (
    <div className='flex justify-between w-full'>
        {back || <div className='flex-1'></div>}
        <span className={cn(styles["date-picker-header__text"])}>{title}</span>
        {next || <div></div>}
    </div>
    
  )
}

export default DatePickerHeader