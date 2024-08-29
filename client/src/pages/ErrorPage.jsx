import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div className="w-screen h-screen flex justify-center items-center flex-col bg-[#4F1ABE] text-white">
            <h1 className="text-3xl font-bold">404 Not Found</h1>
            <p className="text-xl mb-6">
                This page doesn&apos;t seem to exist.
            </p>
            <Link
                to="/"
                className="bg-[#44FFD1] py-4 px-8 border-none rounded-2xl text-black hover:scale-105 transition-all"
            >
                Go back to home page
            </Link>
        </div>
    );
};

export default ErrorPage;
