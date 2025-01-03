import './index.css';
import './styles/BackgroundGradient.css';
import './i18n';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PrimaryLayout from './routes/PrimaryLayout.jsx';
import SecondaryLayout from './routes/SecondaryLayout.jsx';
import TertiaryLayout from './routes/TertiaryLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignupPage from './pages/auth/SignupPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import TrainingsPage from './pages/TrainingsPage.jsx';
import TrainingDetailsPage from './pages/TrainingDetailsPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import EventDetailsPage from './pages/EventDetailsPage.jsx';
import InternshipsPage from './pages/InternshipPage.jsx';
import InternshipDetailsPage from './pages/InternshipDetailsPage.jsx';
import VolunteeringPage from './pages/VolunteeringPage.jsx';
import VolunteeringDetailsPage from './pages/VolunteeringDetailsPage.jsx';
import UserProfileORG from './pages/profiles/UserProfileORG.jsx';
import PostingPage from './pages/profiles/PostingPage.jsx';
import UserProfile from './pages/profiles/UserProfile.jsx';
import UserEditProfile from './pages/profiles/UserEditProfile.jsx';
import UserProfileMyapp from './pages/profiles/UserProfileMyapp.jsx';
import UserProfileMyappRate from './pages/profiles/UserProfileMyappRate.jsx';
import UserProfileMyappSaved from './pages/profiles/UserProfileMyappSaved.jsx';
import UserProfileAuth from './pages/auth/UserProfileAuth.jsx';
import { useTranslation } from 'react-i18next';

const router = createBrowserRouter([
    {
        path: '/',
        element: <PrimaryLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/contact',
                element: <ContactPage />,
            },
            {
                path: '/trainings',
                element: <TrainingsPage />,
            },
            {
                path: '/Events',
                element: <EventsPage />,
            },
            {
                path: '/Internships',
                element: <InternshipsPage />,
            },
            {
                path: '/Volunteering',
                element: <VolunteeringPage />,
            },
        ],
    },
    {
        path: '/',
        element: <SecondaryLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/courses/:id',
                element: <TrainingDetailsPage />,
            },
            {
                path: '/events/:id',
                element: <EventDetailsPage />,
            },
            {
                path: '/internships/:id',
                element: <InternshipDetailsPage />,
            },
            {
                path: '/volunteering/:id',
                element: <VolunteeringDetailsPage />,
            },
        ],
    },
    {
        path: '/',
        element: <TertiaryLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/profile/org',
                element: (
                    <UserProfileAuth type="org">
                        <UserProfileORG />
                    </UserProfileAuth>
                ),
            },
            {
                path: '/profile/org/post',
                element: (
                    <UserProfileAuth type="org">
                        <PostingPage />
                    </UserProfileAuth>
                ),
            },
            {
                path: '/profile',
                element: (
                    <UserProfileAuth>
                        <UserProfile />
                    </UserProfileAuth>
                ),
            },
            {
                path: '/profile/edit',
                element: (
                    <UserProfileAuth>
                        <UserEditProfile />
                    </UserProfileAuth>
                ),
            },
            {
                path: '/profile/myapp',
                element: (
                    <UserProfileAuth>
                        <UserProfileMyapp />
                    </UserProfileAuth>
                ),
            },
            {
                path: '/profile/rate',
                element: (
                    <UserProfileAuth>
                        <UserProfileMyappRate />
                    </UserProfileAuth>
                ),
            },
            {
                path: '/profile/saved',
                element: (
                    <UserProfileAuth>
                        <UserProfileMyappSaved />
                    </UserProfileAuth>
                ),
            },
        ],
    },

    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/signup',
        element: <SignupPage />,
    },
]);

const MainComponent = () => {
    // Used only to change language if needed
    // const { i18n } = useTranslation();
    // useEffect(() => {
    //     i18n.changeLanguage('al');
    // }, []);
    return (
        <StrictMode>
            <RouterProvider router={router} />
        </StrictMode>
    );
};

createRoot(document.getElementById('root')).render(<MainComponent />);
