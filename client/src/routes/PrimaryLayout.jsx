import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';

const PrimaryLayout = () => {
    return (
        <>
            <NavBar theme={'primary'} />
            <Outlet />
        </>
    );
};

export default PrimaryLayout;
