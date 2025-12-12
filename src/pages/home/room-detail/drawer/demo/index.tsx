import DrawerWrapper from "../../sections/DrawerWrapper"
import { HomeView } from "../../sections/views/Views"
import { useRoom } from "../../hooks"
import { Block } from "../../sections/elements/Elements"

function Demo(): JSX.Element {
    const data = useRoom()
    return (
        <DrawerWrapper>
            <HomeView>
                <Block style={{ height: "calc(100% - 76px)" }}>
                    <code>
                        <pre style={{ color: "var(--white)" }}>{JSON.stringify(data, null, 2)}</pre>
                    </code>
                </Block>
            </HomeView>
        </DrawerWrapper>
    )
}

export default Demo
