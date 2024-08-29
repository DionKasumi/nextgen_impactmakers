/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

const NavBar = ({ theme }) => {
    return (
        <nav
            className="w-full h-16 text-white flex justify-center items-center fixed top-0 left-0 z-50"
            style={
                theme == 'primary'
                    ? { backgroundColor: '#4F1ABE' }
                    : { backgroundColor: '#fffff' }
            }
        >
            <div className="w-5/6 h-full flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-xl">PYE</h1>
                </div>
                <ul className="flex-row hidden sm:flex">
                    <li>
                        <Link to="/" className="ml-8 focus:outline-none">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="ml-8 focus:outline-none">
                            Log In
                        </Link>
                    </li>
                    <li>
                        <Link to="/signup" className="ml-8 focus:outline-none">
                            Sign Up
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="ml-8 focus:outline-none">
                            Contact Us
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
