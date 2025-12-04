import { getSafeAreaInsetBottom } from '@/helpers/getSafeAreaInsetBottom'
import Icon, { IconNamesProps } from '@/icons'

const FloatButton = ({iconName, onClick}: {iconName: IconNamesProps["name"], onClick: () => void}) => {
  return (
    <div className='h-[60px] w-[60px] bg-primary absolute right-[35px] bottom-[114px] rounded-4xl flex items-center justify-center z-10' style={{
      marginBottom: getSafeAreaInsetBottom()
    }} onClick={onClick}>
        <Icon name={iconName} width={28} height={28} color='var(--white)' />
    </div>
  )
}

export default FloatButton
