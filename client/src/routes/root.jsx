import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';

const Root = () => {
    return (
        <>
            <NavBar theme={'primary'} />
            <Outlet />
        </>
    );
};

export default Root;
