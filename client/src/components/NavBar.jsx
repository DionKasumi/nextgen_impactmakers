import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdClose } from 'react-icons/io';
import { useState, useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Collapse,
    Button,
    Menu,
    MenuItem,
} from '@mui/material';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { FaUserCircle, FaCircle } from 'react-icons/fa';
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

    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const handleCategoriesClick = () => {
        setCategoriesOpen(!categoriesOpen);
    };

    // Check session state when NavBar loads
    const checkSession = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/session'
            );
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
                    <ListItemButton
                        key={index}
                        sx={{
                            height: '3.5rem',
                            '&:hover': { bgcolor: '#A3A9FE80' },
                        }}
                    >
                        <Link
                            to={href}
                            className="w-full h-full flex flex-row items-center"
                        >
                            {label}
                        </Link>
                    </ListItemButton>
                ))}

                {/* Dynamic Links based on login state */}
                {isLoggedIn ? (
                    <>
                        <ListItemButton
                            sx={{
                                height: '3.5rem',
                                '&:hover': { bgcolor: '#A3A9FE80' },
                            }}
                        >
                            <button
                                onClick={handleLogout}
                                className="w-full h-full flex flex-row items-center"
                            >
                                Log Out
                            </button>
                        </ListItemButton>
                    </>
                ) : (
                    <>
                        <ListItemButton
                            sx={{
                                height: '3.5rem',
                                '&:hover': { bgcolor: '#A3A9FE80' },
                            }}
                        >
                            <Link
                                to={'/login'}
                                className="w-full h-full flex flex-row items-center"
                            >
                                Log In
                            </Link>
                        </ListItemButton>
                        <ListItemButton
                            sx={{
                                height: '3.5rem',
                                '&:hover': { bgcolor: '#A3A9FE80' },
                            }}
                        >
                            <Link
                                to={'/signup'}
                                className="w-full h-full flex flex-row items-center"
                            >
                                Sign Up
                            </Link>
                        </ListItemButton>
                    </>
                )}

                <ListItemButton
                    onClick={handleCategoriesClick}
                    sx={{
                        height: '3.5rem',
                        '&:hover': { bgcolor: '#A3A9FE80' },
                    }}
                >
                    <ListItemText primary="Categories" />
                    {categoriesOpen ? (
                        <MdExpandLess className="scale-150" />
                    ) : (
                        <MdExpandMore className="scale-150" />
                    )}
                </ListItemButton>
                <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            sx={{
                                height: '3.5rem',
                                padding: '0px',
                                '&:hover': { bgcolor: '#A3A9FE80' },
                            }}
                        >
                            <Link
                                to={'/events'}
                                className="w-full h-full flex flex-row items-center"
                                onClick={() => {
                                    handleCategoriesClick();
                                    toggleMenu(false);
                                }}
                            >
                                <FaCircle className="scale-50 ml-8 mr-2" />
                                Events
                            </Link>
                        </ListItemButton>
                        <ListItemButton
                            sx={{
                                height: '3.5rem',
                                padding: '0px',
                                '&:hover': { bgcolor: '#A3A9FE80' },
                            }}
                        >
                            <Link
                                to={'/internships'}
                                className="w-full h-full flex flex-row items-center"
                                onClick={() => {
                                    handleCategoriesClick();
                                    toggleMenu(false);
                                }}
                            >
                                <FaCircle className="scale-50 ml-8 mr-2" />
                                Internships
                            </Link>
                        </ListItemButton>
                        <ListItemButton
                            sx={{
                                height: '3.5rem',
                                padding: '0px',
                                '&:hover': { bgcolor: '#A3A9FE80' },
                            }}
                        >
                            <Link
                                to={'/volunteering'}
                                className="w-full h-full flex flex-row items-center"
                                onClick={() => {
                                    handleCategoriesClick();
                                    toggleMenu(false);
                                }}
                            >
                                <FaCircle className="scale-50 ml-8 mr-2" />
                                Volunteering
                            </Link>
                        </ListItemButton>
                        <ListItemButton
                            sx={{
                                height: '3.5rem',
                                padding: '0px',
                                '&:hover': { bgcolor: '#A3A9FE80' },
                            }}
                        >
                            <Link
                                to={'/trainings'}
                                className="w-full h-full flex flex-row items-center"
                                onClick={() => {
                                    handleCategoriesClick();
                                    toggleMenu(false);
                                }}
                            >
                                <FaCircle className="scale-50 ml-8 mr-2" />
                                Trainings
                            </Link>
                        </ListItemButton>
                    </List>
                </Collapse>
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

                        <li className="relative dropdown-wrapper">
                            <div className="flex flex-row justify-center items-center">
                                <h1
                                    className="ml-8 focus:outline-none cursor-pointer"
                                    onClick={handleCategoriesClick}
                                >
                                    Categories
                                </h1>
                                {categoriesOpen ? (
                                    <MdExpandLess className="scale-150 ml-2" />
                                ) : (
                                    <MdExpandMore className="scale-150 ml-2" />
                                )}
                            </div>
                            <ul
                                className={`absolute top-full left-0 bg-white text-black shadow-lg rounded-md mt-2 py-2 transition-all duration-300 ease-in-out transform ${
                                    categoriesOpen
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 -translate-y-3 pointer-events-none'
                                }`}
                            >
                                <li className="px-4 py-2 hover:bg-gray-200">
                                    <Link
                                        to={'/events'}
                                        onClick={handleCategoriesClick}
                                    >
                                        Events
                                    </Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-200">
                                    <Link
                                        to={'/internships'}
                                        onClick={handleCategoriesClick}
                                    >
                                        Internships
                                    </Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-200">
                                    <Link
                                        to={'/volunteering'}
                                        onClick={handleCategoriesClick}
                                    >
                                        Volunteering
                                    </Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-200">
                                    <Link
                                        to={'/trainings'}
                                        onClick={handleCategoriesClick}
                                    >
                                        Trainings
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        {/* If the user is logged in, show the profile icon and logout */}
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="ml-8 focus:outline-none"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0,
                                        }}
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
