import './index.css';
import { StrictMode } from 'react';
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
import UserProfileORG from './pages/UserProfileORG.jsx';
import PostingPage from './pages/PostingPage.jsx';
import UserProfile from './pages/UserProfile.jsx';
import UserEditProfile from './pages/UserEditProfile.jsx';

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
                path: '/UserProfileORG',
                element: <UserProfileORG />,
            },
            {
                path: '/PostingPage',
                element: <PostingPage />,
            },
            {
                path: '/UserProfile',
                element: <UserProfile />,
            },
            {
                path: '/UserEditProfile',
                element: <UserEditProfile />,
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

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
