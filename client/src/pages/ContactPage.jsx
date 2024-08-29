/* eslint-disable react-refresh/only-export-components */
import SectionWrapper from '../hoc/SectionWrapper';

const ContactPage = () => {
    return (
        <div className="w-screen min-h-svh justify-center items-center flex flex-col bg-[#4F1ABE]">
            <h1 className="text-white text-3xl">Contact Us Page</h1>
        </div>
    );
};

export default SectionWrapper(ContactPage);
