/* eslint-disable react/prop-types */
import { Link, useLocation } from 'react-router-dom';

const NavBar = ({ theme }) => {
    const NAV_ITEMS = [
        { href: '/', label: 'Home' },
        { href: '/login', label: 'Log In' },
        { href: '/signup', label: 'Sign Up' },
        { href: '/contact', label: 'Contact Us' },
    ];

    let location = useLocation();

    return (
        <nav
            className="w-full h-16 flex justify-center items-center fixed top-0 left-0 z-50"
            style={
                theme == 'primary'
                    ? { backgroundColor: '#4F1ABE', color: 'white' }
                    : { backgroundColor: '#ffffff', color: 'black' }
            }
        >
            <div className="w-5/6 h-full flex justify-between items-center">
                <div>
                    <h1 className="font-black text-xl">
                        <Link to={'/'}>PYE</Link>
                    </h1>
                </div>
                <ul className="flex-row hidden sm:flex">
                    {NAV_ITEMS.map(({ href, label }, index) => {
                        const isActive = location.pathname === href;

                        return (
                            <li key={index}>
                                <Link
                                    to={href}
                                    className={`ml-8 focus:outline-none ${
                                        isActive ? 'font-semibold' : ''
                                    }`}
                                >
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
