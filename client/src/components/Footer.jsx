import { FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { HiOutlinePhone } from 'react-icons/hi2';
import { IoMdMail } from 'react-icons/io';

const Footer = () => {
    return (
        <footer className="w-full flex flex-col items-center bg-white py-8 sm:py-10 md:py-12 lg:py-16">
            <div className="w-11/12 lg:w-5/6 flex flex-col lg:flex-row justify-between">
                
            
                <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-start mb-8 lg:mb-0">
                    <h1 className="text-2xl font-black mb-4">PYE</h1>
                    <div className="flex items-center mb-4">
                        <HiOutlinePhone className="scale-125 mr-3" />
                        <div>
                            <h1 className="font-bold">Phone</h1>
                            <p>(+000) 00-000-000</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <IoMdMail className="scale-125 mr-3" />
                        <div>
                            <h1 className="font-bold">Mail</h1>
                            <p>mail@gmail.com</p>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-3/5 flex flex-col md:flex-row justify-between text-center md:text-left">
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <p className="mb-2 hover:text-blue-500">Home Page</p>
                        <p className="mb-2 hover:text-blue-500">Contact Us</p>
                        <p className="mb-2 hover:text-blue-500">About Us</p>
                        <p className="mb-2 hover:text-blue-500">Blog Page</p>
                        <p className="mb-2 hover:text-blue-500">Services</p>
                    </div>
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <p className="mb-2 hover:text-blue-500">Terms & Conditions</p>
                        <p className="mb-2 hover:text-blue-500">Our Work</p>
                        <p className="mb-2 hover:text-blue-500">Testimonials</p>
                        <p className="mb-2 hover:text-blue-500">FAQ</p>
                    </div>
                    <div className="w-full md:w-1/3">
                        <p className="mb-2 hover:text-blue-500">Privacy Policy</p>
                        <p className="mb-2 hover:text-blue-500">Terms of Service</p>
                        <p className="mb-2 hover:text-blue-500">Copyright Information</p>
                    </div>
                </div>

                <div className="w-full lg:w-auto flex justify-center lg:justify-end items-center mt-6 lg:mt-0">
                    <FaInstagram className="mx-2 scale-125 hover:text-blue-500" />
                    <FaLinkedin className="mx-2 scale-125 hover:text-blue-500" />
                    <FaFacebook className="mx-2 scale-125 hover:text-blue-500" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
