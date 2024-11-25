import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';

const TertiaryLayout = () => {
    return (
        <>
            <NavBar theme={'tertiary'} />
            <Outlet />
        </>
    );
};

export default TertiaryLayout;
