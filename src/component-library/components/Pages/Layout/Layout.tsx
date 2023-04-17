import { TextInput } from "../../Input/TextInput"

export const Layout = (
    props: {
        child: React.ReactNode
    }
) => {
    return (
        <div>
            <header
                className="w-full h-16 bg-gray-800 p-2"
            >
                <nav
                    className="w-full h-full flex justify-between items-center"
                >
                    <span className="flex flex-row space-x-2">
                        <a className="bg-green-500 w-12 h-12"/>
                        <a className="bg-purple-500 w-12 h-12"/>
                    </span>
                    <span className="flex space-x-2 items-center">
                        <TextInput
                            placeholder="Search"
                            className="w-96 pb-2 rounded-lg"
                        />
                        <a className="text-white">Hi</a>
                        <a className="text-white">Hi</a>
                        <a className="text-white">Hi</a>
                    </span>
                    <span className="flex space-x-2 items-end">
                        <a className="text-white">Notifications</a>
                        <a className="text-white">Account</a>
                    </span>
                </nav>
            </header>
            <main>
                {props.child}
            </main>
        </div>
    )
}