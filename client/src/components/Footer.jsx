import { FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { HiOutlinePhone } from 'react-icons/hi2';
import { IoMdMail } from 'react-icons/io';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    const primaryLinks = t('footer.primary-links', { returnObjects: true });
    const secondaryLinks = t('footer.secondary-links', { returnObjects: true });
    const tertiaryLinks = t('footer.tertiary-links', { returnObjects: true });

    return (
        <footer className="w-full flex flex-col items-center bg-white py-8 sm:py-10 md:py-12 lg:py-16">
            <div className="w-11/12 lg:w-5/6 flex flex-col lg:flex-row justify-between">
                <div className="w-full lg:w-2/5 flex flex-col items-center justify-end lg:items-start mb-8 lg:mb-0">
                    <img
                        src="/assets/logo/logo_black.svg"
                        alt="Logo"
                        className="w-[8%] hover:scale-110 transition-all mb-8"
                    />
                    <div className="flex items-center mb-8">
                        <HiOutlinePhone className="scale-125 mr-3" />
                        <div>
                            <h1 className="font-bold">{t('footer.phone')}</h1>
                            <p>(+000) 00-000-000</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <IoMdMail className="scale-125 mr-3" />
                        <div>
                            <h1 className="font-bold">{t('footer.email')}</h1>
                            <p>mail@gmail.com</p>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-3/5 mt-12 flex flex-col md:flex-row justify-between text-center md:text-left">
                    <div className="w-full md:w-1/3 flex flex-col justify-end space-y-2">
                        {Object.entries(primaryLinks).map(([key, value]) => (
                            <p key={key} className="hover:text-blue-500">
                                {value.label}
                            </p>
                        ))}
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col justify-end space-y-2">
                        {Object.entries(secondaryLinks).map(([key, value]) => (
                            <p key={key} className="hover:text-blue-500">
                                {value.label}
                            </p>
                        ))}
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col justify-end space-y-2">
                        {Object.entries(tertiaryLinks).map(([key, value]) => (
                            <p key={key} className="hover:text-blue-500">
                                {value.label}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-auto flex justify-center lg:justify-end items-center lg:mt-40">
                    <FaInstagram className="mx-2 scale-125 hover:text-blue-500" />
                    <FaLinkedin className="mx-2 scale-125 hover:text-blue-500" />
                    <FaFacebook className="mx-2 scale-125 hover:text-blue-500" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
