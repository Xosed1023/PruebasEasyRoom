import "./CardReport.css"

const CardReport = ({ title, value }: { title: string; value: string | number }) => {
    return (
        <div className="card-report">
            <span className="card-report__title">{title}</span>
            <span className="card-report__value">{value}</span>
        </div>
    )
}

export const CardReportResume = ({
    title1,
    value1,
    title2,
    value2,
}: {
    title1: string
    value1: string | number
    title2: string
    value2: string | number
}) => {
    return (
        <div className="card-report--double">
            <span className="card-report__title">{title1}</span>
            <span className="card-report--double__value">{value1}</span>
            <div className="card-report--resume">
                <span className="card-report--resume__value">{value2}</span>
                <span className="card-report--resume__title">{title2}</span>
            </div>
        </div>
    )
}

export const CardReportDouble = ({
    title1,
    value1,
    title2,
    value2,
}: {
    title1: string
    value1: string | number
    title2: string
    value2: string | number
}) => {
    return (
        <div className="card-report--double">
            <span className="card-report__title">{title1}</span>
            <span className="card-report--double__value">{value1}</span>
            <span className="card-report__title">{title2}</span>
            <span className="card-report--double__value">{value2}</span>
        </div>
    )
}

export default CardReport
