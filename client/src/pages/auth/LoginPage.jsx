import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isOrg, setIsOrg] = useState(false); // Toggle between participant and organization

    const handleFormSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8080/login', {
                email,
                password,
                rememberMe,
                isOrg, // Send whether the user is an organization
            });

            if (response.data.success) {
                alert('Login successful');
                // Redirect to dashboard or homepage
                window.location.href = response.data.redirectUrl;
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Error logging in:', error.response?.data || error.message);
            alert('Login failed. Please try again.');
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#4F1ABE]">
            <form className="w-11/12 sm:w-3/5 md:w-3/5 lg:w-2/4 h-auto max-w-md flex flex-col bg-white rounded-lg p-6 justify-center items-center">
                <div className="w-11/12 sm:w-4/5 md:w-5/6 xl:w-5/6 h-full">
                    <h2 className="text-xl text-black font-bold mt-12 mb-4">
                        Log In
                    </h2>
                    <div className="flex flex-col w-full">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="email@live.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-auto p-4 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
                        />
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full h-auto p-4 border-[#6153CC] border-[1px] focus:outline-none invalid:border-red-500 my-2"
                        />
                    </div>
                    <div className="w-full h-auto flex justify-between items-center flex-row mb-6">
                        <div className="flex flex-row">
                            <input
                                type="checkbox"
                                name="remember_me"
                                id="remember_me"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="mr-2 w-4"
                            />
                            <h1 className="font-medium">Remember Me</h1>
                        </div>

                        <Link className="font-medium">Forgot Password?</Link>
                    </div>

                    {/* Toggle between Participant and Organization */}
                    <div className="w-full flex justify-between mb-4">
                        <button
                            type="button"
                            className={`py-2 px-8 rounded-md focus:outline-none transition-all duration-300 ${
                                !isOrg
                                    ? 'bg-[#4F1ABE] text-white'
                                    : 'bg-[#E0E0E0] text-[#4F1ABE] hover:bg-[#C5C5C5]'
                            }`}
                            onClick={() => setIsOrg(false)}
                        >
                            Participant
                        </button>
                        <button
                            type="button"
                            className={`py-2 px-8 rounded-md focus:outline-none transition-all duration-300 ${
                                isOrg
                                    ? 'bg-[#4F1ABE] text-white'
                                    : 'bg-[#E0E0E0] text-[#4F1ABE] hover:bg-[#C5C5C5]'
                            }`}
                            onClick={() => setIsOrg(true)}
                        >
                            Organization
                        </button>
                    </div>

                    <button
                        type="button"
                        className="py-2 px-24 bg-[#4F1ABE] text-white flex justify-center items-center rounded-md m-auto mb-4 text-sm md:text-base hover:bg-[#3E1399] transition-all duration-300"
                        onClick={handleFormSubmit}
                    >
                        Log In
                    </button>

                    <div className="w-full h-max flex flex-col justify-center items-center">
                        <p className="mb-4">or log in with</p>
                        <div className="flex flex-row w-2/3 justify-between">
                            <img
                                src="../assets/instagram_logo.svg"
                                alt="instagram"
                                className="w-6 h-8 hover:scale-105 transition-transform"
                            />
                            <img
                                src="../assets/facebook_logo.svg"
                                alt="facebook"
                                className="w-6 h-8 hover:scale-105 transition-transform"
                            />
                            <img
                                src="../assets/google_logo.svg"
                                alt="google"
                                className="w-6 h-8 hover:scale-105 transition-transform"
                            />
                            <img
                                src="../assets/linkedin_logo.svg"
                                alt="linkedin"
                                className="w-6 h-8 hover:scale-105 transition-transform"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
