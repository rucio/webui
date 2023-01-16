import './navigation.scss'

import { Link } from 'react-router-dom'

export const Navbar = ({ active, menuItems }: NavProps) => {
    return (
        <nav
            className="rucio-navbar SideNav border"
            style={{
                width: active === true ? 350 : 150,
                zIndex: 999,
                visibility: active === true ? 'visible' : 'hidden',
                opacity: active === true ? 1 : 0,
            }}
        >
            {menuItems?.map(
                (
                    element: { route: string; display: any; click: any },
                    index: number,
                ) => (
                    <Link
                        to={element?.route}
                        className="SideNav-item"
                        key={index}
                        onClick={element?.click}
                    >
                        {element?.display}
                    </Link>
                ),
            )}
        </nav>
    )
}
