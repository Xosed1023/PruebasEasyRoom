import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"

function Home({ data = [] }: { data: any[] }): JSX.Element {
    return (
        <div className="detalle-receta__home__contain detalle-receta__box">
            {data.map(({ icon = "", value = "", label = "", link = "", onLink = undefined }, index) => (
                <DescriptionDetail key={index} icon={icon} value={value} label={label} link={link} onLink={onLink} />
            ))}
        </div>
    )
}

export default Home
