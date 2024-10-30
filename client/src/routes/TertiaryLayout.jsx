import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const TertiaryLayout = () => {
    return (
        <>
            <NavBar theme={'tertiary'} />
            <Outlet />
            <Footer />
        </>
    );
};

export default TertiaryLayout;
