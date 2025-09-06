import { FunctionComponent, PropsWithChildren } from "react"
import { Navbar } from "..";
const BaseLayout:FunctionComponent<PropsWithChildren> = ({children}) => {
    return (
        <>
            <Navbar/>
            <div className="py-16 bg-gray-50 overflow-hidden min-h-screen">
                <div>
                    {children}
                </div>
            </div>
        </>
    )
}

export default BaseLayout;