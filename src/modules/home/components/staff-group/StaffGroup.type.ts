export interface StaffGroupProps {
    title: string,
    items: {
        title: string,
        src?: string,
        subtitle
    }[]
    badgeColors: {
        bg: string,
        text: string
    }
}