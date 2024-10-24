import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdClose } from 'react-icons/io';
import { useState, useEffect } from 'react';
import { Box, List, ListItem, Collapse } from '@mui/material';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

axios.defaults.withCredentials = true; // Ensure Axios sends session cookies with requests

const NavBar = ({ theme }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    let location = useLocation();

    // Toggle the mobile menu
    const toggleMenu = (newVal) => () => {
        setMenuOpen(newVal);
    };

    // Check session state when NavBar loads
    const checkSession = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/session');
            if (response.data.isLoggedIn) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Error checking session:', error);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/logout');
            setIsLoggedIn(false);
            navigate('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    // Navigation items
    const NAV_ITEMS = [
        { href: '/', label: 'Home' },
        { href: '/contact', label: 'Contact Us' },
    ];

    const BurgerMenu = (
        <Box
            className={`w-[70%] h-screen flex flex-col fixed sm:hidden top-0 left-0 bg-white text-[#4F1ABE] z-50 ${
                !isMenuOpen ? 'hidden' : ''
            }`}
            role="presentation"
        >
            <List>
                {NAV_ITEMS.map(({ href, label }, index) => (
                    <ListItem disablePadding key={index}>
                        <Link
                            to={href}
                            className="w-full h-full px-4 py-4 hover:bg-[#A3A9FE80] transition-all"
                        >
                            {label}
                        </Link>
                    </ListItem>
                ))}

                {/* Dynamic Links based on login state */}
                {isLoggedIn ? (
                    <>
                        <ListItem disablePadding>
                            <button
                                onClick={handleLogout}
                                className="w-full h-full px-4 py-4 hover:bg-[#A3A9FE80] transition-all"
                            >
                                Logout
                            </button>
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem disablePadding>
                            <Link
                                to={'/login'}
                                className="w-full h-full px-4 py-4 hover:bg-[#A3A9FE80] transition-all"
                            >
                                Log In
                            </Link>
                        </ListItem>
                        <ListItem disablePadding>
                            <Link
                                to={'/signup'}
                                className="w-full h-full px-4 py-4 hover:bg-[#A3A9FE80] transition-all"
                            >
                                Sign Up
                            </Link>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <nav
                className="w-full h-20 flex justify-center items-center fixed top-0 left-0 z-50"
                style={
                    theme === 'primary'
                        ? {
                              backgroundImage: 'url(/assets/nav.png)', // Replace with your image path
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                              color: 'white',
                          }
                        : { backgroundColor: '#ffffff', color: 'black' }
                }
            >
                <div className="w-5/6 h-full flex justify-between items-center">
                    <div className="h-full flex items-center">
                        <Link to={'/'}>
                            <img
                                src={
                                    theme === 'primary'
                                        ? '/assets/logo/logo_white.svg'
                                        : '/assets/logo/logo_black.svg'
                                }
                                className="w-[70%] hover:scale-110 transition-all"
                            />
                        </Link>
                    </div>

                    {/* Menu Links for larger screens */}
                    <ul className="flex-row hidden sm:flex items-center">
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

                        {/* If the user is logged in, show the profile icon and logout */}
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="ml-8 focus:outline-none"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                        Logout
                                    </button>
                                </li>
                                <li className="ml-8 flex items-center">
                                    <FaUserCircle
                                        size={30}
                                        className="profile-icon"
                                        style={{ marginLeft: 'auto' }}
                                    />
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/login"
                                        className="ml-8 focus:outline-none"
                                    >
                                        Log In
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/signup"
                                        className="ml-8 focus:outline-none"
                                    >
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Mobile Menu Button */}
                    <button type="button" className="sm:hidden">
                        {!isMenuOpen ? (
                            <GiHamburgerMenu
                                className="scale-[2]"
                                onClick={toggleMenu(true)}
                            />
                        ) : (
                            <IoMdClose
                                className="scale-[2]"
                                onClick={toggleMenu(false)}
                            />
                        )}
                    </button>
                </div>
            </nav>
            {BurgerMenu}
        </>
    );
};

export default NavBar;
