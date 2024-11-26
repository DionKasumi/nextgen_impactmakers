import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdClose } from 'react-icons/io';
import { useState, useEffect } from 'react';
import {
    Box,
    List,
    ListItemButton,
    ListItemText,
    Collapse,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    ListItemIcon,
} from '@mui/material';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { FaUserCircle, FaCircle } from 'react-icons/fa';
import axios from 'axios';
import { ImExit } from 'react-icons/im';
import { useTranslation } from 'react-i18next';

axios.defaults.withCredentials = true; // Ensure Axios sends session cookies with requests

const NavBar = ({ theme }) => {
    const { t, i18n } = useTranslation();

    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOrg, setIsOrg] = useState(false);
    const navigate = useNavigate();
    let location = useLocation();

    // Toggle the mobile menu
    const toggleMenu = (newVal) => () => {
        setMenuOpen(newVal);
    };

    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const handleCategoriesClick = () => {
        setCategoriesOpen(!categoriesOpen);
        setProfileOpen(false);
        setLangOpen(false);
    };

    const [profileOpen, setProfileOpen] = useState(false);
    const handleProfileClick = () => {
        setProfileOpen(!profileOpen);
        setCategoriesOpen(false);
        setLangOpen(false);
    };

    const checkSession = async () => {
        try {
            const { data: sessionData } = await axios.get(
                'http://localhost:8080/api/session'
            );
            if (!sessionData.isLoggedIn) {
                setIsLoggedIn(false);
                return;
            }

            setIsLoggedIn(true);

            const { data: profileData } = await axios.get(
                'http://localhost:8080/api/user/profile'
            );
            setIsOrg(Boolean(profileData.description_of_org)); // Set true if 'description_of_org' exists, otherwise false
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

    const [lang, setLang] = useState(i18n.language);
    const [langOpen, setLangOpen] = useState(false);
    const handleLangClick = () => {
        setLangOpen(!langOpen);
        setProfileOpen(false);
        setCategoriesOpen(false);
    };
    const switchLanguage = () => {
        if (lang === 'en') {
            setLang('al');
            i18n.changeLanguage('al');
        } else {
            setLang('en');
            i18n.changeLanguage('en');
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    // Navigation items
    const NAV_ITEMS = [
        { href: '/', label: t('navbar.home') },
        { href: '/contact', label: t('navbar.contact-us') },
    ];

    const BurgerMenu = (
        <Box
            className={`w-[70%] h-screen flex flex-col fixed sm:hidden top-0 left-0 bg-white text-[#4F1ABE] z-[99] shadow-2xl ${
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

                <ListItemButton
                    onClick={handleCategoriesClick}
                    sx={{
                        height: '3.5rem',
                        '&:hover': { bgcolor: '#A3A9FE80' },
                    }}
                >
                    <ListItemText primary={t('navbar.categories.title')} />
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
                                {t('navbar.categories.items.events')}
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
                                {t('navbar.categories.items.internships')}
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
                                {t('navbar.categories.items.volunteering')}
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
                                {t('navbar.categories.items.trainings')}
                            </Link>
                        </ListItemButton>
                    </List>
                </Collapse>

                <ListItemButton
                    onClick={handleLangClick}
                    sx={{
                        height: '3.5rem',
                        '&:hover': { bgcolor: '#A3A9FE80' },
                    }}
                    className="flex flex-row justify-between"
                >
                    <img
                        src={`/assets/flags/${
                            lang == 'en'
                                ? 'united-kingdom-flag.svg'
                                : 'albanian-flag.svg'
                        }`}
                        alt=""
                        className="w-8"
                    />
                    {langOpen ? (
                        <MdExpandLess className="absolute scale-150 right-4" />
                    ) : (
                        <MdExpandMore className="absolute scale-150 right-4" />
                    )}
                </ListItemButton>
                <Collapse in={langOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            onClick={() => {
                                handleLangClick();
                                switchLanguage();
                            }}
                            sx={{
                                height: '3.5rem',
                                '&:hover': { bgcolor: '#A3A9FE80' },
                            }}
                        >
                            <img
                                src={`/assets/flags/${
                                    lang == 'en'
                                        ? 'albanian-flag.svg'
                                        : 'united-kingdom-flag.svg'
                                }`}
                                alt=""
                                className="w-8"
                            />
                        </ListItemButton>
                    </List>
                </Collapse>

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
                                <ImExit
                                    size={20}
                                    style={{ marginRight: '0.75rem' }}
                                />
                                {t('navbar.logout')}
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
                                {t('navbar.login')}
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
                                {t('navbar.signup')}
                            </Link>
                        </ListItemButton>
                    </>
                )}

                <ListItemButton
                    onClick={handleProfileClick}
                    sx={{
                        height: '3.5rem',
                        '&:hover': { bgcolor: '#A3A9FE80' },
                        display: isLoggedIn ? 'flex' : 'none',
                    }}
                >
                    <FaUserCircle
                        size={25}
                        className="profile-icon"
                        style={{ marginRight: '0.5rem' }}
                    />
                    <ListItemText primary={t('navbar.profile.title')} />
                    {profileOpen ? (
                        <MdExpandLess className="scale-150" />
                    ) : (
                        <MdExpandMore className="scale-150" />
                    )}
                </ListItemButton>
                <Collapse
                    in={profileOpen}
                    timeout="auto"
                    unmountOnExit
                    sx={{ display: isLoggedIn ? 'flex' : 'none' }}
                >
                    <List component="div" disablePadding>
                        <ListItemButton
                            sx={{
                                height: '3.5rem',
                                padding: '0px',
                                '&:hover': { bgcolor: '#A3A9FE80' },
                            }}
                        >
                            <Link
                                to={'/profile/edit'}
                                className="w-full h-full flex flex-row items-center"
                                onClick={() => {
                                    handleProfileClick();
                                    toggleMenu(false);
                                }}
                            >
                                <FaCircle className="scale-50 ml-8 mr-2" />
                                {t('navbar.profile.items.edit-profile')}
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
                                to={'/profile/myapp'}
                                className="w-full h-full flex flex-row items-center"
                                onClick={() => {
                                    handleProfileClick();
                                    toggleMenu(false);
                                }}
                            >
                                <FaCircle className="scale-50 ml-8 mr-2" />
                                {t('navbar.profile.items.my-applications')}
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
                                to={'/profile/saved'}
                                className="w-full h-full flex flex-row items-center"
                                onClick={() => {
                                    handleProfileClick();
                                    toggleMenu(false);
                                }}
                            >
                                <FaCircle className="scale-50 ml-8 mr-2" />
                                {t('navbar.profile.items.saved-for-later')}
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
                                to={'/profile/rate'}
                                className="w-full h-full flex flex-row items-center"
                                onClick={() => {
                                    handleProfileClick();
                                    toggleMenu(false);
                                }}
                            >
                                <FaCircle className="scale-50 ml-8 mr-2" />
                                {t('navbar.profile.items.rate-this-website')}
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
                className="w-full h-20 flex justify-center items-center fixed top-0 left-0 z-[99]"
                style={
                    theme === 'primary' || theme === 'tertiary'
                        ? {
                              backgroundColor: '#6A46D2',
                              color: 'white',
                          }
                        : theme === 'secondary'
                        ? {
                              backgroundColor: '#ffffff',
                              color: 'black',
                          }
                        : { backgroundColor: '', color: 'white' }
                }
            >
                <div className="w-5/6 h-full flex justify-between items-center">
                    <div className="h-full flex items-center">
                        <Link to={'/'}>
                            <img
                                src={
                                    theme === 'primary' || theme === 'tertiary'
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
                            <div className="flex flex-row justify-end items-center">
                                <h1
                                    className="ml-8 focus:outline-none cursor-pointer"
                                    onClick={handleCategoriesClick}
                                >
                                    {t('navbar.categories.title')}
                                </h1>
                                {categoriesOpen ? (
                                    <MdExpandLess className="scale-150 ml-2" />
                                ) : (
                                    <MdExpandMore className="scale-150 ml-2" />
                                )}
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
                                            {t(
                                                'navbar.categories.items.events'
                                            )}
                                        </Link>
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-200">
                                        <Link
                                            to={'/internships'}
                                            onClick={handleCategoriesClick}
                                        >
                                            {t(
                                                'navbar.categories.items.internships'
                                            )}
                                        </Link>
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-200">
                                        <Link
                                            to={'/volunteering'}
                                            onClick={handleCategoriesClick}
                                        >
                                            {t(
                                                'navbar.categories.items.volunteering'
                                            )}
                                        </Link>
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-200">
                                        <Link
                                            to={'/trainings'}
                                            onClick={handleCategoriesClick}
                                        >
                                            {t(
                                                'navbar.categories.items.trainings'
                                            )}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="relative dropdown-wrapper">
                            <div className="flex flex-row justify-end items-center">
                                <img
                                    src={`/assets/flags/${
                                        lang == 'en'
                                            ? 'united-kingdom-flag.svg'
                                            : 'albanian-flag.svg'
                                    }`}
                                    alt=""
                                    onClick={handleLangClick}
                                    className="w-8 ml-8"
                                />
                                {langOpen ? (
                                    <MdExpandLess className="scale-150 ml-2" />
                                ) : (
                                    <MdExpandMore className="scale-150 ml-2" />
                                )}
                                <ul
                                    className={`absolute top-full right-[20%] bg-white text-black shadow-lg rounded-md mt-2 py-2 transition-all duration-300 ease-in-out transform ${
                                        langOpen
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 -translate-y-3 pointer-events-none'
                                    }`}
                                >
                                    <li className="px-2 hover:bg-gray-200">
                                        <img
                                            src={`/assets/flags/${
                                                lang == 'en'
                                                    ? 'albanian-flag.svg'
                                                    : 'united-kingdom-flag.svg'
                                            }`}
                                            alt=""
                                            onClick={() => {
                                                handleLangClick();
                                                switchLanguage();
                                            }}
                                            className="w-8"
                                        />
                                    </li>
                                </ul>
                            </div>
                        </li>

                        {/* If the user is logged in, show the profile icon */}
                        {isLoggedIn ? (
                            <>
                                <div
                                    className="flex flex-row justify-end ml-6"
                                    onClick={handleProfileClick}
                                >
                                    <FaUserCircle
                                        size={30}
                                        className="profile-icon"
                                    />
                                    <ul
                                        className={`absolute top-full bg-white text-black shadow-lg rounded-md -mt-5 py-2 transition-all duration-300 ease-in-out transform ${
                                            profileOpen
                                                ? 'opacity-100 translate-y-0'
                                                : 'opacity-0 -translate-y-3 pointer-events-none'
                                        }`}
                                    >
                                        {isOrg ? (
                                            <>
                                                <li className="px-4 py-2 hover:bg-gray-200">
                                                    <Link
                                                        to={'/profile/org'}
                                                        onClick={
                                                            handleCategoriesClick
                                                        }
                                                    >
                                                        {t(
                                                            'navbar.profile.items.view-profile'
                                                        )}
                                                    </Link>
                                                </li>
                                            </>
                                        ) : (
                                            <>
                                                <li className="px-4 py-2 hover:bg-gray-200">
                                                    <Link
                                                        to={'/profile'}
                                                        onClick={
                                                            handleCategoriesClick
                                                        }
                                                    >
                                                        {t(
                                                            'navbar.profile.items.view-profile'
                                                        )}
                                                    </Link>
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-200">
                                                    <Link
                                                        to={'/profile/edit'}
                                                        onClick={
                                                            handleCategoriesClick
                                                        }
                                                    >
                                                        {t(
                                                            'navbar.profile.items.edit-profile'
                                                        )}
                                                    </Link>
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-200">
                                                    <Link
                                                        to={'/profile/myapp'}
                                                        onClick={
                                                            handleCategoriesClick
                                                        }
                                                    >
                                                        {t(
                                                            'navbar.profile.items.my-applications'
                                                        )}
                                                    </Link>
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-200">
                                                    <Link
                                                        to={'/profile/saved'}
                                                        onClick={
                                                            handleCategoriesClick
                                                        }
                                                    >
                                                        {t(
                                                            'navbar.profile.items.saved-for-later'
                                                        )}
                                                    </Link>
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-200">
                                                    <Link
                                                        to={'/profile/rate'}
                                                        onClick={
                                                            handleCategoriesClick
                                                        }
                                                    >
                                                        {t(
                                                            'navbar.profile.items.rate-this-website'
                                                        )}
                                                    </Link>
                                                </li>
                                            </>
                                        )}
                                        <li className="px-4 py-2 hover:bg-gray-200">
                                            <button
                                                onClick={handleLogout}
                                                className="flex flex-row items-center"
                                            >
                                                <ImExit className="mr-2" />
                                                {t('navbar.logout')}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/login"
                                        className="ml-8 focus:outline-none"
                                    >
                                        {t('navbar.login')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/signup"
                                        className="ml-8 focus:outline-none"
                                    >
                                        {t('navbar.signup')}
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
