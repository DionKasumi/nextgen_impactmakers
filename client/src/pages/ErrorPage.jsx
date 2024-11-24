import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ErrorPage = () => {
    const { t } = useTranslation();

    return (
        <div className="w-screen h-screen flex justify-center items-center flex-col bg-[#4F1ABE] text-white">
            <h1 className="text-3xl font-bold">{t('error-page.text-1')}</h1>
            <p className="text-xl mb-6">{t('error-page.text-2')}</p>
            <Link
                to="/"
                className="bg-[#44FFD1] py-4 px-8 border-none rounded-2xl text-black hover:scale-105 transition-all"
            >
                {t('error-page.button-text')}
            </Link>
        </div>
    );
};

export default ErrorPage;
    