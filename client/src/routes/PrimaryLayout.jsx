import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const PrimaryLayout = () => {
    return (
        <>
            <NavBar theme={'primary'} />
            <Outlet />
            <Footer />
        </>
    );
};

export default PrimaryLayout;
