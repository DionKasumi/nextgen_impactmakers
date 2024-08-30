import { FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { HiOutlinePhone } from 'react-icons/hi2';
import { IoMdMail } from 'react-icons/io';

const Footer = () => {
    return (
        <footer className="w-screen h-min flex justify-center items-center bg-white relative bottom-0 py-16">
            <div className="w-5/6 h-full flex">
                <div className="w-2/5 h-full flex items-start flex-col">
                    <h1 className="text-2xl font-black">PYE</h1>
                    <div className="flex flex-row justify-center items-center mt-16">
                        <HiOutlinePhone className="scale-[2.5] ml-3 mr-8" />
                        <div>
                            <h1 className="font-bold">Phone</h1>
                            <p>(+000) 00-000-000</p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center mt-5">
                        <IoMdMail className="scale-[2.5] ml-3 mr-8" />
                        <div>
                            <h1 className="font-bold">Mail</h1>
                            <p>mail@gmail.com</p>
                        </div>
                    </div>
                </div>
                <div className="w-3/5 h-auto flex flex-row">
                    <div className="w-1/3 h-full flex justify-end flex-col">
                        <p>Home Page</p>
                        <p>Contact Us</p>
                        <p>About Us</p>
                        <p>Blog Page</p>
                        <p>Services</p>
                    </div>
                    <div className="w-1/3 h-full flex justify-end flex-col">
                        <p>Terms & Conditions</p>
                        <p>Our Work</p>
                        <p>Testimonials</p>
                        <p>Contact Us</p>
                        <p>FAQ</p>
                    </div>
                    <div className="w-1/3 h-full flex justify-end flex-col">
                        <p>Privacy Policy</p>
                        <p>Terms of Service</p>
                        <p>Copyright Information</p>
                    </div>
                </div>
                <div className="w-1/5 h-auto flex justify-end items-end flex-row">
                    <FaInstagram className="mr-4 scale-150 mb-1" />
                    <FaLinkedin className="mx-4 scale-150 mb-1" />
                    <FaFacebook className="ml-4 mr-1 scale-150 mb-1" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
