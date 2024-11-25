import SectionWrapper from '../hoc/SectionWrapper';
import Footer from '../components/Footer';

const ContactPage = () => {
    return (
        <div className="flex flex-col">
            <div className="w-screen min-h-svh justify-center items-center flex flex-col bg-[#4F1ABE]">
                <h1 className="text-white text-3xl">Contact Us Page</h1>
            </div>
            <Footer />
        </div>
    );
};

export default SectionWrapper(ContactPage);
